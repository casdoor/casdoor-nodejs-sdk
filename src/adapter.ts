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
import { CasdoorResponse, getId, getOwner } from './util'

export interface Adapter {
  owner: string
  name: string
  createdTime?: string

  table?: string
  useSameDb?: boolean
  type?: string
  databaseType?: string
  host?: string
  port?: number
  user?: string
  password?: string
  database?: string
  tableNamePrefix?: string

  isEnabled?: boolean
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
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Adapter[]>>>
  }

  public async getAdapter(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-adapter', {
      params: {
        id: getId(id, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Adapter>>>
  }

  public async modifyAdapter(
    method: string,
    adapter: Adapter,
    columns?: string[],
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    adapter.owner = getOwner(adapter.owner, this.config.orgName)

    return (await this.request.post(url, adapter, {
      params: {
        id: `${adapter.owner}/${adapter.name}`,
        columns: columns?.join(','),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async getPaginationAdapters(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-adapters', {
      params: {
        ...queryMap,
        owner: this.config.orgName,
        p: String(p),
        pageSize: String(pageSize),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Adapter[], number>>>
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
