import * as z from 'zod'

export const credentialsSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .email('Invalid email or password'),
    password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters long')
        .max(32, 'Password cannot exceed 32 characters'),
})

export const refreshTokenSchema = z.object({
    refreshToken: z.string().optional(),
})

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
export type CredentialsInput = z.infer<typeof credentialsSchema>
