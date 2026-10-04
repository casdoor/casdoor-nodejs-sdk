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
import { CasdoorResponse } from './util'

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

  // getRecord gets a record by name, the data of the response is null if it doesn't exist.
  // Casdoor has no API to get a single record, so it searches the records by name. Like the
  // other APIs that read records, it needs the access token of an admin user, see withAccessToken().
  public async getRecord(
    name: string,
  ): Promise<AxiosResponse<CasdoorResponse<Record | null>>> {
    const recordName = name.split('/').pop() as string

    // the name filter matches the records whose names contain the given name
    const response = await this.getPaginationRecords(1, 100, {
      field: 'name',
      value: recordName,
    })
    const record =
      (response.data.data || []).find((item) => item.name === recordName) ||
      null

    return { ...response, data: { ...response.data, data: record } }
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
