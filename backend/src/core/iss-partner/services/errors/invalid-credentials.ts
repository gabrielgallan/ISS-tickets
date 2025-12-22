export class InvalidCredentialsError extends Error {
    constructor() {
        super('Invalid member e-mail or password!')
    }
}