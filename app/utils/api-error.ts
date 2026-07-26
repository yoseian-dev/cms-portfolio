import { FetchError } from 'ofetch'

interface ApiErrorResponse {
    data?: {
        message?: string
    }
}

export function getApiErrorMessage(error: unknown) {
    if (error instanceof FetchError) {
        const response = error.data as ApiErrorResponse | undefined
        return response?.data?.message ?? '予期しないエラーが発生しました'
    }

    return '予期しないエラーが発生しました'
}