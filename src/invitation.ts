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
import { CasdoorResponse, getId, getOwner } from './util'

export interface Invitation {
  owner: string
  name: string
  createdTime?: string
  updatedTime?: string
  displayName?: string
  code?: string
  isRegexp?: boolean
  quota?: number
  usedCount?: number
  application?: string
  username?: string
  email?: string
  phone?: string
  signupGroup?: string
  defaultCode?: string
  state?: string
}

export class InvitationSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getInvitations() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-invitations', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Invitation[]>>>
  }

  public async getPaginationInvitations(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-invitations', {
      params: {
        ...queryMap,
        owner: this.config.orgName,
        p: String(p),
        pageSize: String(pageSize),
      },
    })) as unknown as Promise<
      AxiosResponse<CasdoorResponse<Invitation[], number>>
    >
  }

  public async getInvitation(name: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-invitation', {
      params: {
        id: getId(name, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Invitation>>>
  }

  public async getInvitationInfo(code: string, applicationName: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-invitation-info', {
      params: {
        applicationId: `admin/${applicationName}`,
        code,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Invitation>>>
  }

  public async modifyInvitation(
    method: string,
    invitation: Invitation,
    columns?: string[],
    params: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    invitation.owner = getOwner(invitation.owner, this.config.orgName)
    return (await this.request.post(`/${method}`, invitation, {
      params: {
        ...params,
        id: `${invitation.owner}/${invitation.name}`,
        columns: columns?.join(','),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addInvitation(invitation: Invitation) {
    return this.modifyInvitation('add-invitation', invitation)
  }

  public async updateInvitation(invitation: Invitation) {
    return this.modifyInvitation('update-invitation', invitation)
  }

  public async updateInvitationForColumns(
    invitation: Invitation,
    columns: string[],
  ) {
    return this.modifyInvitation('update-invitation', invitation, columns)
  }

  public async deleteInvitation(invitation: Invitation) {
    return this.modifyInvitation('delete-invitation', invitation)
  }
}
