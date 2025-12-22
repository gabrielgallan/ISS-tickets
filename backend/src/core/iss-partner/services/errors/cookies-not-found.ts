export class CookiesNotFoundError extends Error {
    constructor() {
        super('Cookies sended by portal not found!')
    }
}