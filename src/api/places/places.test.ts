import request from 'supertest'
import app from '../../app'

const validUserAccessToken = process.env.VALID_ACCESS_TOKEN_FOR_TESTING_USER1!
const validEditorAccessToken =
    process.env.VALID_ACCESS_TOKEN_FOR_TESTING_EDITOR!
let placeId: string = ''

const place = {
    name: 'Place 1',
    description: 'A new place',
}

describe('GET /api/v1/places', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .get('/api/v1/places')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with array of places in body.data', async () => {
        const response = await request(app)
            .get('/api/v1/places')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body.data.places)).toBe(true)
    })
})

describe('POST /api/v1/places', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .post('/api/v1/places')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .post('/api/v1/places')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)
            .send(place)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with a validation error if place is invalid', async () => {
        const response = await request(app)
            .post('/api/v1/places')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with the inserted place in body.data', async () => {
        const response = await request(app)
            .post('/api/v1/places')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send(place)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Place successfully created.')
        expect(response.body.data.place).toHaveProperty('id')
        expect(response.body.data.place).toHaveProperty('name')
        expect(response.body.data.place).toHaveProperty('description')
        expect(response.body.data.place).toHaveProperty('externalLink')
        expect(response.body.data.place).toHaveProperty('latitude')
        expect(response.body.data.place).toHaveProperty('longitude')
        expect(response.body.data.place).toHaveProperty('createdAt')
        expect(response.body.data.place).toHaveProperty('updatedAt')
        expect(response.body.data.place.name).toBe(place.name)
        expect(response.body.data.place.description).toBe(place.description)
        expect(response.body.data.place.status).toBe('draft')
        placeId = response.body.data.place.id
    })
})

describe('POST /api/v1/places', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .post('/api/v1/places')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .post('/api/v1/places')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)
            .send(place)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with a validation error if place is invalid', async () => {
        const response = await request(app)
            .post('/api/v1/places')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with the inserted place in body.data', async () => {
        const response = await request(app)
            .post('/api/v1/places')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send(place)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Place successfully created.')
        expect(response.body.data.place).toHaveProperty('id')
        expect(response.body.data.place).toHaveProperty('name')
        expect(response.body.data.place).toHaveProperty('description')
        expect(response.body.data.place).toHaveProperty('externalLink')
        expect(response.body.data.place).toHaveProperty('latitude')
        expect(response.body.data.place).toHaveProperty('longitude')
        expect(response.body.data.place).toHaveProperty('createdAt')
        expect(response.body.data.place).toHaveProperty('updatedAt')
        expect(response.body.data.place.name).toBe(place.name)
        expect(response.body.data.place.description).toBe(place.description)
    })
})

describe('GET /api/v1/places/:placeId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .get(`/api/v1/places/${placeId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if place not exists', async () => {
        const response = await request(app)
            .get(`/api/v1/places/123345`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })

    it('responds with the correct place in body.data', async () => {
        const response = await request(app)
            .post(`/api/v1/places/${placeId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(response.body.data.place).toHaveProperty('id')
        expect(response.body.data.place).toHaveProperty('name')
        expect(response.body.data.place).toHaveProperty('description')
        expect(response.body.data.place).toHaveProperty('externalLink')
        expect(response.body.data.place).toHaveProperty('latitude')
        expect(response.body.data.place).toHaveProperty('longitude')
        expect(response.body.data.place).toHaveProperty('createdAt')
        expect(response.body.data.place).toHaveProperty('updatedAt')
    })
})

describe('PUT /api/v1/places/:placeId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .put(`/api/v1/places/${placeId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if place not exists', async () => {
        const response = await request(app)
            .put(`/api/v1/places/123345`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send({ name: 'Place 1 updated', description: 'New description' })

        expect(response.statusCode).toBe(404)
    })

    it('responds with a validation error if place is invalid', async () => {
        const response = await request(app)
            .put(`/api/v1/places/${placeId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .put(`/api/v1/places/${placeId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)
            .send({ name: 'Place 1 updated', description: 'New description' })

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with the updated place in body.data', async () => {
        const response = await request(app)
            .post(`/api/v1/places/${placeId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send({ name: 'Place 1 updated', description: 'New description' })

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Place successfully updated.')
        expect(response.body.data.place).toHaveProperty('id')
        expect(response.body.data.place).toHaveProperty('name')
        expect(response.body.data.place).toHaveProperty('description')
        expect(response.body.data.place).toHaveProperty('externalLink')
        expect(response.body.data.place).toHaveProperty('latitude')
        expect(response.body.data.place).toHaveProperty('longitude')
        expect(response.body.data.place).toHaveProperty('createdAt')
        expect(response.body.data.place).toHaveProperty('updatedAt')
        expect(response.body.data.place.name).toBe('Place 1 updated')
        expect(response.body.data.place.description).toBe('New description')
    })
})

describe('DELETE /api/v1/places/:placeId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .del(`/api/v1/places/${placeId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if place not exists', async () => {
        const response = await request(app)
            .del(`/api/v1/places/123345`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .del(`/api/v1/places/${placeId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with the deleted place in body.data', async () => {
        const response = await request(app)
            .post(`/api/v1/places/${placeId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Place successfully deleted.')
        expect(response.body.data.place).toHaveProperty('id')
        expect(response.body.data.place).toHaveProperty('name')
        expect(response.body.data.place).toHaveProperty('description')
        expect(response.body.data.place).toHaveProperty('externalLink')
        expect(response.body.data.place).toHaveProperty('latitude')
        expect(response.body.data.place).toHaveProperty('longitude')
        expect(response.body.data.place).toHaveProperty('createdAt')
        expect(response.body.data.place).toHaveProperty('updatedAt')
    })

    it('responds with not found on subsequent request for deleted place', async () => {
        const response = await request(app)
            .post(`/api/v1/places/${placeId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })
})

//TODO: add POST to add categories to places (eg array of place IDs in body) eg /places/:placeId/categories
//If category exists, link it, if not create. If already linked, no action. Return summary of data with linked/created/already linked.
//TODO: add DEL to unlink category from place
