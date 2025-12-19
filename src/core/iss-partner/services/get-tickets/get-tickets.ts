import { AxiosInstance } from 'axios'
import qs from 'qs'

import { IssGetTicketsResponseDto } from '../../dto/get-tickets-response.dto'

interface GetTicketsServiceRequest {
    searchField: string | null,
    searchValue: string | null,
    perPage: number | null,
    page: number | null
}

interface GetTicketsServiceResponse {
    response: IssGetTicketsResponseDto
}

export class GetTicketsService {
    constructor(
        private apiAuthenticated: AxiosInstance
    ) { }

    async execute({
        searchField,
        searchValue,
        perPage,
        page
    }: GetTicketsServiceRequest): Promise<GetTicketsServiceResponse> {
        if (perPage && page) {
            const apiResponse = await this.apiAuthenticated.get('/agent/get-tickets', {
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
                    per_page: perPage,
                    page: page
                },
                paramsSerializer: params => qs.stringify(params, { encode: false })
            })

            return {
                response: apiResponse.data
            }
        }

        throw new Error()
    }
}