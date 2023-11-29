import prismaNotFound from '../../utils/prismaNotFound'
import prisma from '../../db'
import { Place, Prisma } from '@prisma/client'
import { PlaceInput } from './places.schemas'
import { placeIdSchema } from 'api/categories/categories.schemas'

export function findAll() {
    return prisma.place.findMany()
}

export function findById(id: Place['id']) {
    return prisma.place.findUnique({
        where: {
            id,
        },
        include: { categories: true, media: true },
    })
}

export function createOne(place: PlaceInput) {

    return prisma.place.create({
        data: {
            ...place,
            categories: {
                connect: place.categories
            },
        },
        include: { categories: true, media: true },
    })
}

export function updateOne(
    id: Place['id'],
    place: Prisma.PlaceCreateInput
) {
    return prismaNotFound(
        prisma.place.update({
        where: {
            id,
        },
        data: {
            ...place,
        },
        include: { categories: true, media: true },
    })
    )
}

export function deleteById(id: Place['id']) {
        return prismaNotFound(
            prisma.place.delete({
            where: {
                id,
            },
        })
        )   
}

export function connectCategoriesById(
    placeId: Place['id'],
    categoryIds: Prisma.CategoryWhereUniqueInput[]
) {
    return prisma.place.update({
        data: {
            categories: {
                connect: categoryIds
            }
        },
        where: {
            id: placeId,
            
        },
        include: {
            categories: true, media: true
        }
    })
}

export function disconnectCategoriesById(
    placeId: Place['id'],
    categoryIds: Prisma.CategoryWhereUniqueInput[]
    ) {
    return prisma.place.update({
        data: {
            categories: {
                disconnect: categoryIds
            }
        },
        where: {
            id: placeId,
            
        },
        include: {
            categories: true, media: true
        }
    })
}
