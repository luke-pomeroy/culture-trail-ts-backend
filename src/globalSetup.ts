import prisma from './db'
import { Category, Place } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { generateAccessToken } from './utils/jwt'
import { GlobalUserCredentials } from 'interfaces/GlobalUserCredentials'

export const testUsers = [
    {
        name: 'admin',
        id: 'cl9fpgbug00132e6djr6s4ydz',
        email: 'admin@test.com',
        password: 'TestAdmin-123',
        roles: ['admin'],
    },
    {
        name: 'editor',
        id: 'cl9fpgbug11032e6rdr5s4yda',
        email: 'editor@test.com',
        password: 'TestEditor-123',
        roles: ['editor'],
    },
    {
        name: 'user1',
        id: 'cl9fpgbug00032e6djr6s4ydf',
        email: 'user1@test.com',
        password: 'TestUser1-123',
        roles: [],
    },
    {
        name: 'user2',
        id: 'cl9fpgbug34032e6djr6s4ydf',
        email: 'user2@test.com',
        password: 'TestUser2-123',
        roles: [],
    },
]

// export as global object with user.name as key for use in tests
export const globalUserCredentials: GlobalUserCredentials = testUsers.reduce(
    (obj, user) => ({ ...obj, [user.name]: user }),
    {}
)
export const testCategories: Category[] = []
export const testPlaces: Place[] = []

const setup = async () => {
    console.log('\n---------TESTS STARTED--------')
    //Test records for Places and Categories

    for (let i = 0; i < 6; i++) {
        let category = await prisma.category.create({
            data: {
                name: `Test category ${i}`,
            },
        })
        testCategories.push(category)

        let place = await prisma.place.create({
            data: {
                name: `Test place ${i}`,
            },
        })
        testPlaces.push(place)
    }

    // user setup
    for (const user of testUsers) {
        // create the user
        await prisma.user.create({
            data: {
                id: user.id,
                password: bcrypt.hashSync(user.password, 12),
                email: user.email,
            },
        })

        //Add a tour with 3 places to each of the normal users
        if (user.name.startsWith('user')) {
            const tourPlaceIds = testPlaces.map((place) => ({ id: place.id }))
            prisma.tour.create({
                data: {
                    name: `Tour for ${user.name} with 3 places linked`,
                    userId: user.id,
                    places: {
                        connect: tourPlaceIds,
                    },
                },
            })
        }

        const validUserToken = generateAccessToken(
            { userId: user.id, roles: user.roles },
            '15m'
        )
        const envKey =
            'VALID_ACCESS_TOKEN_FOR_TESTING_' + user.name.toUpperCase()
        process.env[envKey] = validUserToken
    }
}

export default setup
