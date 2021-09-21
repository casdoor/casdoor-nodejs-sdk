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
import { AuthorizationCode } from 'simple-oauth2'

export interface AuthConfig {
  endpoint: string // your Casdoor URL, like the official one: https://door.casbin.com
  clientId: string // your Casdoor OAuth Client ID
  clientSecret: string // your Casdoor OAuth Client Secret
  jwtSecret?: string // jwt secret
  organizationName?: string // your Casdoor organization name, like: "built-in"
  applicationName?: string // your Casdoor application name, like: "app-built-in"
}

// reference: https://github.com/casdoor/casdoor-go-sdk/blob/90fcd5646ec63d733472c5e7ce526f3447f99f1f/auth/jwt.go#L19-L32
export interface account {
  organization: string
  username: string
  type: string
  name: string
  avatar: string
  email: string
  phone: string
  affiliation: string
  tag: string
  language: string
  score: number
  isAdmin: boolean
  accessToken: string
}

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

export class SDK {
  private config: AuthConfig
  private client: AuthorizationCode

  constructor(config: AuthConfig) {
    this.config = config
    this.client = new AuthorizationCode({
      client: {
        id: config.clientId,
        secret: config.clientSecret,
      },
      auth: {
        tokenHost: config.endpoint,
        /** String path to request an access token. Default to /oauth/token. */
        tokenPath: '/api/login/oauth/access_token',
        /** String path to request an authorization code. Default to /oauth/authorize. */
        authorizePath: '/api/login/oauth/authorize',
      },
    })
  }

  async getOAuthToken(code: string, state: string) {
    /**
     * TODO:
     *  1. waitting 肉食大灰兔 /api/login/oauth/access_token support headers.Authorization feature,
     *     and then remove client_id / client_secret params at here.
     *     Ref issue lint: https://github.com/casbin/casdoor/issues/301
     */
    const params = {
      code,
      scope: state,
      redirect_uri: '', // This parameter is useless in this scenario, but is required, so set it to empty String
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    }
    const res = await this.client.getToken(params, {})
    const tokenSet = res?.token
    return tokenSet
  }

  /**
   * parse jwt token
   * @param token encode token content
   * @returns
   */
  parseJwtToken(token: string): (jwt.JwtPayload & User) | null {
    return jwt.decode(token) as jwt.JwtPayload & User
  }
}
