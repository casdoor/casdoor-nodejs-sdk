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

export interface Pricing {
  owner: string
  name: string
  createdTime: string
  displayName: string
  description: string

  plans?: string[]
  isEnabled?: boolean
  trialDuration?: number
  application: string

  submitter?: string
  approver?: string
  approveTime?: string

  state?: string
  isInviteOnly?: boolean
  users?: string[]
}

export class PricingSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getPricings() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-pricings', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Pricing[]>>>
  }

  public async getPricing(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-pricing', {
      params: {
        id: getId(id, this.config.orgName),

        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Pricing>>>
  }

  public async modifyPricing(
    method: string,
    pricing: Pricing,
    columns?: string[],
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    pricing.owner = getOwner(pricing.owner, this.config.orgName)

    return (await this.request.post(url, pricing, {
      params: {
        id: `${pricing.owner}/${pricing.name}`,
        columns: columns?.join(','),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async getPaginationPricings(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-pricings', {
      params: {
        ...queryMap,
        owner: this.config.orgName,
        p: String(p),
        pageSize: String(pageSize),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Pricing[], number>>>
  }

  public async addPricing(pricing: Pricing) {
    return this.modifyPricing('add-pricing', pricing)
  }

  public async updatePricing(pricing: Pricing) {
    return this.modifyPricing('update-pricing', pricing)
  }

  public async deletePricing(pricing: Pricing) {
    return this.modifyPricing('delete-pricing', pricing)
  }
}
