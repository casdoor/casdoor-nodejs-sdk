// Copyright 2021 The casbin Authors. All Rights Reserved.
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

export interface Provider {
  owner: string
  name: string
  createdTime: string

  displayName: string
  category: string
  type: string
  subType: string
  method: string
  clientId: string
  clientSecret: string
  clientId2: string
  clientSecret2: string
  cert: string
  customAuthUrl: string
  customTokenUrl: string
  customUserInfoUrl: string
  customLogo: string
  scopes: string
  userMapping?: Record<string, string>

  host: string
  port: number
  disableSsl: boolean // If the provider type is WeChat, DisableSsl means EnableQRCode
  title: string
  content: string // If provider type is WeChat, Content means QRCode string by Base64 encoding
  receiver: string

  regionId: string
  signName: string
  templateCode: string
  appId: string

  endpoint: string
  intranetEndpoint: string
  domain: string
  bucket: string
  pathPrefix: string

  metadata?: string
  idP?: string
  issuerUrl?: string
  enableSignAuthnRequest?: boolean

  providerUrl?: string
}

export class ProviderSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getProviders() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-providers', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Provider[]>>
  }

  public async getProvider(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-provider', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Provider>>
  }

  public async modifyProvider(method: string, provider: Provider) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    provider.owner = this.config.orgName
    const providerInfo = JSON.stringify(provider)
    return (await this.request.post(
      url,
      { providerInfo },
      {
        params: {
          id: `${provider.owner}/${provider.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addProvider(provider: Provider) {
    return this.modifyProvider('add-provider', provider)
  }

  public async updateProvider(provider: Provider) {
    return this.modifyProvider('update-provider', provider)
  }

  public async deleteProvider(provider: Provider) {
    return this.modifyProvider('delete-provider', provider)
  }
}
