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
import * as FormData from 'form-data'
import { Config } from './config'
import Request from './request'

export enum MfaType {
  EMAIL = 'email',
  SMS = 'sms',
  APP = 'app',
}

export interface MfaData {
  owner: string
  mfaType: MfaType
  name: string
}

export interface CasdoorMfaProps {
  enabled?: boolean
  isPreferred?: boolean
  mfaType?: string
  secret?: string
  countryCode?: string
  url?: string
  recoveryCodes?: string
}

export class MfaSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  private prepareMfaPayload(data: MfaData) {
    const formData = new FormData()
    formData.append('owner', data.owner)
    formData.append('mfaType', data.mfaType)
    formData.append('name', data.name)
    return formData
  }

  public async initiate(data: MfaData) {
    if (!this.request) {
      throw new Error('request init failed')
    }
    const payload = this.prepareMfaPayload(data)
    console.log(payload)
    return (await this.request.post('mfa/setup/initiate', payload, {
      headers: payload.getHeaders(),
    })) as unknown as Promise<AxiosResponse<{ data: CasdoorMfaProps }>>
  }

  public async verify(data: MfaData, passcode: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const payload = this.prepareMfaPayload(data)
    payload.append('passcode', passcode)
    return (await this.request.post('mfa/setup/verify', payload, {
      headers: payload.getHeaders(),
      withCredentials: true,
    })) as unknown as Promise<AxiosResponse<{ data: string }>>
  }

  public async enable(data: MfaData, cookie: any = null) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const payload = this.prepareMfaPayload(data)
    const headers = payload.getHeaders()
    if (cookie)
      headers.Cookie = cookie

    return (await this.request.post('mfa/setup/enable', payload, {
      headers: headers,
      withCredentials: true,
    })) as unknown as Promise<AxiosResponse<{ data: string }>>
  }

  public async setPreferred(data: MfaData) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const payload = this.prepareMfaPayload(data)
    return (await this.request.post('set-preferred-mfa', payload, {
      headers: payload.getHeaders(),
    })) as unknown as Promise<AxiosResponse<{ data: CasdoorMfaProps[] }>>
  }

  public async delete(owner: string, name: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const formData = new FormData()
    formData.append('owner', owner)
    formData.append('name', name)
    return (await this.request.post('delete-mfa', formData, {
      headers: formData.getHeaders(),
    })) as unknown as Promise<AxiosResponse<{ data: CasdoorMfaProps[] }>>
  }
}
