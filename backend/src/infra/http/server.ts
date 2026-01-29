
import env from "../env/config";
import { logger } from "../logger";
import app from "./app";

export function startHttpServer() {
    app.listen({
        port: env.PORT,
        host: '0.0.0.0'
    }, (err, address) => {
        if (err) {
            logger.error('Error starting HTTP server', err)
            process.exit(1)
        }

        logger.info(`HTTP Server running on ${address}`)
    })
}