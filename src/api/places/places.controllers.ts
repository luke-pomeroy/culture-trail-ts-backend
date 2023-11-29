import { Response, Request, NextFunction } from 'express'
import * as PlaceService from './places.services'
import { Prisma } from '@prisma/client'

export async function findAll(req: Request, res: Response, next: NextFunction) {
    try {
        let places = await PlaceService.findAll()

        res.json({
            status: 'success',
            statusCode: '200',
            data: {
                places: places
            },
        })
    } catch (error) {
        next(error)
    }
}

export async function findById( req: Request, res: Response, next: NextFunction ) {
    try {
        const { placeId } = req.params

        const place = await PlaceService.findById(placeId)

        if (!place) {
            res.status(404)
            throw new Error('Place not found.')
        }

        res.json({
            status: 'success',
            message: 'Category found.',
            statusCode: '200',
            data: {
                place: place,
            },
        })
    } catch (error) {
        next(error)
    }
}

export async function createOne( req: Request, res: Response, next: NextFunction ) {
    try {
        const placeData = req.body

        const place = await PlaceService.createOne(placeData)

        res.status(201).json({
            status: 'success',
            message: 'Place successfully created.',
            statusCode: '201',
            data: {
                place: place,
            },
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                error.message = 'Place with this name already exists.'
                res.status(403)
            }
            console.log(error.code)
            if  (error.code === 'P2025') {
                error.message = 'Category not found.'
                res.status(404)
            }
        }
        next(error)
    }
}

export async function updateOne( req: Request, res: Response, next: NextFunction ) {
    try {
        const { placeId } = req.params
        const placeData = req.body
        const place = await PlaceService.updateOne(
            placeId,
            placeData
        )

        if (!place) {
            res.status(404)
            throw new Error('Category not found.')
        }

        res.json({
            status: 'success',
            message: 'Place successfully updated.',
            statusCode: '204',
            data: {
                place: place
            },
        })
    } catch (error) {
        next(error)
    }
}

export async function deleteOne( req: Request, res: Response, next: NextFunction ) {
    try {
        const { placeId } = req.params
        const place = await PlaceService.deleteById(placeId)

        if (!place) {
            res.status(404)
            throw new Error('Place not found.')
        }

        res.json({
            status: 'success',
            message: 'Place successfully deleted.',
            statusCode: '200',
            data: {
                place: place,
            },
        })
    } catch (error) {
        next(error)
    }
}

export async function addCategoriesById( req: Request, res: Response, next: NextFunction ) {
    try {
        const { placeId } = req.params
        const { categoryIds } = req.body
        const place = await PlaceService.connectCategoriesById(placeId, categoryIds)
    
        res.status(201).json({
            status: 'success',
            message: 'Categories successfully linked.',
            statusCode: '201',
            data: {
                place: place,
            },
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2016') {
                error.message = 'Place not found.'
                res.status(404)
            } else if(error.code === 'P2025') {
                error.message = 'Category not found.'
                res.status(404)
            }
        }
        next(error)
    }
}

export async function removeCategoriesById( req: Request, res: Response, next: NextFunction) {
    try {
        const { placeId } = req.params
        const { categoryIds } = req.body
        const place = await PlaceService.disconnectCategoriesById(placeId, categoryIds)
    
        res.status(200).json({
            status: 'success',
            message: 'Categories successfully removed.',
            statusCode: '200',
            data: {
                place: place,
            },
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2016') {
                error.message = 'Place not found.'
                res.status(404)
            } else if(error.code === 'P2025') {
                error.message = 'Category not found.'
                res.status(404)
            }
        }
        next(error)
    }
}