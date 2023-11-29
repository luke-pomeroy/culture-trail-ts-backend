interface BaseResponse {
    statusCode: string
    message: string
}

type ErrorList = { [key: string]: [string] | any }

export interface ErrorResponse extends BaseResponse {
    status: 'error'
    errors?: ErrorList
    stack?: string
}

export interface SuccessResponse extends BaseResponse {
    status: 'success'
    data?: object
}
