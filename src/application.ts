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

import { Provider } from './provider'
import { Organization, ThemeData } from './organization'
import { SDK } from './sdk'
import { AxiosResponse } from 'axios'

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

interface Application {
  owner: string
  name: string
  createdTime: string

  displayName: string
  logo: string
  homepageUrl: string
  description: string
  organization: string
  cert: string
  enablePassword: boolean
  enableSignUp: boolean
  enableSigninSession: boolean
  enableAutoSignin: boolean
  enableCodeSignin: boolean
  enableSamlCompress: boolean
  enableWebAuthn: boolean
  enableLinkWithEmail: boolean
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

export class ApplicationSDK extends SDK {
  public async getApplications() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-applications', {
      params: {
        owner: 'admin',
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Application[]>>
  }

  public async getApplication(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-application', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Application>>
  }

  public async modifyApplication(method: string, application: Application) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    application.owner = this.config.orgName
    const applicationInfo = JSON.stringify(application)
    return (await this.request.post(
      url,
      { applicationInfo },
      {
        params: {
          id: `${application.owner}/${application.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
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
