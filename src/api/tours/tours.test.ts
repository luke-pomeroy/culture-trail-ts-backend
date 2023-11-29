import request from 'supertest'
import app from '../../app'
import { testPlaces } from 'globalSetup'

const validUser1AccessToken = process.env.VALID_ACCESS_TOKEN_FOR_TESTING_USER1!
const validUser2AccessToken = process.env.VALID_ACCESS_TOKEN_FOR_TESTING_USER2!
const validAdminAccessToken = process.env.VALID_ACCESS_TOKEN_FOR_TESTING_ADMIN!

let tourId: string = ''

const tour = {
    name: 'Tour 1',
}

const placeIds: string[] = testPlaces.map((place) => place.id)

const tourWithPlaces = {
    name: 'Tour 2',
    places: placeIds,
}

describe('GET /api/v1/tours', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .get('/api/v1/tours')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with array of tours owned by user in body.data', async () => {
        const response = await request(app)
            .get('/api/v1/tours')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body.data.tours)).toBe(true)
        expect(response.body.data.tours.length).toBe(1)
    })

    it('responds with array of all tours if user is Admin', async () => {
        const response = await request(app)
            .get('/api/v1/tours')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validAdminAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body.data.tours)).toBe(true)
        expect(response.body.data.tours.length).toBe(2)
    })
})

describe('POST /api/v1/tours', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .post('/api/v1/tours')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a validation error if tour is invalid', async () => {
        const response = await request(app)
            .post('/api/v1/tours')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with the inserted tour in body.data', async () => {
        const response = await request(app)
            .post('/api/v1/tours')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)
            .send(tour)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Tour successfully created.')
        expect(response.body.data.tour).toHaveProperty('id')
        expect(response.body.data.tour).toHaveProperty('name')
        expect(response.body.data.tour).toHaveProperty('status')
        expect(response.body.data.tour).toHaveProperty('completedOn')
        expect(response.body.data.tour).toHaveProperty('description')
        expect(response.body.data.tour).toHaveProperty('createdAt')
        expect(response.body.data.tour).toHaveProperty('updatedAt')
        expect(response.body.data.tour.name).toBe(tour.name)
        expect(response.body.data.tour.status).toBe('draft')
        tourId = response.body.data.tour.id
    })

    it('responds with the inserted tour and related places in body.data', async () => {
        const response = await request(app)
            .post('/api/v1/tours')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)
            .send(tourWithPlaces)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Tour successfully created.')
        expect(response.body.data.tour).toHaveProperty('id')
        expect(response.body.data.tour).toHaveProperty('name')
        expect(response.body.data.tour).toHaveProperty('status')
        expect(response.body.data.tour).toHaveProperty('completedOn')
        expect(response.body.data.tour).toHaveProperty('description')
        expect(response.body.data.tour).toHaveProperty('places')
        expect(response.body.data.tour).toHaveProperty('createdAt')
        expect(response.body.data.tour).toHaveProperty('updatedAt')
        expect(response.body.data.tour.name).toBe(tourWithPlaces.name)
        expect(response.body.data.tour.status).toBe('draft')
        expect(Array.isArray(response.body.data.tour.places)).toBe(true)
        expect(response.body.data.tour.places.length).toBe(3)
    })
})

