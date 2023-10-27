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

export interface Pricing {
  owner: string
  name: string
  createdTime: string
  displayName: string
  description: string

  plans?: string[]
  isEnabled: boolean
  trialDuration: number
  application: string

  submitter?: string
  approver?: string
  approveTime?: string

  state?: string
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
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Pricing[]>>
  }

  public async getPricing(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-pricing', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<Pricing>>
  }

  public async modifyPricing(method: string, pricing: Pricing) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    pricing.owner = this.config.orgName
    const pricingInfo = JSON.stringify(pricing)
    return (await this.request.post(
      url,
      { pricingInfo },
      {
        params: {
          id: `${pricing.owner}/${pricing.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
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
