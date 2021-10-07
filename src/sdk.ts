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

import {
  Issuer,
  Client,
  CallbackParamsType,
  CallbackExtras,
  TokenSet,
} from 'openid-client'
import * as jwt from 'jsonwebtoken'
import Request from './request'

export interface User {
  owner: string
  name: string
  createdTime: string
  updatedTime: string
  id: string
  type: string
  password: string
  displayName: string
  avatar: string
  permanentAvatar: string
  email: string
  phone: string
  location: string
  address: []
  affiliation: string
  title: string
  homepage: string
  bio: string
  tag: string
  region: string
  language: string
  score: number
  ranking: number
  isOnline: boolean
  isAdmin: boolean
  isGlobalAdmin: boolean
  isForbidden: boolean
  signupApplication: string
  hash: string
  preHash: string
  github: string
  google: string
  qq: string
  wechat: string
  facebook: string
  dingtalk: string
  weibo: string
  gitee: string
  linkedin: string
  wecom: string
  lark: string
  gitlab: string
  ldap: string
  properties: {
    [key in string]: any
  }
}

export interface AuthConfig {
  issuer: string // your Casdoor URL, like the official one: https://door.casbin.com
  clientId: string // your Casdoor OAuth Client ID
  clientSecret: string // your Casdoor OAuth Client Secret
  casdoorEndpoint?: string // casdoor api endpoint
}

export class SDK {
  private config: AuthConfig
  private client: Client
  private casdoorRequest: Request

  constructor(config: AuthConfig) {
    this.config = config
    if (config.casdoorEndpoint) {
      this.casdoorRequest = new Request({
        url: config.casdoorEndpoint,
        clientId: config.clientId,
        clientSecret: config.clientSecret,
      })
    }
  }

  /**
   * init Issuer.Client
   */
  async init(): Promise<Client> {
    const issuerProvider = await Issuer.discover(this.config.issuer)
    this.client = new issuerProvider.Client({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      id_token_signed_response_alg: 'HS256',
    })

    return this.client
  }

  parseJwtToken(token: string): (jwt.JwtPayload & User) | null {
    return jwt.decode(token) as jwt.JwtPayload & User
  }

  async callback(
    params: CallbackParamsType,
    extras: CallbackExtras = {},
  ): Promise<TokenSet> {
    if (!extras.exchangeBody) {
      extras.exchangeBody = {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }
    } else {
      extras.exchangeBody = {
        ...extras.exchangeBody,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }
    }

    return await this.client.callback(
      '',
      params,
      {
        state: params.state,
      },
      extras,
    )
  }

  async getUsers(conds: any) {
    if (!this.casdoorRequest) {
      throw new Error('missing casdoorEndpoint')
    }

    const url = '/api/get-users'
    const result = await this.casdoorRequest.get(url, { params: { ...conds } })
    return result
  }
}
