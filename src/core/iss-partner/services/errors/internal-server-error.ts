export class InternalServerError extends Error {
    constructor(msg?: string) {
        super(`Unexpected server error! Cause: ${msg}`)
    }
}