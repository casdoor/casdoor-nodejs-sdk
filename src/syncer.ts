// Copyright 2021 The casbin Authors. All Rights Reserved.
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

import { SDK } from './sdk'
import { AxiosResponse } from 'axios'

export interface TableColumn {
  name: string
  type: string
  casdoorName: string
  isKey: boolean
  isHashed: boolean
  values?: string[]
}

interface Syncer {
  owner: string
  name: string
  createdTime: string

  organization: string
  type: string

  host: string
  port: number
  user: string
  password: string
  databaseType: string
  database: string
  table: string
  tablePrimaryKey: string
  tableColumns?: TableColumn[]
  affiliationTable?: string
  avatarBaseUrl?: string
  errorText?: string
  syncInterval?: number
  isReadOnly?: boolean
  isEnabled?: boolean

  // Ormer *Ormer `xorm:"-" json:"-"`
}

export class SyncerSDK extends SDK {
  public async getSyncers() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-syncers', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Syncer[]>>
  }

  public async getSyncer(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-syncer', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Syncer>>
  }

  public async modifySyncer(method: string, syncer: Syncer) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    syncer.owner = this.config.orgName
    const syncerInfo = JSON.stringify(syncer)
    return (await this.request.post(
      url,
      { syncerInfo },
      {
        params: {
          id: `${syncer.owner}/${syncer.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
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
