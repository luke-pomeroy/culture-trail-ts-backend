import * as z from 'zod'

export const categoryIdSchema = z.object({id: z.string()})
export const categoryIdsSchema = z.object({categoryIds: z.array(categoryIdSchema)})

export const placeSchema = z.object({
    name: z.string({ required_error: 'Name is required' }),
    description: z.string().optional(),
    externalLink: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    categories: z.array(categoryIdSchema).optional()
})

export type PlaceInput = z.infer<typeof placeSchema>