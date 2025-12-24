import axios from "axios";

export class BackendApi {
    static create() {
        return axios.create({
            baseURL: import.meta.env.VITE_BACKEND_API_URL,
            withCredentials: true
        })
    }
}