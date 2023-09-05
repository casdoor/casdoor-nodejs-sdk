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

interface Token {
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

export class TokenSDK extends SDK {
  public async getTokens(p: number, pageSize: number) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-tokens', {
      params: {
        p: String(p),
        pageSize: String(pageSize),
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Token[]>>
  }

  public async getToken(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-token', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Token>>
  }

  public async modifyToken(method: string, token: Token) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    token.owner = this.config.orgName
    const tokenInfo = JSON.stringify(token)
    return (await this.request.post(
      url,
      { tokenInfo },
      {
        params: {
          id: `${token.owner}/${token.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
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
}
