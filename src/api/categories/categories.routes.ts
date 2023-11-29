import { Router } from 'express'
import { requireUser, requireAdminOrEditor } from '../../middleware/auth.middleware'
import { validate } from '../../middleware/validate.middleware'
import { categorySchema, placeIdsSchema } from './categories.schemas'
import * as CategoryController from './categories.controllers'

const router = Router()

router.get(
    '/:categoryId',
    [requireUser],
    CategoryController.findById
)
router.get('/', requireUser, CategoryController.findAll)
router.post(
    '/:categoryId/places',
    [requireUser, requireAdminOrEditor, validate({body: placeIdsSchema})],
    CategoryController.addPlacesById
)
router.post(
    '/',
    [requireUser, requireAdminOrEditor, validate({ body: categorySchema })],
    CategoryController.createOne
)
router.put(
    '/:categoryId',
    [requireUser, requireAdminOrEditor, validate({ body: categorySchema })],
    CategoryController.updateOne
)
router.delete(
    '/:categoryId/places',
    [requireUser, requireAdminOrEditor, validate({body: placeIdsSchema})],
    CategoryController.removePlacesById
)
router.delete(
    '/:categoryId',
    [
        requireUser,
        requireAdminOrEditor,
    ],
    CategoryController.deleteOne
)

export default router
