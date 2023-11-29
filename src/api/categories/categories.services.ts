import prismaNotFound from '../../utils/prismaNotFound'
import prisma from '../../db'
import { Category, Prisma } from '@prisma/client'
import { CategoryInput } from './categories.schemas'

export function findAll() {
    return prisma.category.findMany()
}

export function findById(id: Category['id']) {
    return prisma.category.findUnique({
        where: {
            id,
        },
        include: { places: true },
    })
}

export function createOne(category: CategoryInput) {

    return prisma.category.create({
        data: {
            ...category,
            places: {
                connect: category.places
            },
        },
        include: { places: true },
    })
}

export function updateOne(
    id: Category['id'],
    category: Prisma.CategoryCreateInput
) {
    return prismaNotFound(
        prisma.category.update({
        where: {
            id,
        },
        data: {
            ...category,
        },
        include: { places: true },
    })
    )
}

export function deleteById(id: Category['id']) {
        return prismaNotFound(
            prisma.category.delete({
            where: {
                id,
            },
        })
        )   
}

export function connectPlacesById(
    categoryId: Category['id'],
    placeIds: Prisma.PlaceWhereUniqueInput[]
) {
    return prisma.category.update({
        data: {
            places: {
                connect: placeIds
            }
        },
        where: {
            id: categoryId,
            
        },
        include: {
            places: true
        }
    })
}

export function disconnectPlacesById(
    categoryId: Category['id'],
    placeIds: Prisma.PlaceWhereUniqueInput[]
    ) {
    return prisma.category.update({
        data: {
            places: {
                disconnect: placeIds
            }
        },
        where: {
            id: categoryId,
            
        },
        include: {
            places: true
        }
    })
}
