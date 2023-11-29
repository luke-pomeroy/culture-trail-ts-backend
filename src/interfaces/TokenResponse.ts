import { SuccessResponse } from './ApiResponse'

export interface TokenResponse extends SuccessResponse {
    data: {
        accessToken: string
        refreshToken?: string
    }
}
