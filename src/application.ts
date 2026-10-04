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
import type { Cert } from './cert'
import { CasdoorResponse, getAdminId, getOwner } from './util'

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
  category?: string
  type?: string
  scopes?: ScopeItem[]
  logoDark?: string
  title?: string
  favicon?: string
  order?: number
  defaultGroup?: string
  defaultTag?: string
  headerHtml?: string
  pageHtml?: string
  enableGuestSignin?: boolean
  disableSignin?: boolean
  enableExclusiveSignin?: boolean
  maxSessions?: number
  enableSamlC14n10?: boolean
  enableSamlPostBinding?: boolean
  disableSamlAttributes?: boolean
  enableSamlAssertionSignature?: boolean
  useEmailAsSamlNameId?: boolean
  samlSingleLogoutUrl?: string
  signinMethods?: SigninMethod[]
  signinItems?: SigninItem[]
  certPublicKey?: string
  samlAttributes?: SamlItem[]
  samlHashAlgorithm?: string
  samlC14nPrefix?: string
  isShared?: boolean
  ipRestriction?: string
  clientCert?: string
  backchannelLogoutUri?: string
  forcedRedirectOrigin?: string
  tokenSigningMethod?: string
  tokenAttributes?: JwtItem[]
  tokenGroupFormat?: string
  cookieExpireInHours?: number
  ipWhitelist?: string
  footerHtml?: string
  formCss?: string
  formCssMobile?: string
  formOffset?: number
  formSideHtml?: string
  formBackgroundUrl?: string
  formBackgroundUrlMobile?: string
  failedSigninLimit?: number
  failedSigninFrozenTime?: number
  codeResendTimeout?: number
  customScopes?: ScopeDescription[]
  domain?: string
  otherDomains?: string[]
  upstreamHost?: string
  sslMode?: string
  sslCert?: string
  CertObj?: Cert
  registrationAccessToken?: string
}

export class ApplicationSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getOrganizationApplications() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-organization-applications', {
      params: {
        owner: 'admin',
        organization: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Application[]>>>
  }

  public async getApplications() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-applications', {
      params: {
        owner: 'admin',
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Application[]>>>
  }

  public async getApplication(name: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-application', {
      params: {
        id: getAdminId(name),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Application>>>
  }

  public async modifyApplication(
    method: string,
    application: Application,
    columns?: string[],
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    application.owner = getOwner(application.owner, 'admin')
    return (await this.request.post(url, application, {
      params: {
        id: `${application.owner}/${application.name}`,
        columns: columns?.join(','),
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

export interface ScopeItem {
  name?: string
  displayName?: string
  description?: string
  tools?: string[]
}

export interface SigninMethod {
  name?: string
  displayName?: string
  rule?: string
}

export interface SigninItem {
  name?: string
  visible?: boolean
  label?: string
  customCss?: string
  placeholder?: string
  rule?: string
  isCustom?: boolean
}

export interface SamlItem {
  name?: string
  nameFormat?: string
  value?: string
}

export interface JwtItem {
  name?: string
  category?: string
  value?: string
  type?: string
}

export interface ScopeDescription {
  scope?: string
  displayName?: string
  description?: string
}
