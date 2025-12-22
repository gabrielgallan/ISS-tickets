import { BackendApi } from "../api"

export async function getTickets() {
    try {
        const api = BackendApi.create()

        const params = {
            perPage: 10,
            page: 1
        }

        const response = await api.get('/api/tickets', null, {
            params
        })

        return response.data
    } catch (err) {
        throw err
    }
}