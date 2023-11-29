import prisma from './db'
import { testUsers, testCategories, testPlaces } from './globalSetup'

const userIds: string[] = testUsers.map((user) => user.id)
const categoryIds: string[] = testCategories.map((category) => category.id)
const placeIds: string[] = testPlaces.map((place) => place.id)

const teardown = async () => {
    await prisma.user.deleteMany({
        where: {
            id: {
                in: userIds,
            },
        },
    })

    await prisma.category.deleteMany({
        where: {
            id: {
                in: categoryIds,
            },
        },
    })

    await prisma.place.deleteMany({
        where: {
            id: {
                in: placeIds,
            },
        },
    })
    console.log('---------TESTS FINISHED--------')
}

export default teardown
