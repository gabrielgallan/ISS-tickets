export class InvalidPortalUrlError extends Error {
    constructor() {
        super('Could not fetch data from server URL informed in environment variables!')
    }
}