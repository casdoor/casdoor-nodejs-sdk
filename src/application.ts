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

import { Provider } from './provider'
import { Organization, ThemeData } from './organization'
import { AxiosResponse } from 'axios'
import { Config } from './config'
import Request from './request'

interface ProviderItem {
  owner: string
  name: string

  canSignUp: boolean
  canSignIn: boolean
  canUnlink: boolean
  prompted: boolean
  alertType: string
  rule: string
  provider?: Provider
}

interface SignupItem {
  name: string
  visible: boolean
  required: boolean
  prompted: boolean
  rule: string
}

export interface Application {
  owner: string
  name: string
  createdTime: string

  displayName: string
  logo: string
  homepageUrl: string
  description: string
  organization: string
  cert?: string
  enablePassword?: boolean
  enableSignUp?: boolean
  enableSigninSession?: boolean
  enableCodeSignin?: boolean
  enableAutoSignin?: boolean
  enableSamlCompress?: boolean
  enableWebAuthn?: boolean
  enableLinkWithEmail?: boolean
  orgChoiceMode?: string
  samlReplyUrl?: string
  providers?: ProviderItem[]
  signupItems?: SignupItem[]
  grantTypes?: string[]
  organizationObj?: Organization
  tags?: string[]

  clientId?: string
  clientSecret?: string
  redirectUris?: string[]
  tokenFormat?: string
  tokenFields?: string[]
  expireInHours?: number
  refreshExpireInHours?: number
  signupUrl?: string
  signinUrl?: string
  forgetUrl?: string
  affiliationUrl?: string
  termsOfUse?: string
  signupHtml?: string
  signinHtml?: string
  themeData?: ThemeData
}

export class ApplicationSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getApplications() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-applications', {
      params: {
        owner: 'admin',
      },
    })) as unknown as Promise<AxiosResponse<{ data: Application[] }>>
  }

  public async getApplication(name: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-application', {
      params: {
        id: `admin/${name}`,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Application }>>
  }

  public async modifyApplication(method: string, application: Application) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    application.owner = 'admin'
    return (await this.request.post(url, application, {
      params: {
        id: `${application.owner}/${application.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addApplication(application: Application) {
    return this.modifyApplication('add-application', application)
  }

  public async updateApplication(application: Application) {
    return this.modifyApplication('update-application', application)
  }

  public async deleteApplication(application: Application) {
    return this.modifyApplication('delete-application', application)
  }
}
