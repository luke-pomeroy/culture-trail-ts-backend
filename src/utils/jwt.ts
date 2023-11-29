import * as jwt from 'jsonwebtoken'
import { User } from '@prisma/client'
import { config } from './config'

export interface IAccessTokenPayload {
    userId: User['id']
    roles: string[]
}
export interface IRefreshTokenPayload {
    userId: User['id']
    jti: string
}

export function generateAccessToken(
    payload: IAccessTokenPayload,
    expiresIn: string | number = config.jwt_access_lifetime
) {
    return jwt.sign(payload, config.jwt_access_secret, {
        expiresIn,
    })
}

export function generateRefreshToken(
    payload: IRefreshTokenPayload,
    expiresIn: string | number = config.jwt_refresh_lifetime
) {
    return jwt.sign(payload, config.jwt_refresh_secret, {
        expiresIn,
    })
}

export function generateTokens(user: User, roles: string[], jti: string) {
    const accessTokenPayload: IAccessTokenPayload = {
        userId: user.id,
        roles: roles,
    }
    const refreshTokenPayload: IRefreshTokenPayload = {
        jti: jti,
        userId: user.id,
    }
    const accessToken = generateAccessToken(accessTokenPayload)
    const refreshToken = generateRefreshToken(refreshTokenPayload)

    return {
        accessToken,
        refreshToken,
    }
}

export function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, config.jwt_refresh_secret)
    } catch (error) {
        throw error
    }
}

export function verifyAccessToken(token: string) {
    try {
        return jwt.verify(token, config.jwt_access_secret)
    } catch (error) {
        throw error
    }
}
