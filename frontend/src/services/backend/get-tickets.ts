import { ApiError, BackendApi, normalizeApiError } from "../api"

interface GetTicketsServiceRequest {
    perPage: number
    page: number
    searchField?: 'tn' | 'title' | 'a_body' | 'company' | 'customer_user_id' | 'login'
    searchValue?: string
    ticketStateIds?: number[]
    ticketPriorityIds?: number[]
    ticketTypeIds?: number[]
}

interface GetTicketsServiceResponse {
    code: number
    data: any
}

export async function GetTicketsService({ 
    perPage,
    page,
    searchField,
    searchValue,
    ticketStateIds,
    ticketPriorityIds,
    ticketTypeIds
}: GetTicketsServiceRequest): Promise<GetTicketsServiceResponse> {
    try {
        const api = BackendApi.create()

        const params: Record<string, string | number | undefined> = {
            perPage,
            page,
            searchField,
            searchValue
        }

        if (ticketStateIds && ticketStateIds.length > 0) {
            params.ticketStateIds = ticketStateIds.join(',')
        }

        if (ticketPriorityIds && ticketPriorityIds.length > 0) {
            params.ticketPriorityIds = ticketPriorityIds.join(',')
        }

        if (ticketTypeIds && ticketTypeIds.length > 0) {
            params.ticketTypeIds = ticketTypeIds.join(',')
        }

        const response = await api.get('/tickets', {
            params
        })

        if (response.data?.success === false) {
            throw new ApiError({
                message: response.data?.error?.message ?? "Falha ao buscar tickets.",
                code: response.data?.error?.code,
                status: response.status
            })
        }

        return { code: response.status, data: response.data?.data ?? response.data }
    } catch (err) {
        throw normalizeApiError(err)
    }
}