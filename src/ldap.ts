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
import { CasdoorResponse, getAdminId, getId, getOwner } from './util'

export interface Ldap {
  id: string
  owner: string
  createdTime?: string
  serverName?: string
  host?: string
  port?: number
  enableSsl?: boolean
  allowSelfSignedCert?: boolean
  username?: string
  password?: string
  baseDn?: string
  filter?: string
  filterFields?: string[]
  defaultGroup?: string
  defaultGroups?: string[]
  passwordType?: string
  customAttributes?: Record<string, string>
  autoSync?: number
  lastSync?: string
  enableGroups?: boolean
  enablePasswordReset?: boolean
}

export interface LdapUser {
  uidNumber?: string
  uid?: string
  cn?: string
  gidNumber?: string
  uuid?: string
  userPrincipalName?: string
  displayName?: string
  Mail?: string
  email?: string
  EmailAddress?: string
  TelephoneNumber?: string
  mobile?: string
  MobileTelephoneNumber?: string
  RegisteredAddress?: string
  PostalAddress?: string
  country?: string
  countryName?: string
  groupId?: string
  address?: string
  memberOf?: string[]
  attributes?: Record<string, string>
}

export interface LdapUsersResponse {
  existUuids: string[]
  users: LdapUser[]
}

export interface SyncLdapUsersResponse {
  exist: LdapUser[]
  failed: LdapUser[]
}

export class LdapSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getLdaps() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-ldaps', {
      params: {
        owner: 'admin',
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Ldap[]>>>
  }

  public async getLdap(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-ldap', {
      params: {
        id: getAdminId(id),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Ldap>>>
  }

  public async getLdapUsers(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-ldap-users', {
      params: {
        id: getId(id, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<LdapUsersResponse>>>
  }

  public async syncLdapUsers(id: string, users: LdapUser[]) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.post('/sync-ldap-users', users, {
      params: {
        id: getId(id, this.config.orgName),
      },
    })) as unknown as Promise<
      AxiosResponse<CasdoorResponse<SyncLdapUsersResponse>>
    >
  }

  // syncLdapUsersFromServer fetches all the users from the LDAP server and syncs them into Casdoor
  public async syncLdapUsersFromServer(id: string) {
    const { data } = await this.getLdapUsers(id)
    return this.syncLdapUsers(id, data.data?.users ?? [])
  }

  public async modifyLdap(
    method: string,
    ldap: Ldap,
    columns?: string[],
    params: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    ldap.owner = getOwner(ldap.owner, 'admin')
    return (await this.request.post(`/${method}`, ldap, {
      params: {
        ...params,
        id: `${ldap.owner}/${ldap.id}`,
        columns: columns?.join(','),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addLdap(ldap: Ldap) {
    return this.modifyLdap('add-ldap', ldap)
  }

  public async updateLdap(ldap: Ldap) {
    return this.modifyLdap('update-ldap', ldap)
  }

  public async deleteLdap(ldap: Ldap) {
    return this.modifyLdap('delete-ldap', ldap)
  }
}
