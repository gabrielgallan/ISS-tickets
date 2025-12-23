import { AxiosError } from "axios"
import { BackendApi } from "../api"

export async function authenticate({ email, password }) {
    try {
        const api = BackendApi.create()

        const response = await api.post('/api/session', {
            email,
            password
        })

        if (response.status !== 201) throw new Error('Internal server error')
    } catch (err) {
        if (err instanceof AxiosError) {
            if (err.response) {
                if (err.response.status === 422) throw new Error('Invalid credentials')
            }
        }

        throw new Error('Internal server error')
    }
}