describe('GET /api/v1/tours/:tourId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .get(`/api/v1/tours/${tourId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if tour not exists', async () => {
        const response = await request(app)
            .get(`/api/v1/tours/123345`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })

    it('responds with the correct tour in body.data', async () => {
        const response = await request(app)
            .post(`/api/v1/tours/${tourId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(response.body.data.tour).toHaveProperty('id')
        expect(response.body.data.tour).toHaveProperty('name')
        expect(response.body.data.tour).toHaveProperty('status')
        expect(response.body.data.tour).toHaveProperty('description')
        expect(response.body.data.tour).toHaveProperty('createdAt')
        expect(response.body.data.tour).toHaveProperty('updatedAt')
    })
})

describe('PUT /api/v1/tours/:tourId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .put(`/api/v1/tours/${tourId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if tour not exists', async () => {
        const response = await request(app)
            .put(`/api/v1/tours/123345`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)
            .send(tour)

        expect(response.statusCode).toBe(404)
    })

    it('responds with a validation error if tour is invalid', async () => {
        const response = await request(app)
            .put(`/api/v1/tours/${tourId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with an error if tour does not belong to user', async () => {
        const response = await request(app)
            .put(`/api/v1/tours/${tourId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser2AccessToken}`)
            .expect('Content-Type', /json/)
            .send({ name: 'Tour 1 updated' })

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Unauthorised.')
    })

    it('responds with the updated tour in body.data', async () => {
        const response = await request(app)
            .post(`/api/v1/tours/${tourId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)
            .send({ name: 'Tour 1 updated' })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Tour successfully updated.')
        expect(response.body.data.tour).toHaveProperty('id')
        expect(response.body.data.tour).toHaveProperty('name')
        expect(response.body.data.tour).toHaveProperty('status')
        expect(response.body.data.tour).toHaveProperty('description')
        expect(response.body.data.tour).toHaveProperty('createdAt')
        expect(response.body.data.tour).toHaveProperty('updatedAt')
        expect(response.body.data.tour.name).toBe('Tour 1 updated')
        expect(response.body.data.tour.status).toBe('published')
    })
})

describe('DELETE /api/v1/tours/:tourId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .del(`/api/v1/tours/${tourId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if tour not exists', async () => {
        const response = await request(app)
            .del(`/api/v1/tours/123345`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })

    it('responds with an error if tour does not belong to user', async () => {
        const response = await request(app)
            .put(`/api/v1/tours/${tourId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser2AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Unauthorised.')
    })

    it('responds with the deleted tour in body.data', async () => {
        const response = await request(app)
            .post(`/api/v1/tours/${tourId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Tour successfully deleted.')
        expect(response.body.data.tour).toHaveProperty('id')
        expect(response.body.data.tour).toHaveProperty('name')
        expect(response.body.data.tour).toHaveProperty('status')
        expect(response.body.data.tour).toHaveProperty('description')
        expect(response.body.data.tour).toHaveProperty('createdAt')
        expect(response.body.data.tour).toHaveProperty('updatedAt')
    })

    it('responds with a not found error on request for deleted tour', async () => {
        const response = await request(app)
            .del(`/api/v1/tours/${tourId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })
})

describe('POST /api/v1/tours/:tourId/places', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .post(`/api/v1/tours/${tourId}/places`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with an error if tour does not belong to user', async () => {
        const response = await request(app)
            .post(`/api/v1/tours/${tourId}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser2AccessToken}`)
            .expect('Content-Type', /json/)
            .send(placeIds)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Unauthorised.')
    })

    it('responds with a validation error if placesIds are invalid', async () => {
        const response = await request(app)
            .post(`/api/v1/tours/${tourId}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with array of added PlaceIds in body.data', async () => {
        const response = await request(app)
            .post(`/api/v1/tours/${tourId}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)
            .send(placeIds)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Places sucessfully linked.')
        expect(response.body.data).toHaveProperty('placeIds')
        expect(Array.isArray(response.body.data.placeIds)).toBe(true)
        expect(response.body.data.placeIds.length).toBe(3)
    })
})

describe('DELETE /api/v1/tours/:tourId/places', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .del(`/api/v1/tours/${tourId}/places`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if tour not exists', async () => {
        const response = await request(app)
            .del('/api/v1/tour/123345/places')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })

    it('responds with a validation error if no placeIds provided in body', async () => {
        const response = await request(app)
            .del(`/api/v1/tours/${tourId}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })

    it('responds with an error if tour does not belong to user', async () => {
        const response = await request(app)
            .del(`/api/v1/tours/${tourId}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser2AccessToken}`)
            .expect('Content-Type', /json/)
            .send(placeIds)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Unauthorised.')
    })

    it('responds with the deleted placeIds in body.data', async () => {
        const response = await request(app)
            .del(`/api/v1/tours/${tourId}/places`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)
            .send(placeIds)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Places successfully deleted.')
        expect(response.body.data).toHaveProperty('placeIds')
        expect(Array.isArray(response.body.data.placeIds)).toBe(true)
        expect(response.body.data.placeIds.length).toBe(3)
    })

    it('responds with empty array for places confiming they have been removed', async () => {
        const response = await request(app)
            .get(`/api/v1/tours/${tourId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUser1AccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
    })
})
