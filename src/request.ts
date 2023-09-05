import axios, {AxiosRequestConfig, AxiosInstance} from 'axios'

export default class Request {
    private client: AxiosInstance

    constructor(config: AxiosRequestConfig) {
        this.client = axios.create({
            baseURL: config.url,
            timeout: config.timeout || 60000,
        })
    }

    get(url: string, config?: AxiosRequestConfig<any>) {
        return this.client.get(url, config)
    }

    post(
        url: string,
        data?: Record<string, string>,
        config?: AxiosRequestConfig<any>,
    ) {
        return this.client.post(url, data, config)
    }
}
