import axios, { AxiosError } from "axios";

const AUTH_TOKEN_KEY = "iss_auth_token"

export function setAuthToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function getAuthToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY)
}

export function clearAuthToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY)
}

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
})

apiClient.interceptors.request.use((config) => {
    const token = getAuthToken()
    if (token) {
        config.headers = config.headers ?? {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
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