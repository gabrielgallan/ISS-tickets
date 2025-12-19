
import app from "./app";

export function startHttpServer() {
    app.listen({
        port: 3000,
        host: '0.0.0.0'
    }, (err, address) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }

        console.log(`HTTP Server running on ${address}`)
    })
}