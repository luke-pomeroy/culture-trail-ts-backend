import request from 'supertest'
import app from '../../app'
import prisma from '../../db'

const validUserAccessToken = process.env.VALID_ACCESS_TOKEN_FOR_TESTING_USER1!
const validEditorAccessToken =
    process.env.VALID_ACCESS_TOKEN_FOR_TESTING_EDITOR!

let categoryId1: string = ''
let categoryId2: string = ''

const category1 = {
    name: 'Category 1',
}

let category2 = {
    name: 'Test Category 2',
    places: [{}],
}

beforeAll(async () => {
    category2.places = await prisma.place.findMany({
        select: {
            id: true,
        },
    })
})

describe('GET /api/v1/categories', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .get('/api/v1/categories')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with array of categories in body.data', async () => {
        const response = await request(app)
            .get('/api/v1/categories')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body.data.categories)).toBe(true)
        expect(response.body.data.categories.length).toBe(6)
    })
})

describe('POST /api/v1/categories', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .post('/api/v1/categories')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .post('/api/v1/categories')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)
            .send(category1)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with a validation error if category is invalid', async () => {
        const response = await request(app)
            .post('/api/v1/categories')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with the inserted category in body.data', async () => {
        const response = await request(app)
            .post('/api/v1/categories')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send(category1)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Category successfully created.')
        expect(response.body.data.category).toHaveProperty('id')
        expect(response.body.data.category).toHaveProperty('name')
        expect(response.body.data.category).toHaveProperty('description')
        expect(response.body.data.category).toHaveProperty('createdAt')
        expect(response.body.data.category).toHaveProperty('updatedAt')
        expect(response.body.data.category.name).toBe(category1.name)
        categoryId1 = response.body.data.category.id
    })

    it('responds with the inserted category and linked places in body.data', async () => {
        const response = await request(app)
            .post('/api/v1/categories')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send(category2)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Category successfully created.')
        expect(response.body.data.category).toHaveProperty('id')
        expect(response.body.data.category).toHaveProperty('name')
        expect(response.body.data.category).toHaveProperty('description')
        expect(response.body.data.category).toHaveProperty('places')
        expect(response.body.data.category).toHaveProperty('createdAt')
        expect(response.body.data.category).toHaveProperty('updatedAt')
        expect(response.body.data.category.name).toBe(category2.name)
        expect(Array.isArray(response.body.data.category.places)).toBe(true)
        expect(response.body.data.category.places.length).toBe(6)
        categoryId2 = response.body.data.category.id
    })
})

