import { Response, Request, NextFunction } from 'express'
import * as CategoryService from './categories.services'
import { Prisma } from '@prisma/client'

export async function findAll(req: Request, res: Response, next: NextFunction) {
    try {
        let categories = await CategoryService.findAll()

        res.json({
            status: 'success',
            statusCode: '200',
            message: 'Logged in succesfully.',
            data: {
                categories: categories,
            },
        })
    } catch (error) {
        next(error)
    }
}

export async function findById( req: Request, res: Response, next: NextFunction ) {
    try {
        const { categoryId } = req.params

        const category = await CategoryService.findById(categoryId)

        if (!category) {
            res.status(404)
            throw new Error('Category not found.')
        }

        res.json({
            status: 'success',
            message: 'Category found.',
            statusCode: '200',
            data: {
                category: category,
            },
        })
    } catch (error) {
        next(error)
    }
}

export async function createOne( req: Request, res: Response, next: NextFunction ) {
    try {
        const categoryData = req.body

        const category = await CategoryService.createOne(categoryData)

        res.status(201).json({
            status: 'success',
            message: 'Category successfully created.',
            statusCode: '201',
            data: {
                category: category,
            },
        })
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                error.message = 'Category with this name already exists.'
                res.status(403)
            }
            console.log(error.code)
            if  (error.code === 'P2025') {
                error.message = 'Place not found.'
                res.status(404)
            }
        }
        next(error)
    }
}

export async function updateOne( req: Request, res: Response, next: NextFunction ) {
    try {
        const { categoryId } = req.params
        const categoryData = req.body
        const category = await CategoryService.updateOne(
            categoryId,
            categoryData
        )

        if (!category) {
            res.status(404)
            throw new Error('Category not found.')
        }

        res.json({
            status: 'success',
            message: 'Category successfully updated.',
            statusCode: '204',
            data: {
                category: category,
            },
        })
    } catch (error) {
        next(error)
    }
}

export async function deleteOne( req: Request, res: Response, next: NextFunction ) {
    try {
        const { categoryId } = req.params
        const category = await CategoryService.deleteById(categoryId)

        if (!category) {
            res.status(404)
            throw new Error('Category not found.')
        }

        res.json({
            status: 'success',
            message: 'Category successfully deleted.',
            statusCode: '200',
            data: {
                category: category,
            },
        })
    } catch (error) {
        next(error)
    }
}

export async function addPlacesById( req: Request, res: Response, next: NextFunction ) {
    try {
        const { categoryId } = req.params
        const { placeIds } = req.body
        const category = await CategoryService.connectPlacesById(categoryId, placeIds)
    
        res.status(201).json({
            status: 'success',
            message: 'Places successfully linked.',
            statusCode: '201',
            data: {
                category: category,
            },
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2016') {
                error.message = 'Category not found.'
                res.status(404)
            } else if(error.code === 'P2025') {
                error.message = 'Place not found.'
                res.status(404)
            }
        }
        next(error)
    }
}

export async function removePlacesById( req: Request, res: Response, next: NextFunction) {
    try {
        const { categoryId } = req.params
        const { placeIds } = req.body
        const category = await CategoryService.disconnectPlacesById(categoryId, placeIds)
    
        res.status(200).json({
            status: 'success',
            message: 'Places successfully removed.',
            statusCode: '200',
            data: {
                category: category,
            },
        })
    } catch (error) {
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2016') {
                error.message = 'Category not found.'
                res.status(404)
            } else if(error.code === 'P2025') {
                error.message = 'Place not found.'
                res.status(404)
            }
        }
        next(error)
    }
}