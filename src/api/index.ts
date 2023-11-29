import express from 'express'
import { SuccessResponse } from 'interfaces/ApiResponse'
import authRoutes from './auth/auth.routes'
import usersRoutes from './users/users.routes'
import categoriesRoutes from './categories/categories.routes'
import placesRoutes from './places/places.routes'

const router = express.Router()

router.get<object, SuccessResponse>('/', (req, res) => {
    res.json({
        status: 'success',
        statusCode: '200',
        message: 'API V1 - 👋',
    })
})

router.use('/auth', authRoutes)
router.use('/users', usersRoutes)
router.use('/categories', categoriesRoutes)
router.use('/places', placesRoutes)

export default router
