import request from 'supertest'
import app from '../../app'

const validUserAccessToken = process.env.VALID_ACCESS_TOKEN_FOR_TESTING_USER1!
const validEditorAccessToken =
    process.env.VALID_ACCESS_TOKEN_FOR_TESTING_EDITOR!
let mediaId: string = ''

const media = {
    filename: 'Test media 1.jpg',
}

describe('GET /api/v1/media', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .get('/api/v1/media')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with array of media in body.data', async () => {
        const response = await request(app)
            .get('/api/v1/media')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(Array.isArray(response.body.data.media)).toBe(true)
    })
})

describe('POST /api/v1/media', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .post('/api/v1/media')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .post('/api/v1/media')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)
            .send(media)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with a validation error if media is invalid', async () => {
        const response = await request(app)
            .post('/api/v1/media')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with the inserted media in body.data', async () => {
        const response = await request(app)
            .post('/api/v1/media')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send(media)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Media successfully created.')
        expect(response.body.data.media).toHaveProperty('id')
        expect(response.body.data.media).toHaveProperty('filename')
        expect(response.body.data.media).toHaveProperty('caption')
        expect(response.body.data.media).toHaveProperty('creditLine')
        expect(response.body.data.media).toHaveProperty('createdAt')
        expect(response.body.data.media).toHaveProperty('updatedAt')
        expect(response.body.data.filename).toBe(media.filename)
        mediaId = response.body.data.media.id
    })
})

describe('GET /api/v1/media/:mediaId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .get(`/api/v1/media/${mediaId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if media not exists', async () => {
        const response = await request(app)
            .get(`/api/v1/media/123345`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })

    it('responds with the correct media in body.data', async () => {
        const response = await request(app)
            .post(`/api/v1/media/${mediaId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(response.body.data.media).toHaveProperty('id')
        expect(response.body.data.media).toHaveProperty('filename')
        expect(response.body.data.media).toHaveProperty('caption')
        expect(response.body.data.media).toHaveProperty('creditLine')
        expect(response.body.data.media).toHaveProperty('createdAt')
        expect(response.body.data.media).toHaveProperty('updatedAt')
    })
})

describe('PUT /api/v1/media/:mediaId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .put(`/api/v1/media/${mediaId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if media not exists', async () => {
        const response = await request(app)
            .put(`/api/v1/media/123345`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send({ filename: 'Test Media 1 updated' })

        expect(response.statusCode).toBe(404)
    })

    it('responds with a validation error if media is invalid', async () => {
        const response = await request(app)
            .put(`/api/v1/media/${mediaId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .put(`/api/v1/media/${mediaId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)
            .send({ filename: 'Test Media 1 updated' })

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with the updated media in body.data', async () => {
        const response = await request(app)
            .post(`/api/v1/media${mediaId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)
            .send({ filename: 'Test Media 1 updated' })

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Media successfully updated.')
        expect(response.body.data.media).toHaveProperty('id')
        expect(response.body.data.media).toHaveProperty('filename')
        expect(response.body.data.media).toHaveProperty('caption')
        expect(response.body.data.media).toHaveProperty('creditLine')
        expect(response.body.data.media).toHaveProperty('createdAt')
        expect(response.body.data.media).toHaveProperty('updatedAt')
        expect(response.body.data.media.filename).toBe('Test Media 1 updated')
    })
})

describe('DELETE /api/v1/media/:mediaId', () => {
    it('responds with an error if access token is missing', async () => {
        const response = await request(app)
            .del(`/api/v1/media/${mediaId}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with a not found error if media not exists', async () => {
        const response = await request(app)
            .del(`/api/v1/media/123345`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })

    it('responds with a validation error if media is invalid', async () => {
        const response = await request(app)
            .del(`/api/v1/media/${mediaId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Validation Error')
    })

    it('responds with an error if user is not Admin or Editor', async () => {
        const response = await request(app)
            .del(`/api/v1/media/${mediaId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validUserAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(403)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe(
            'Admin or Editor permissions required to access this route.'
        )
    })

    it('responds with the deleted media in body.data', async () => {
        const response = await request(app)
            .post(`/api/v1/media${mediaId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Media successfully deleted.')
        expect(response.body.data.media).toHaveProperty('id')
        expect(response.body.data.media).toHaveProperty('filename')
        expect(response.body.data.media).toHaveProperty('caption')
        expect(response.body.data.media).toHaveProperty('creditLine')
        expect(response.body.data.media).toHaveProperty('createdAt')
        expect(response.body.data.media).toHaveProperty('updatedAt')
    })

    it('responds with a not found error on subsequent request for deleted media', async () => {
        const response = await request(app)
            .del(`/api/v1/media/${mediaId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validEditorAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(404)
    })
})
