import { AxiosError } from "axios"
import { BackendApi } from "../api"

interface GetTicketsServiceRequest {
    perPage: number
    page: number
}

interface GetTicketsServiceResponse {
    code: number
    data: any
}

export async function GetTicketsService({ 
    perPage,
    page 
}: GetTicketsServiceRequest): Promise<GetTicketsServiceResponse> {
    try {
        const api = BackendApi.create()

        const params = {
            perPage,
            page
        }

        const response = await api.get('/api/tickets', {
            params
        })

        return { code: response.status, data: response.data }
    } catch (err) {
        if (err instanceof AxiosError) {
            if (err.response) {
              if (err.response.status === 401) throw new Error('Unauthorized member')
                if (err.response.status === 404) throw new Error('Data validation error')  
            }
        }

        throw new Error('Internal server error')
    }
}