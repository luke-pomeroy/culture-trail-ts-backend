import request from 'supertest'
import app from '../../app'
import { globalUserCredentials } from '../../globalSetup'

const validAccessToken = process.env.VALID_ACCESS_TOKEN_FOR_TESTING_USER1!

describe('GET /api/v1/users/me', () => {
    it('responds with an error if token is missing', async () => {
        const response = await request(app)
            .get('/api/v1/users/me')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(401)
    })

    it('responds with id and email', async () => {
        const response = await request(app)
            .get('/api/v1/users/me')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${validAccessToken}`)
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body).toHaveProperty('email')
        expect(response.body.id).toBe(globalUserCredentials.user1.id)
        expect(response.body.email).toBe(globalUserCredentials.user1.email)
    })
})
