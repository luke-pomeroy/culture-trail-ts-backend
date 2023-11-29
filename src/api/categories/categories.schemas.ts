import * as z from 'zod'

export const placeIdSchema = z.object({id: z.string()})
export const placeIdsSchema = z.object({placeIds: z.array(placeIdSchema)})

export const categorySchema = z.object({
    name: z.string({ required_error: 'Name is required' }),
    description: z.string().optional(),
    places: z.array(placeIdSchema).optional()
})



export type CategoryInput = z.infer<typeof categorySchema>