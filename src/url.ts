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

import { Config } from './config'

export type SignAction = 'signup' | 'login'

export class UrlSDK {
  private config: Config

  constructor(config: Config) {
    this.config = config
  }

  private getSignUrl(action: SignAction, redirectUri: string): string {
    const scope = 'read'
    const state = this.config.appName
    return `${this.config.endpoint}/${action}/oauth/authorize?client_id=${
      this.config.clientId
    }&response_type=code&redirect_uri=${
      redirectUri.split(/[?#]/)[0]
    }&scope=${scope}&state=${state}`
  }

  public getSignUpUrl(enablePassword: boolean, redirectUri: string): string {
    if (enablePassword) {
      return `${this.config.endpoint}/signup/${this.config.appName}}`
    } else {
      return this.getSignUrl('signup', redirectUri)
    }
  }

  public getSignInUrl(redirectUri: string): string {
    return this.getSignUrl('login', redirectUri)
  }

  public getUserProfileUrl(userName: string, accessToken?: string): string {
    const param = accessToken ? `?access_token=${accessToken}` : ''
    return `${this.config.endpoint}/users/${this.config.orgName}/${userName}${param}`
  }

  public getMyProfileUrl(accessToken?: string): string {
    const param = accessToken ? `?access_token=${accessToken}` : ''
    return `${this.config.endpoint}/account${param}`
  }
}
