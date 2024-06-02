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

export interface Token {
  owner: string
  name: string
  createdTime: string

  application: string
  organization: string
  user: string

  code: string
  accessToken: string
  refreshToken: string
  expiresIn: number
  scope: string
  tokenType: string
  codeChallenge: string
  codeIsUsed: boolean
  codeExpireIn: number
}

export class TokenSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getTokens(p: number, pageSize: number) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-tokens', {
      params: {
        p: String(p),
        pageSize: String(pageSize),
        owner: 'admin',
      },
    })) as unknown as Promise<AxiosResponse<{ data: Token[] }>>
  }

  public async getToken(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-token', {
      params: {
        id: `admin/${id}`,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Token }>>
  }

  public async modifyToken(method: string, token: Token) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    token.owner = 'admin'
    return (await this.request.post(url, token, {
      params: {
        id: `${token.owner}/${token.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addToken(token: Token) {
    return this.modifyToken('add-token', token)
  }

  public async updateToken(token: Token) {
    return this.modifyToken('update-token', token)
  }

  public async deleteToken(token: Token) {
    return this.modifyToken('delete-token', token)
  }

  public async introspect(token: string, token_type_hint: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.post(
      '/login/oauth/introspect',
      {
        token,
        token_type_hint,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }
}
