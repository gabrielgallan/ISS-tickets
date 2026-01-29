import { Encrypter } from "../encrypter";

import env from "@/infra/env/config";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

const KEY = Buffer.from(env.CRYPTO_KEY!, "hex")

export class NodeCryptoEncrypter implements Encrypter {
    encrypt(value: string) {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)

        const encrypted = Buffer.concat([
            Buffer.from(cipher.update(value, "utf8")),
            Buffer.from(cipher.final()),
        ])

        const tag = cipher.getAuthTag()

        return Buffer.concat([iv, tag, encrypted]).toString("base64")
    }

    decrypt(value: string) {
        const data = Buffer.from(value, "base64")
      
        const iv = data.subarray(0, IV_LENGTH)
        const tag = data.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH)
        const encrypted = data.subarray(IV_LENGTH + TAG_LENGTH)
      
        const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
        decipher.setAuthTag(tag)
      
        const decrypted = Buffer.concat([
          Buffer.from(decipher.update(encrypted)),
          Buffer.from(decipher.final()),
        ]);
      
        return decrypted.toString("utf8")
    }
}