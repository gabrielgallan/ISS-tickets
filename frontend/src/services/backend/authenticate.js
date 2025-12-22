import { BackendApi } from "../api"

export async function authenticate({ email, password }) {
    try {
        const api = BackendApi.create()

        const response = await api.post('/api/session', {
            email,
            password
        })

        return { status: true, response }
    } catch (err) {
        return { status: false, error: err.message }
    }
}