export class UnauthorizedMemberError extends Error {
    constructor() {
        super('Member unauthorized to access resources!')
    }
}