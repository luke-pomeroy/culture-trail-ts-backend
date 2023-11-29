import express from 'express'
import * as AuthController from './auth.controllers'
import { validate } from '../../middleware/validate.middleware'
import { credentialsSchema } from '../users/users.schemas'
import { checkDuplicateEmail } from '../../middleware/auth.middleware'

const router = express.Router()

router.post(
    '/login',
    validate({ body: credentialsSchema }),
    AuthController.login
)

router.post(
    '/register',
    validate({ body: credentialsSchema }),
    checkDuplicateEmail,
    AuthController.register
)

router.post('/refreshToken', AuthController.refreshTokens)

export default router
