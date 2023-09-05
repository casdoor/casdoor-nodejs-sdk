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

import { SDK } from './sdk'
import { AxiosResponse } from 'axios'
import * as jwt from 'jsonwebtoken'

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

export class UserSDK extends SDK {
  public async getAuthToken(code: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const {
      data: { access_token },
    } = (await this.request.post('login/oauth/access_token', {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'authorization_code',
      code,
    })) as unknown as AxiosResponse<{ access_token: string }>

    return access_token
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

  public async getUser(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-user', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<User>>
  }

  public async getUserCount(isOnline: boolean) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-user-count', {
      params: {
        isOnline,
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<number>>
  }

  public async modifyUser(method: string, user: User) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    user.owner = this.config.orgName
    const userInfo = JSON.stringify(user)
    return (await this.request.post(
      url,
      { userInfo },
      {
        params: {
          id: `${user.owner}/${user.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addUser(user: User) {
    return this.modifyUser('add-user', user)
  }

  public async updateUser(user: User) {
    return this.modifyUser('update-user', user)
  }

  public async deleteUser(user: User) {
    return this.modifyUser('delete-user', user)
  }
}
