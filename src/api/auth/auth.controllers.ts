import cuid from 'cuid'
import { Response, Request, NextFunction } from 'express'
import { generateTokens, verifyRefreshToken } from '../../utils/jwt'
import {
    createUserByEmailAndPassword,
    findUserWithRolesByEmail,
    findUserWithRolesById,
} from '../users/users.services'
import {
    addRefreshTokenToWhitelist,
    revokeRefreshToken,
    findRefreshTokenById,
} from './auth.services'
import bcrypt from 'bcrypt'
import { hashToken } from '../../utils/hashToken'

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body

        const user = await createUserByEmailAndPassword({ email, password })
        const jti = cuid()

        const { accessToken, refreshToken } = generateTokens(user, [], jti)

        await addRefreshTokenToWhitelist({ jti, refreshToken, userId: user.id })
        res.status(201)
        res.json({
            status: 'success',
            statusCode: '201',
            message: 'User registered successfully.',
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        })
    } catch (error) {
        next(error)
    }
}

export async function login(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { email, password } = req.body
        const user = await findUserWithRolesByEmail(email)

        if (!user) {
            res.status(401)
            throw new Error('Invalid login credentials.')
        }

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            res.status(401)
            throw new Error('Invalid login credentials.')
        }

        const roles = user.roles.map(({ role }) => role.name)
        const jti = cuid()
        const { accessToken, refreshToken } = generateTokens(user, roles, jti)

        await addRefreshTokenToWhitelist({
            jti,
            refreshToken,
            userId: user.id,
        })

        res.json({
            status: 'success',
            statusCode: '200',
            message: 'Logged in succesfully.',
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        })
    } catch (error) {
        next(error)
    }
}

export async function refreshTokens(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const refreshToken = req.body.refreshToken
        if (!refreshToken) {
            res.status(400)
            throw new Error('A refresh token is required.')
        }

        const payload = verifyRefreshToken(refreshToken) as {
            userId: string
            jti: string
        }

        const savedRefreshToken = await findRefreshTokenById(payload.jti)
        if (!savedRefreshToken || savedRefreshToken.revoked === true) {
            res.status(401)
            throw new Error('Unauthorised.')
        }

        const hashedToken = hashToken(refreshToken)
        if (hashedToken !== savedRefreshToken.hashedToken) {
            res.status(401)
            throw new Error('Unauthorised.')
        }

        const user = await findUserWithRolesById(payload.userId)
        if (!user) {
            res.status(401)
            throw new Error('Unauthorised.')
        }

        await revokeRefreshToken(savedRefreshToken.id)
        const roles = user.roles.map(({ role }) => role.name)
        const jti = cuid()
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(
            user,
            roles,
            jti
        )

        await addRefreshTokenToWhitelist({
            jti,
            refreshToken: newRefreshToken,
            userId: user.id,
        })

        res.json({
            status: 'success',
            statusCode: '200',
            message: 'Refresh Token issued successfully.',
            data: {
                accessToken: accessToken,
                refreshToken: refreshToken,
            },
        })
    } catch (error) {
        if (
            error instanceof Error &&
            (error.name === 'TokenExpiredError' ||
                error.name === 'JsonWebTokenError')
        ) {
            res.status(401)
        }
        next(error)
    }
}
