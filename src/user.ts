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
import * as jwt from 'jsonwebtoken'
import * as FormData from 'form-data'
import { Config } from './config'
import Request from './request'
import { CasdoorMfaProps } from './mfa'
import { Role } from './role'
import { Permission } from './permission'

export interface User {
  owner: string
  name: string
  createdTime: string
  updatedTime?: string
  deletedTime?: string

  id?: string
  externalId?: string
  type?: string
  password?: string
  passwordSalt?: string
  passwordType?: string
  displayName?: string
  firstName?: string
  lastName?: string
  avatar?: string
  avatarType?: string
  permanentAvatar?: string
  email?: string
  emailVerified?: boolean
  phone?: string
  countryCode?: string
  region?: string
  location?: string
  address?: string[]
  affiliation?: string
  title?: string
  idCardType?: string
  idCard?: string
  homepage?: string
  bio?: string
  tag?: string
  language?: string
  gender?: string
  birthday?: string
  education?: string
  score?: number
  karma?: number
  ranking?: number
  balance?: number
  currency?: string
  isDefaultAvatar?: boolean
  isOnline?: boolean
  isAdmin?: boolean
  isForbidden?: boolean
  isDeleted?: boolean
  signupApplication?: string
  hash?: string
  preHash?: string
  accessKey?: string
  accessSecret?: string
  accessToken?: string

  createdIp?: string
  lastSigninTime?: string
  lastSigninIp?: string

  github?: string
  google?: string
  qq?: string
  weChat?: string
  facebook?: string
  dingTalk?: string
  weibo?: string
  gitee?: string
  linkedIn?: string
  wecom?: string
  lark?: string
  gitlab?: string
  adfs?: string
  baidu?: string
  alipay?: string
  casdoor?: string
  infoflow?: string
  apple?: string
  azureAD?: string
  azureADB2c?: string
  slack?: string
  steam?: string
  bilibili?: string
  okta?: string
  douyin?: string
  line?: string
  amazon?: string
  auth0?: string
  battleNet?: string
  bitbucket?: string
  box?: string
  cloudFoundry?: string
  dailymotion?: string
  deezer?: string
  digitalOcean?: string
  discord?: string
  dropbox?: string
  eveOnline?: string
  fitbit?: string
  gitea?: string
  heroku?: string
  influxCloud?: string
  instagram?: string
  intercom?: string
  kakao?: string
  lastfm?: string
  mailru?: string
  meetup?: string
  microsoftOnline?: string
  naver?: string
  nextcloud?: string
  oneDrive?: string
  oura?: string
  patreon?: string
  paypal?: string
  salesForce?: string
  shopify?: string
  soundcloud?: string
  spotify?: string
  strava?: string
  stripe?: string
  tiktok?: string
  tumblr?: string
  twitch?: string
  twitter?: string
  typetalk?: string
  uber?: string
  vk?: string
  wepay?: string
  xero?: string
  yahoo?: string
  yammer?: string
  yandex?: string
  zoom?: string
  metaMask?: string
  web3Onboard?: string
  custom?: string

  preferredMfaType?: string
  recoveryCodes?: string[]
  totpSecret?: string
  mfaPhoneEnabled?: boolean
  mfaEmailEnabled?: boolean
  multiFactorAuths?: CasdoorMfaProps[]
  invitation?: string
  invitationCode?: string
  faceIds?: FaceId[]

  ldap?: string
  properties?: Record<string, string>

  roles?: Role[]
  permissions?: Permission[]
  groups?: string[]

  lastSigninWrongTime?: string
  signinWrongTimes?: number

  managedAccounts?: ManagedAccount[]
  mfaAccounts?: MfaAccount[]
  needUpdatePassword?: boolean
  ipWhitelist?: string
}

export interface ManagedAccount {
  application?: string;
  username?: string;
  password?: string;
  signinUrl?: string;
}

export interface MfaAccount {
  accountName: string;
  issuer: string;
  secretKey: string;
}

export interface FaceId {
  name: string;
  faceIdData: number[];
}

export interface SetPassword {
  owner: string
  name: string
  newPassword?: string
  oldPassword?: string
}

export class UserSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
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

  public async refreshToken(refreshToken: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const {
      data: { access_token, refresh_token },
    } = (await this.request.post('login/oauth/refresh_token', {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
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
      },
    })) as unknown as Promise<AxiosResponse<{ data: User[] }>>
  }

  public async getUser(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-user', {
      params: {
        id: `${this.config.orgName}/${id}`,
      },
    })) as unknown as Promise<AxiosResponse<{ data: User }>>
  }

  public async getUserCount(isOnline: boolean) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-user-count', {
      params: {
        isOnline,
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<number>>
  }

  public async modifyUser(method: string, user: User) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    user.owner = this.config.orgName
    return (await this.request.post(url, user, {
      params: {
        id: `${user.owner}/${user.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
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

  public async setPassword(data: SetPassword) {
    const formData = new FormData()
    formData.append('userOwner', data.owner)
    formData.append('userName', data.name)
    formData.append('oldPassword', data.oldPassword ?? '')
    formData.append('newPassword', data.newPassword)
    return (await this.request.post('set-password', formData, {
      headers: formData.getHeaders(),
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }
}
