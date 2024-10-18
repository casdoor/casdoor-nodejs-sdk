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

export interface Permission {
  owner: string
  name: string
  createdTime: string
  displayName: string
  description: string

  users?: string[]
  groups?: string[]
  roles?: string[]
  domains?: string[]

  model: string
  adapter?: string
  resourceType: string
  resources?: string[]
  actions?: string[]
  effect: string
  isEnabled: boolean

  submitter?: string
  approver?: string
  approveTime?: string
  state?: string
}

export class PermissionSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getPermissions() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-permissions', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Permission[] }>>
  }

  public async getPermission(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-permission', {
      params: {
        id: `${this.config.orgName}/${id}`,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Permission }>>
  }

  public async modifyPermission(method: string, permission: Permission) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    permission.owner = this.config.orgName
    return (await this.request.post(url, permission, {
      params: {
        id: `${permission.owner}/${permission.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addPermission(permission: Permission) {
    return this.modifyPermission('add-permission', permission)
  }

  public async updatePermission(permission: Permission) {
    return this.modifyPermission('update-permission', permission)
  }

  public async deletePermission(permission: Permission) {
    return this.modifyPermission('delete-permission', permission)
  }
}
