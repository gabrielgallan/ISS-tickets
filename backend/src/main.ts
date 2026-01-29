import { startHttpServer } from "./infra/http/server"
import env from "./infra/env/config";

console.log(env.NODE_ENV)
startHttpServer()