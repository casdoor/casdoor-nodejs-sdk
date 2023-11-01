// Copyright 2021 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

export default class Request {
  private client: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL: config.url,
      timeout: config.timeout || 60000,
      headers: config.headers,
    })
  }
  get(url: string, config?: AxiosRequestConfig<any>) {
    return this.client.get(url, config)
  }

  post(url: string, data: any, config?: AxiosRequestConfig<any>) {
    return this.client.post(url, data, config)
  }
}
