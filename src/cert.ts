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

export interface Cert {
  owner: string
  name: string
  createdTime: string

  displayName: string
  scope: string
  type: string
  cryptoAlgorithm: string
  bitSize: number
  expireInYears: number

  certificate?: string
  privateKey?: string
  authorityPublicKey?: string
  authorityRootPublicKey?: string
}

export class CertSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getCerts() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-certs', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Cert[] }>>
  }

  public async getCert(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-cert', {
      params: {
        id: `${this.config.orgName}/${id}`,
      },
    })) as unknown as Promise<AxiosResponse<{ data: Cert }>>
  }

  public async modifyCert(method: string, cert: Cert) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    cert.owner = this.config.orgName
    return (await this.request.post(url, cert, {
      params: {
        id: `${cert.owner}/${cert.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addCert(cert: Cert) {
    return this.modifyCert('add-cert', cert)
  }

  public async updateCert(cert: Cert) {
    return this.modifyCert('update-cert', cert)
  }

  public async deleteCert(cert: Cert) {
    return this.modifyCert('delete-cert', cert)
  }
}
