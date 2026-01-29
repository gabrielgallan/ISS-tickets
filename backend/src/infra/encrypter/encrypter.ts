export interface Encrypter {
    encrypt(value: string): string
    decrypt(value: string): string
}