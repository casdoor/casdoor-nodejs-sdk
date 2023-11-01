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

export interface Session {
  owner: string
  name: string
  application: string
  createdTime: string

  sessionId?: string[]
}

export class SessionSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getSessions() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-sessions', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Session[] }>>
  }

  public async getSession(name: string, application: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-session', {
      params: {
        sessionPkId: `${this.config.orgName}/${name}/${application}`,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Session }>>
  }

  public async modifySession(method: string, session: Session) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    session.owner = this.config.orgName
    return (await this.request.post(url, session, {
      params: {
        id: `${session.owner}/${session.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addSession(session: Session) {
    return this.modifySession('add-session', session)
  }

  public async updateSession(session: Session) {
    return this.modifySession('update-session', session)
  }

  public async deleteSession(session: Session) {
    return this.modifySession('delete-session', session)
  }
}
