export class Customer {
    constructor(
        readonly id: number,
        readonly title: string,
        readonly email: string,
        readonly phone: string | null,
        readonly street: string | null,
        readonly firstName: string,
        readonly lastName: string | null,
        readonly city: string | null,
        readonly country: string | null,
    ) {}
}