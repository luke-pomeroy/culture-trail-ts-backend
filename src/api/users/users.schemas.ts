import * as z from 'zod'

export const credentialsSchema = z.object({
    email: z
        .string({ required_error: 'Email address is required' })
        .email('Invalid email address'),
    password: z
        .string({ required_error: 'Password is required' })
        .min(8, 'Invalid email or password'),
})
