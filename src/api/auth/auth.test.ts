import request from 'supertest'
import app from '../../app'
import prisma from '../../db'
import * as bcrypt from 'bcrypt'
import { generateRefreshToken } from '../../utils/jwt'
import cuid from 'cuid'
import { hashToken } from '../../utils/hashToken'
import { globalUserCredentials } from '../../globalSetup'

describe('POST /api/v1/auth/register', () => {
    afterAll(async () => {
        await prisma.user.delete({
            where: {
                email: 'culture-trail@culture-trail.com',
            },
        })
    })

    it('responds with an error if payload is missing', async () => {
        const response = await request(app)
            .post('/api/v1/auth/register')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
    })

    it('responds with an error if payload email is missing ', async () => {
        const payload = {
            password: 'TestUser123',
        }

        const response = await request(app)
            .post('/api/v1/auth/register')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(payload)

        expect(response.statusCode).toBe(400)
    })

    it('responds with an error if password is missing ', async () => {
        const payload = {
            email: 'culture-trail@culture-trail.com',
        }
        const response = await request(app)
            .post('/api/v1/auth/register')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(payload)

        expect(response.statusCode).toBe(400)
    })

    it('responds with an accessToken and refreshToken in data of body', async () => {
        const payload = {
            email: 'culture-trail@culture-trail.com',
            password: 'TestUser123',
        }

        const response = await request(app)
            .post('/api/v1/auth/register')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(payload)

        expect(response.statusCode).toBe(201)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('User registered successfully.')
        expect(response.body.data).toHaveProperty('accessToken')
        expect(response.body.data).toHaveProperty('refreshToken')
        expect(response.body.data.accessToken).toEqual(expect.any(String))
        expect(response.body.data.refreshToken).toEqual(expect.any(String))
    })
})

describe('POST /api/v1/auth/login', () => {
    it('responds with an error if payload is missing', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
    })

    it('responds with an error if payload email is missing ', async () => {
        const payload = {
            password: 'TestUser123',
        }

        const response = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(payload)

        expect(response.statusCode).toBe(400)
    })

    it('responds with an error if password is missing ', async () => {
        const payload = {
            email: 'culture-trail@culture-trail.com',
        }
        const response = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(payload)

        expect(response.statusCode).toBe(400)
    })

    it('responds with unauthorized if user is missing from db', async () => {
        const payload = {
            email: 'test@test.com',
            password: 'TestUser123',
        }
        const response = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(payload)

        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Invalid login credentials.')
    })

    it('responds with unauthorized if password is wrong', async () => {
        const payload = {
            ...globalUserCredentials.user1,
            password: 'wrongPassw0rd',
        }
        const response = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send(payload)

        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('Invalid login credentials.')
    })

    it('responds with an accessToken and refreshToken in data of body', async () => {
        const response = await request(app)
            .post('/api/v1/auth/login')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                email: globalUserCredentials.user1.email,
                password: globalUserCredentials.user1.password,
            })

        expect(response.statusCode).toBe(200)
        expect(response.body.data).toHaveProperty('accessToken')
        expect(response.body.data).toHaveProperty('refreshToken')
        expect(response.body.data.accessToken).toEqual(expect.any(String))
        expect(response.body.data.refreshToken).toEqual(expect.any(String))
    })
})

describe('POST /api/v1/auth/refreshToken', () => {
    const userCredentials = {
        email: 'culture-trail@refresh.com',
        password: 'TestUser123',
    }

    let expiredRefreshToken = ''
    let validRefreshToken = ''
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let refreshTokenNotPresentInDb = ''

    beforeAll(async () => {
        const user = await prisma.user.create({
            data: {
                email: userCredentials.email,
                password: bcrypt.hashSync(userCredentials.password, 12),
            },
        })

        expiredRefreshToken = generateRefreshToken(
            { userId: user.id, jti: cuid() },
            '1s'
        )

        const jti = cuid()
        validRefreshToken = generateRefreshToken({ userId: user.id, jti }, '5m')
        refreshTokenNotPresentInDb = generateRefreshToken(
            { userId: user.id, jti: cuid() },
            '5m'
        )

        await prisma.refreshToken.create({
            data: {
                id: jti,
                hashedToken: hashToken(validRefreshToken),
                userId: user.id,
            },
        })
    })

    afterAll(async () => {
        await prisma.user.delete({
            where: {
                email: userCredentials.email,
            },
        })
    })

    it('responds with error if refreshToken is missing from body', async () => {
        const response = await request(app)
            .post('/api/v1/auth/refreshToken')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)

        expect(response.statusCode).toBe(400)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('A refresh token is required.')
    })

    it('responds with Unauthorized if token is expired', async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const response = await request(app)
            .post('/api/v1/auth/refreshToken')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({ refreshToken: expiredRefreshToken })

        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('jwt expired')
    })

    it('responds with Unauthorized if token is not present in db', async () => {
        const response = await request(app)
            .post('/api/v1/auth/refreshToken')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({ refreshToken: '1231231a' })

        expect(response.statusCode).toBe(401)
        expect(response.body).toHaveProperty('message')
        expect(response.body.message).toBe('jwt malformed')
    })

    it('responds with an accessToken and refreshToken', async () => {
        const response = await request(app)
            .post('/api/v1/auth/refreshToken')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({ refreshToken: validRefreshToken })

        expect(response.statusCode).toBe(200)
        expect(response.body.data).toHaveProperty('accessToken')
        expect(response.body.data).toHaveProperty('refreshToken')
        expect(response.body.data.accessToken).toEqual(expect.any(String))
        expect(response.body.data.refreshToken).toEqual(expect.any(String))
    })
})
