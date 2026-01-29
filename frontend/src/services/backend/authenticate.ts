import { ApiError, BackendApi, normalizeApiError } from "../api"

interface AuthenticateServiceRequest {
    email: string,
    password: string
}

export async function AuthenticateService({ 
    email, 
    password
}: AuthenticateServiceRequest): Promise<void> {
    try {
        const api = BackendApi.create()

        const response = await api.post('/session', {
            email,
            password
        })

        if (response.status !== 201) {
            throw new ApiError({
                message: "Falha ao autenticar. Tente novamente.",
                status: response.status
            })
        }

        if (response.data?.success === false) {
            throw new ApiError({
                message: response.data?.error?.message ?? "Falha ao autenticar.",
                code: response.data?.error?.code,
                status: response.status
            })
        }
    } catch (err) {
        throw normalizeApiError(err)
    }
}