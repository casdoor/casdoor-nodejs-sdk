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
import { User } from './user'
import { Config } from './config'
import Request from './request'

export interface Group {
  owner: string
  name: string
  createdTime: string
  updatedTime?: string

  displayName: string
  manager?: string
  contactEmail?: string
  type?: string
  parentId?: string
  isTopGroup?: boolean
  users?: User[]

  title?: string
  key?: string
  children?: Group[]

  isEnabled?: boolean
}

export class GroupSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getGroups(withTree?: boolean) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const params: any = { owner: this.config.orgName }
    if (withTree) {
      params.withTree = 'true'
    }

    return (await this.request.get('/get-groups', {
      params,
    })) as unknown as Promise<AxiosResponse<{ data: Group[] }>>
  }

  public async getGroup(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-group', {
      params: {
        id: `${this.config.orgName}/${id}`,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Group }>>
  }

  public async modifyGroup(method: string, group: Group) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    group.owner = this.config.orgName
    return (await this.request.post(url, group, {
      params: {
        id: `${group.owner}/${group.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addGroup(group: Group) {
    return this.modifyGroup('add-group', group)
  }

  public async updateGroup(group: Group) {
    return this.modifyGroup('update-group', group)
  }

  public async deleteGroup(group: Group) {
    return this.modifyGroup('delete-group', group)
  }
}
