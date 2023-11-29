import { Request, Response, NextFunction } from 'express'
import prisma from '../db'
import { ParsedAccessToken } from '../interfaces/ParsedAccessToken'
import { verifyAccessToken } from '../utils/jwt'

export const checkDuplicateEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        })

        if (user) {
            res.status(400)
            throw new Error('User already registered!')
        }
    } catch (error) {
        next(error)
    }

    next()
}

export function deserializeUserAndRoles(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const accessToken = (req.headers.authorization || '').replace(
            /^Bearer\s/,
            ''
        )
        if (!accessToken) {
            return next()
        }
        const payload = verifyAccessToken(accessToken) as ParsedAccessToken
        req.user = payload

        next()
    } catch (error) {
        next()
    }
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
    try {
        const user = req.user

        if (!user) {
            res.status(401)
            throw new Error('Unauthorized.')
        }
        next()
    } catch (error) {
        next(error)
    }
}

export const requireAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user.roles.includes('admin')) {
        return next()
    }
    res.status(403)
    const error = new Error('Admin permissions required to access this route.')
    next(error)
}

export const requireAdminOrEditor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user.roles.includes('editor') || req.user.roles.includes('admin')) {
        return next()
    }
    res.status(403)
    const error = new Error(
        'Admin or Editor permissions required to access this route.'
    )
    next(error)
}
