import { AxiosInstance } from 'axios'
import qs from 'qs'

interface GetTicketsServiceRequest {
    searchField: string | null,
    searchValue: string | null,
    perPage: number | null,
    page: number | null
}

interface GetTicketsServiceResponse {
    data: any
}

export class GetTicketsService {
    constructor(
        private api: AxiosInstance
    ) { }

    async execute({
        searchField,
        searchValue,
        perPage,
        page
    }: GetTicketsServiceRequest): Promise<GetTicketsServiceResponse> {
        if (perPage && page) {
            const apiResponse = await this.api.get('/agent/get-tickets', {
                params: {
                    sorting: [
                        {
                            sort_key: "create_time",
                            sort_value: "DESC"
                        }
                    ],
                    search: {
                        value: (searchValue && searchField) ? searchValue : '',
                        field: (searchValue && searchField) ? searchField : 'tn'
                    },
                    my_tickets: 0,
                    per_page: 10,
                    page: 1
                },
                paramsSerializer: params => qs.stringify(params, { encode: false })
            })

            return {
                data: apiResponse.data
            }
        }

        throw new Error()
    }
}