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

import { AxiosResponse } from 'axios'
import { Config } from './config'
import Request from './request'

export interface Adapter {
  owner: string
  name: string
  createdTime: string

  type: string
  databaseType: string
  host: string
  port: number
  user: string
  password: string
  database: string
  table: string
  tableNamePrefix: string

  isEnabled: boolean
}

export class AdapterSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getAdapters() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-adapters', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Adapter[]>>
  }

  public async getAdapter(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-adapter', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Adapter>>
  }

  public async modifyAdapter(method: string, adapter: Adapter) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = this.config.endpoint + `/${method}`
    adapter.owner = this.config.orgName
    const adapterInfo = JSON.stringify(adapter)
    return (await this.request.post(
      url,
      { adapterInfo },
      {
        params: {
          id: `${adapter.owner}/${adapter.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addAdapter(adapter: Adapter) {
    return this.modifyAdapter('add-adapter', adapter)
  }

  public async updateAdapter(adapter: Adapter) {
    return this.modifyAdapter('update-adapter', adapter)
  }

  public async deleteAdapter(adapter: Adapter) {
    return this.modifyAdapter('delete-adapter', adapter)
  }
}
