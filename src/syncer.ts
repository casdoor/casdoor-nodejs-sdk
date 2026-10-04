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

export interface TableColumn {
  name: string
  type: string
  casdoorName: string
  isKey: boolean
  isHashed: boolean
  values?: string[]
}

export interface Syncer {
  owner: string
  name: string
  createdTime: string

  organization: string
  type?: string

  host: string
  port: number
  user: string
  password: string
  databaseType: string
  database: string
  table: string
  tablePrimaryKey?: string
  tableColumns?: TableColumn[]
  affiliationTable?: string
  avatarBaseUrl?: string
  errorText?: string
  syncInterval?: number
  isReadOnly?: boolean
  isEnabled?: boolean

  // Ormer *Ormer `xorm:"-" json:"-"`
  sslMode?: string
  sshType?: string
  sshHost?: string
  sshPort?: number
  sshUser?: string
  sshPassword?: string
  cert?: string
}

export class SyncerSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getSyncers() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-syncers', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Syncer[]>>>
  }

  public async getSyncer(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-syncer', {
      params: {
        id: getId(id, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Syncer>>>
  }

  public async modifySyncer(
    method: string,
    syncer: Syncer,
    columns?: string[],
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    syncer.owner = getOwner(syncer.owner, this.config.orgName)
    return (await this.request.post(url, syncer, {
      params: {
        id: `${syncer.owner}/${syncer.name}`,
        columns: columns?.join(','),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async getPaginationSyncers(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-syncers', {
      params: {
        ...queryMap,
        owner: this.config.orgName,
        p: String(p),
        pageSize: String(pageSize),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Syncer[], number>>>
  }

  public async addSyncer(syncer: Syncer) {
    return this.modifySyncer('add-syncer', syncer)
  }

  public async updateSyncer(syncer: Syncer) {
    return this.modifySyncer('update-syncer', syncer)
  }

  public async deleteSyncer(syncer: Syncer) {
    return this.modifySyncer('delete-syncer', syncer)
  }
}
