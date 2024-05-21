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

// Webhook has same definition as https://github.com/casdoor/casdoor/blob/master/object/webhook.go#L29
export interface Webhook {
  owner: string
  name: string
  createdTime?: string

  organization?: string

  url?: string
  method?: string
  contentType?: string
  headers?: { name?: string; value?: string }[]
  events?: string[]
  isUserExtended?: boolean
  singleOrgOnly?: boolean
  isEnabled?: boolean

  // Ormer *Ormer `xorm:"-" json:"-"`
}

export class WebhookSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getWebhooks() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-webhooks', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Webhook[] }>>
  }

  public async getWebhook(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-webhook', {
      params: {
        id: `${this.config.orgName}/${id}`,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Webhook }>>
  }

  public async modifyWebhook(method: string, webhook: Webhook) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    webhook.owner = this.config.orgName
    return (await this.request.post(url, webhook, {
      params: {
        id: `${webhook.owner}/${webhook.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addWebhook(webhook: Webhook) {
    return this.modifyWebhook('add-webhook', webhook)
  }

  public async updateWebhook(webhook: Webhook) {
    return this.modifyWebhook('update-webhook', webhook)
  }

  public async deleteWebhook(webhook: Webhook) {
    return this.modifyWebhook('delete-webhook', webhook)
  }
}
