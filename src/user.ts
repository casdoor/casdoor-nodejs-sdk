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
import type { ProductInfo } from './order'
import { CasdoorResponse, getId, getOwner } from './util'
import { CasdoorMfaProps } from './mfa'
import { Role } from './role'
import { Permission } from './permission'

// the algorithms Casdoor can sign JWT with, see the cert's Crypto Algorithm in Casdoor
export const DefaultJwtAlgorithms: jwt.Algorithm[] = [
  'RS256',
  'RS512',
  'ES256',
  'ES384',
  'ES512',
]

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
  addresses?: Address[]
  realName?: string
  isVerified?: boolean
  balanceCredit?: number
  balanceCurrency?: string
  registerType?: string
  registerSource?: string
  originalToken?: string
  originalRefreshToken?: string
  wechat?: string
  dingtalk?: string
  linkedin?: string
  azuread?: string
  azureadb2c?: string
  kwai?: string
  battlenet?: string
  cloudfoundry?: string
  digitalocean?: string
  eveonline?: string
  influxcloud?: string
  microsoftonline?: string
  onedrive?: string
  salesforce?: string
  telegram?: string
  metamask?: string
  web3onboard?: string
  oidc?: string
  custom2?: string
  custom3?: string
  custom4?: string
  custom5?: string
  custom6?: string
  custom7?: string
  custom8?: string
  custom9?: string
  custom10?: string
  webauthnCredentials?: unknown
  mfaRadiusEnabled?: boolean
  mfaRadiusUsername?: string
  mfaRadiusProvider?: string
  mfaPushEnabled?: boolean
  mfaPushReceiver?: string
  mfaPushProvider?: string
  cart?: ProductInfo[]
  uidNumber?: number
  thirdPartyLinks?: ThirdPartyLink[]
  lastChangePasswordTime?: string
  mfaItems?: MfaItem[]
  mfaRememberDeadline?: string
  applicationScopes?: ConsentRecord[]
}

export interface ManagedAccount {
  application?: string
  username?: string
  password?: string
  signinUrl?: string
}

export interface MfaAccount {
  accountName: string
  issuer: string
  secretKey: string
  origin?: string
}

export interface FaceId {
  name: string
  faceIdData: number[]
  imageUrl?: string
}

export interface OAuthToken {
  access_token: string
  id_token?: string
  refresh_token: string
  token_type?: string
  expires_in?: number
  scope?: string
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

  public async refreshToken(refreshToken: string, scope?: string) {
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
      ...(scope && { scope }),
    })) as unknown as AxiosResponse<{
      access_token: string
      refresh_token: string
    }>

    return { access_token: access_token, refresh_token: refresh_token }
  }

  // getOAuthTokenByPassword uses the OAuth Resource Owner Password Credentials grant
  public async getOAuthTokenByPassword(username: string, password: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const { data } = (await this.request.post('login/oauth/access_token', {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'password',
      username,
      password,
    })) as unknown as AxiosResponse<
      OAuthToken & { error?: string; error_description?: string }
    >
    if (data.error) {
      throw new Error(data.error_description || data.error)
    }
    return data as OAuthToken
  }

  // impersonateUser signs in as any user of the organization with the organization's master password
  public async impersonateUser(username: string, masterPassword: string) {
    return this.getOAuthTokenByPassword(username, masterPassword)
  }

  public parseJwtToken(token: string) {
    return jwt.verify(token, this.config.certificate, {
      algorithms: this.config.algorithms ?? DefaultJwtAlgorithms,
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
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<User[]>>>
  }

  public async getUser(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-user', {
      params: {
        id: getId(id, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<User>>>
  }

  public async getGlobalUsers() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-global-users')) as unknown as Promise<
      AxiosResponse<CasdoorResponse<User[]>>
    >
  }

  public async getSortedUsers(sorter: string, limit: number) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-sorted-users', {
      params: {
        owner: this.config.orgName,
        sorter,
        limit: String(limit),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<User[]>>>
  }

  // getAccount returns the user of the access token when the SDK is created by withAccessToken()
  public async getAccount() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-account')) as unknown as Promise<
      AxiosResponse<CasdoorResponse<User>>
    >
  }

  public async getUserByEmail(email: string) {
    return this.getUserBy({ email })
  }

  public async getUserByPhone(phone: string) {
    return this.getUserBy({ phone })
  }

  public async getUserByUserId(userId: string) {
    return this.getUserBy({ userId })
  }

  private async getUserBy(params: Record<string, string>) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-user', {
      params: {
        owner: this.config.orgName,
        ...params,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<User>>>
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

  public async modifyUser(method: string, user: User, columns?: string[]) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    user.owner = getOwner(user.owner, this.config.orgName)
    return (await this.request.post(url, user, {
      params: {
        id: `${user.owner}/${user.name}`,
        columns: columns?.join(','),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async getPaginationUsers(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-users', {
      params: {
        ...queryMap,
        owner: this.config.orgName,
        p: String(p),
        pageSize: String(pageSize),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<User[], number>>>
  }

  public async updateUserForColumns(user: User, columns: string[]) {
    return this.modifyUser('update-user', user, columns)
  }

  public async updateUserById(id: string, user: User) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    user.owner = getOwner(user.owner, this.config.orgName)
    return (await this.request.post('/update-user', user, {
      params: {
        id,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async updateUserByUserId(owner: string, userId: string, user: User) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.post('/update-user', user, {
      params: {
        owner,
        userId,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  // checkUserPassword returns status "ok" when user.password is the user's password
  public async checkUserPassword(user: User) {
    return this.modifyUser('check-user-password', user)
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

  // logout signs the user out of all the applications and devices (SSO logout)
  public async logout(accessToken: string) {
    return this.ssoLogout(accessToken, true)
  }

  // logoutCurrentSession only signs the user out of the session of the access token
  public async logoutCurrentSession(accessToken: string) {
    return this.ssoLogout(accessToken, false)
  }

  private async ssoLogout(accessToken: string, logoutAll: boolean) {
    if (!this.request) {
      throw new Error('request init failed')
    }
    if (!accessToken) {
      throw new Error('logout() error: the accessToken should not be empty')
    }

    return (await this.request.post('/sso-logout', null, {
      params: {
        logoutAll: String(logoutAll),
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }
}

export interface Address {
  tag?: string
  line1?: string
  line2?: string
  city?: string
  state?: string
  zipCode?: string
  region?: string
}

export interface ThirdPartyLink {
  owner?: string
  userName?: string
  providerName?: string
  providerId?: string
  createdTime?: string
}

export interface MfaItem {
  name?: string
  rule?: string
}

export interface ConsentRecord {
  application?: string
  grantedScopes?: string[]
}
