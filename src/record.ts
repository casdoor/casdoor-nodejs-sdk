// Copyright 2026 The Casdoor Authors. All Rights Reserved.
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
import { CasdoorResponse, getId } from './util'

export interface Record {
  id?: number
  owner: string
  name: string
  createdTime?: string
  organization?: string
  clientIp?: string
  user?: string
  method?: string
  requestUri?: string
  action?: string
  language?: string
  object?: string
  response?: string
  statusCode?: number
  detail?: string
  isTriggered?: boolean
}

export class RecordSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getRecords() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-records', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Record[]>>>
  }

  public async getPaginationRecords(
    p: number,
    pageSize: number,
    queryMap: { [key: string]: string } = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-records', {
      params: {
        ...queryMap,
        owner: this.config.orgName,
        p: String(p),
        pageSize: String(pageSize),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Record[], number>>>
  }

  public async getRecord(name: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-record', {
      params: {
        id: getId(name, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Record>>>
  }

  public async addRecord(record: Record) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    record.owner = record.owner || this.config.orgName
    record.organization = record.organization || this.config.orgName
    return (await this.request.post(
      '/add-record',
      record,
    )) as unknown as Promise<AxiosResponse<{ [key: string]: unknown }>>
  }
}
