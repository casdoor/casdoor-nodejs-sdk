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

export interface Role {
  owner: string
  name: string
  createdTime: string
  displayName: string
  description: string

  users?: string[]
  roles?: string[]
  domains?: string[]
  isEnabled?: boolean
}

export class RoleSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getRoles() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-roles', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Role[] }>>
  }

  public async getRole(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-role', {
      params: {
        id: `${this.config.orgName}/${id}`,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Role }>>
  }

  public async modifyRole(method: string, role: Role) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    role.owner = this.config.orgName

    return (await this.request.post(url, role, {
      params: {
        id: `${role.owner}/${role.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addRole(role: Role) {
    return this.modifyRole('add-role', role)
  }

  public async updateRole(role: Role) {
    return this.modifyRole('update-role', role)
  }

  public async deleteRole(role: Role) {
    return this.modifyRole('delete-role', role)
  }
}