describe('GET /api/v1/categories/:categoryId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .get(`/api/v1/categories/${categoryId1}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if category not exists', async () => {
        const response = await request(app)
            .get(`/api/v1/categories/123345`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })

    it('responds with the correct category and array of related places in body.data', async () => {
        const response = await request(app)
            .get(`/api/v1/categories/${categoryId2}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(response.body.data.category).toHaveProperty('id')
        expect(response.body.data.category).toHaveProperty('name')
        expect(response.body.data.category).toHaveProperty('description')
        expect(response.body.data.category).toHaveProperty('places')
        expect(response.body.data.category).toHaveProperty('createdAt')
        expect(response.body.data.category).toHaveProperty('updatedAt')
        expect(response.body.data.category.name).toBe(category2.name)
        expect(Array.isArray(response.body.data.category.places)).toBe(true)
        expect(response.body.data.category.places.length).toBe(6)
    })
})

describe('PUT /api/v1/categories/:categoryId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .put(`/api/v1/categories/${categoryId1}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if category not exists', async () => {
        const response = await request(app)
            .put(`/api/v1/categories/123345`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send({ name: 'Category 1 updated' })
            
        expect(response.statusCode).toBe(404)
    })

    it('responds with a validation error if category is invalid', async () => {
        const response = await request(app)
            .put(`/api/v1/categories/${categoryId1}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .put(`/api/v1/categories/${categoryId1}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)
            .send({ name: 'Category 1 updated' })

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with the updated category in body.data', async () => {
        const response = await request(app)
            .put(`/api/v1/categories/${categoryId1}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send({ name: 'Category 1 updated' })

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Category successfully updated.')
        expect(response.body.data.category).toHaveProperty('id')
        expect(response.body.data.category).toHaveProperty('name')
        expect(response.body.data.category).toHaveProperty('description')
        expect(response.body.data.category).toHaveProperty('places')
        expect(Array.isArray(response.body.data.category.places)).toBe(true)
        expect(response.body.data.category).toHaveProperty('createdAt')
        expect(response.body.data.category).toHaveProperty('updatedAt')
        expect(response.body.data.category.name).toBe('Category 1 updated')
    })
})

describe('DELETE /api/v1/categories/:categoryId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .del(`/api/v1/categories/${categoryId2}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if category not exists', async () => {
        const response = await request(app)
            .del('/api/v1/categories/123345')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .del(`/api/v1/categories/${categoryId2}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with the deleted category in body.data', async () => {
        const response = await request(app)
            .del(`/api/v1/categories/${categoryId2}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Category successfully deleted.')
        expect(response.body.data.category).toHaveProperty('id')
        expect(response.body.data.category).toHaveProperty('name')
        expect(response.body.data.category).toHaveProperty('description')
        expect(response.body.data.category).toHaveProperty('createdAt')
        expect(response.body.data.category).toHaveProperty('updatedAt')
    })

    it('responds with not found on subsequent request for deleted category', async () => {
        const response = await request(app)
            .get(`/api/v1/categories/${categoryId2}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })
})

describe('POST /api/v1/categories/:categoryId/places', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .post(`/api/v1/categories/${categoryId1}/places`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .post(`/api/v1/categories/${categoryId1}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)
            .send(category2.places)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with a validation error if places are invalid', async () => {
        const response = await request(app)
            .post(`/api/v1/categories/${categoryId1}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with an array of added placeIds in body.data', async () => {
        const response = await request(app)
            .post(`/api/v1/categories/${categoryId1}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send({placeIds: category2.places})

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Places successfully linked.')
        expect(response.body.data.category).toHaveProperty('id')
        expect(response.body.data.category).toHaveProperty('name')
        expect(response.body.data.category).toHaveProperty('description')
        expect(response.body.data.category).toHaveProperty('createdAt')
        expect(response.body.data.category).toHaveProperty('updatedAt')
        expect(response.body.data.category).toHaveProperty('places')
        expect(Array.isArray(response.body.data.category.places)).toBe(true)
        expect(response.body.data.category.places.length).toBe(6)
    })
})

describe('DELETE /api/v1/categories/:categoryId/places', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .del(`/api/v1/categories/${categoryId1}/places`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if category not exists', async () => {
        const response = await request(app)
            .del('/api/v1/categories/123345/places')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send({placeIds: category2.places})

        expect(response.statusCode).toBe(404)
    })

    it('responds with a validation error if no placeIds provided in body', async () => {
        const response = await request(app)
            .del(`/api/v1/categories/${categoryId1}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .del(`/api/v1/categories/${categoryId1}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)
            .send({placeIds: category2.places})

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with the category, minus deleted places', async () => {
        const response = await request(app)
            .del(`/api/v1/categories/${categoryId1}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send({placeIds: category2.places})

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Places successfully removed.')
        expect(response.body.data.category).toHaveProperty('id')
        expect(response.body.data.category).toHaveProperty('name')
        expect(response.body.data.category).toHaveProperty('description')
        expect(response.body.data.category).toHaveProperty('createdAt')
        expect(response.body.data.category).toHaveProperty('updatedAt')
        expect(response.body.data.category).toHaveProperty('places')
        expect(Array.isArray(response.body.data.category.places)).toBe(true)
        expect(response.body.data.category.places.length).toBe(0)
    })

    it('responds with empty array for places confiming they have been removed', async () => {
        const response = await request(app)
            .get(`/api/v1/categories/${categoryId1}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(response.body.data.category).toHaveProperty('places')
        expect(Array.isArray(response.body.data.category.places)).toBe(true)
        expect(response.body.data.category.places.length).toBe(0)
    })
})
