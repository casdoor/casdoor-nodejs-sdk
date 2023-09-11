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

import * as jwt from 'jsonwebtoken'
import Request from './request'
import { AxiosResponse } from 'axios'

export interface User {
  owner: string
  name: string
  createdTime: string
  updatedTime: string

  id: string
  type: string
  password?: string
  passwordSalt?: string
  displayName?: string
  firstName?: string
  lastName?: string
  avatar?: string
  permanentAvatar?: string
  email: string
  emailVerified: boolean
  phone?: string
  location?: string
  address: string[]
  affiliation?: string
  title?: string
  idCardType?: string
  idCard?: string
  homepage?: string
  bio?: string
  tag?: string
  region?: string
  language: string
  gender?: string
  birthday?: string
  education?: string
  score: number
  karma: number
  ranking: number
  isDefaultAvatar: boolean
  isOnline: boolean
  isAdmin: boolean
  isGlobalAdmin: boolean
  isForbidden: boolean
  isDeleted: boolean
  signupApplication: string
  hash?: string
  preHash?: string

  createdIp?: string
  lastSigninTime?: string
  lastSigninIp?: string

  github?: string
  google?: string
  qq?: string
  wechat?: string
  facebook?: string
  dingtalk?: string
  weibo?: string
  gitee?: string
  linkedin?: string
  wecom?: string
  lark?: string
  gitlab?: string
  adfs?: string
  baidu?: string
  alipay?: string
  casdoor?: string
  infoflow?: string
  apple?: string
  azuread?: string
  slack?: string
  steam?: string
  bilibili?: string
  okta?: string
  douyin?: string
  custom?: string

  ldap?: string
  properties: Record<string, string>
}

// the configuration of the SDK
export interface Config {
  endpoint: string
  clientId: string
  clientSecret: string
  certificate: string
  orgName: string
  appName?: string
}

export class SDK {
  private config: Config
  private request: Request

  constructor(config: Config) {
    this.config = config
    this.request = new Request({
      url: config.endpoint + '/api',
      timeout: 60000,
    })
  }

  public async getAuthToken(code: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const {
      data: { access_token, refresh_token },
    } = (await this.request.post('login/oauth/access_token', {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'authorization_code',
      code,
    })) as unknown as AxiosResponse<{
      access_token: string
      refresh_token: string
    }>

    return { access_token: access_token, refresh_token: refresh_token }
  }

  public parseJwtToken(token: string) {
    return jwt.verify(token, this.config.certificate, {
      algorithms: ['RS256'],
    }) as User
  }

  public async getUsers() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-users', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<User[]>>
  }
}
