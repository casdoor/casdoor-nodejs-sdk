import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'

interface IConstructor {
  url: string
  clientId: string
  clientSecret: string
  timeout?: number
}

export default class Request {
  client: AxiosInstance
  config: IConstructor
  constructor(config: IConstructor) {
    this.client = axios.create({
      baseURL: config.url,
      timeout: config.timeout || 60000,
    })

    this.config = config
  }

  get(url: string, config: AxiosRequestConfig) {
    return this.client.get(url, config)
  }

  post(url: string, config: AxiosRequestConfig) {
    return this.client.post(url, config)
  }
}
