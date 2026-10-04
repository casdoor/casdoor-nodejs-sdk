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

export interface Enforcer {
  owner: string
  name: string
  createdTime?: string
  updatedTime?: string
  displayName?: string
  description?: string

  model: string
  adapter: string
  isEnabled?: boolean
  modelCfg?: Record<string, string>
}

export class EnforcerSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getEnforcers() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-enforcers', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Enforcer[]>>>
  }

  public async getEnforcer(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-enforcer', {
      params: {
        id: getId(id, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Enforcer>>>
  }

  public async modifyEnforcer(
    method: string,
    enforcer: Enforcer,
    columns?: string[],
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    enforcer.owner = getOwner(enforcer.owner, this.config.orgName)
    return (await this.request.post(url, enforcer, {
      params: {
        id: `${enforcer.owner}/${enforcer.name}`,
        columns: columns?.join(','),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async getPaginationEnforcers(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-enforcers', {
      params: {
        ...queryMap,
        owner: this.config.orgName,
        p: String(p),
        pageSize: String(pageSize),
      },
    })) as unknown as Promise<
      AxiosResponse<CasdoorResponse<Enforcer[], number>>
    >
  }

  public async addEnforcer(enforcer: Enforcer) {
    return this.modifyEnforcer('add-enforcer', enforcer)
  }

  public async updateEnforcer(enforcer: Enforcer) {
    return this.modifyEnforcer('update-enforcer', enforcer)
  }

  public async deleteEnforcer(enforcer: Enforcer) {
    return this.modifyEnforcer('delete-enforcer', enforcer)
  }
}
