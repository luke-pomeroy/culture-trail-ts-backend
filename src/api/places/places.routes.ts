import { Router } from 'express'
import { requireUser, requireAdminOrEditor } from '../../middleware/auth.middleware'
import { validate } from '../../middleware/validate.middleware'
import { placeSchema, categoryIdsSchema } from './places.schemas'
import * as PlaceController from './places.controllers'

const router = Router()

router.get(
    '/:placeId',
    [requireUser],
    PlaceController.findById
)
router.get('/', requireUser, PlaceController.findAll)
router.post(
    '/:placeId/categories',
    [requireUser, requireAdminOrEditor, validate({body: categoryIdsSchema})],
    PlaceController.addCategoriesById
)
router.post(
    '/',
    [requireUser, requireAdminOrEditor, validate({ body: placeSchema })],
    PlaceController.createOne
)
router.put(
    '/:placeId',
    [requireUser, requireAdminOrEditor, validate({ body: placeSchema })],
    PlaceController.updateOne
)
router.delete(
    '/:placeId/categories',
    [requireUser, requireAdminOrEditor, validate({body: categoryIdsSchema})],
    PlaceController.removeCategoriesById
)
router.delete(
    '/:placeId',
    [
        requireUser,
        requireAdminOrEditor,
    ],
    PlaceController.deleteOne
)

export default router
