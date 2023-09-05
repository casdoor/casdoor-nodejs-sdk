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

export interface ProviderItem {
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

export interface SignupItem {
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
