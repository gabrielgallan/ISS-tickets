import axios, { AxiosError } from "axios";

export const apiClient = axios.create({
    baseURL: "/api",
    withCredentials: true
})

interface ApiErrorPayload {
    message: string
    code?: string
    status?: number
    issues?: unknown
}

export class ApiError extends Error {
    code?: string
    status?: number
    issues?: unknown

    constructor({ message, code, status, issues }: ApiErrorPayload) {
        super(message)
        this.name = "ApiError"
        this.code = code
        this.status = status
        this.issues = issues
    }
}

export function normalizeApiError(err: unknown): ApiError {
    if (err instanceof AxiosError) {
        const status = err.response?.status
        const data = err.response?.data as any

        if (data?.error?.message) {
            return new ApiError({
                message: data.error.message,
                code: data.error.code,
                status
            })
        }

        if (data?.message) {
            return new ApiError({
                message: data.message,
                status,
                issues: data.issues
            })
        }

        if (typeof data?.error === "string") {
            return new ApiError({
                message: data.error,
                status
            })
        }

        return new ApiError({
            message: err.message || "Erro inesperado. Tente novamente.",
            status
        })
    }

    return new ApiError({
        message: "Erro inesperado. Tente novamente."
    })
}

export class BackendApi {
    static create() {
        return apiClient
    }
}