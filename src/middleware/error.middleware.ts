import e, { Request, Response, NextFunction } from 'express'
import { ErrorResponse } from 'interfaces/ApiResponse'
import { config } from '../utils/config'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404)
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
    next(error)
}
export function errorHandler(
    err: Error,
    req: Request,
    res: Response<ErrorResponse>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) {
    const response: ErrorResponse = {
        status: 'error',
        statusCode: '',
        message: err.message || '',
        stack: config.environment === 'production' ? '🥞' : err.stack,
    }

    if (err instanceof ZodError) {
        response.message = 'Validation Error'
        response.errors = err.flatten().fieldErrors
    }
    
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500
    res.status(statusCode)
    response.statusCode = statusCode.toString()

    res.json(response)
}
