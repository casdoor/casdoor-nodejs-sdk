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

export type CasbinRequest = string[]
export type CasbinResponse = boolean[]

export class EnforceSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async enforce(
    permissionId: string,
    modelId: string,
    resourceId: string,
    enforcerId: string,
    casbinRequest: CasbinRequest,
  ): Promise<boolean> {
    const response = await this.doEnforce<CasbinResponse>(
      'enforce',
      permissionId,
      modelId,
      resourceId,
      enforcerId,
      casbinRequest,
    )
    const { data } = response.data
    for (const isAllow of data) {
      if (isAllow) {
        return isAllow
      }
    }
    return false
  }

  public async batchEnforce(
    permissionId: string,
    modelId: string,
    resourceId: string,
    enforcerId: string,
    casbinRequest: CasbinRequest[],
  ): Promise<boolean[]> {
    const response = await this.doEnforce<CasbinResponse[]>(
      'batch-enforce',
      permissionId,
      modelId,
      resourceId,
      enforcerId,
      casbinRequest,
    )
    const { data } = response.data
    return data.flat(2)
  }

  private async doEnforce<T>(
    action: string,
    permissionId: string,
    modelId: string,
    resourceId: string,
    enforcerId: string,
    casbinRequest: CasbinRequest | CasbinRequest[],
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${action}`
    return (await this.request.post(url, casbinRequest, {
      params: {
        permissionId: permissionId,
        modelId: modelId,
        resourceId: resourceId,
        enforcerId: enforcerId,
      },
    })) as unknown as Promise<
      AxiosResponse<{
        data: T
      }>
    >
  }
}
