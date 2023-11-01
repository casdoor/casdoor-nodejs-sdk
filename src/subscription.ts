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

export interface Subscription {
  owner: string
  name: string
  createdTime: string
  displayName: string

  startDate?: Date
  endDate?: Date
  duration?: number
  description: string

  user?: string
  plan?: string

  isEnabled?: boolean
  submitter?: string
  approver?: string
  approveTime?: string

  state?: string
}

export class SubscriptionSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getSubscriptions() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-subscriptions', {
      params: {
        owner: this.config.orgName,

        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Subscription[] }>>
  }

  public async getSubscription(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-subscription', {
      params: {
        id: `${this.config.orgName}/${id}`,

        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Subscription }>>
  }

  public async modifySubscription(method: string, subscription: Subscription) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    subscription.owner = this.config.orgName
    return (await this.request.post(url, subscription, {
      params: {
        id: `${subscription.owner}/${subscription.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addSubscription(subscription: Subscription) {
    return this.modifySubscription('add-subscription', subscription)
  }

  public async updateSubscription(subscription: Subscription) {
    return this.modifySubscription('update-subscription', subscription)
  }

  public async deleteSubscription(subscription: Subscription) {
    return this.modifySubscription('delete-subscription', subscription)
  }
}
