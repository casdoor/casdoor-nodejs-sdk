// Copyright 2024 The Casdoor Authors. All Rights Reserved.
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
import { Enforcer } from './enforcer'
import { CasdoorResponse, getId, getOwner } from './util'

export interface Policy {
  Id: number
  Ptype: string
  V0: string
  V1: string
  V2: string
  V3?: string
  V4?: string
  V5?: string
  tableName?: string
}

export interface PolicyFilter {
  ptype: string
  fieldIndex?: number
  fieldValues?: string[]
}

export class PolicySDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getPolicies(enforcerName: string, adapterId?: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-policies', {
      params: {
        id: getId(enforcerName, this.config.orgName),
        adapterId: adapterId,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Policy[]>>>
  }

  public async modifyPolicy(
    method: string,
    enforcer: Enforcer,
    policies: Policy[],
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    let data
    if (method === 'update-policy') {
      data = JSON.stringify(policies)
    } else {
      data = JSON.stringify(policies[0])
    }

    const url = `/${method}`
    enforcer.owner = getOwner(enforcer.owner, this.config.orgName)
    return (await this.request.post(url, data, {
      params: {
        id: `${enforcer.owner}/${enforcer.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addPolicy(enforcer: Enforcer, policy: Policy) {
    return this.modifyPolicy('add-policy', enforcer, [policy])
  }

  public async updatePolicy(
    enforcer: Enforcer,
    oldPolicy: Policy,
    newPolicy: Policy,
  ) {
    return this.modifyPolicy('update-policy', enforcer, [oldPolicy, newPolicy])
  }

  public async deletePolicy(enforcer: Enforcer, policy: Policy) {
    return this.modifyPolicy('remove-policy', enforcer, [policy])
  }

  public async removePolicy(enforcer: Enforcer, policy: Policy) {
    return this.deletePolicy(enforcer, policy)
  }

  // getFilteredPolicies returns the policies of the enforcer that match all the filters
  public async getFilteredPolicies(
    enforcerId: string,
    filters: PolicyFilter[],
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.post('/get-filtered-policies', filters, {
      params: {
        id: getId(enforcerId, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Policy[]>>>
  }
}
