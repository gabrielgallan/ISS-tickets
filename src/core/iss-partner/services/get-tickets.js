import qs from 'qs'

export class GetTicketsService {
    constructor(api) {
        this.api = api
    }

    async execute() {
        const apiResponse = await this.api.get('/agent/get-tickets', {
            params: {
                sorting: [
                    {
                        sort_key: "create_time",
                        sort_value: "DESC"
                    }
                ],
                search: {
                    value: '',
                    field: 'tn'
                },
                my_tickets: 0,
                per_page: 10,
                page: 1
            },
            paramsSerializer: params => qs.stringify(params, { encode: false })
        })

        return apiResponse.data
    }
}