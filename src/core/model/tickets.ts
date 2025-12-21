export class Ticket {
    constructor(
        readonly pkId: number,
        readonly ticketId: string,
        readonly title: string,
        readonly priority: string,
        readonly type: string,
        readonly status: string,
        readonly createdAtUtc: string,
        readonly createdAtLocaleTime: string,
        readonly modifiedAtUtc: string,
        readonly modifiedAtLocaleTime: string,
        readonly agent: string,
        readonly agentId: number,
    ) {}
}