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
import { CasdoorResponse, getId, getOwner } from './util'

export interface Model {
  owner: string
  name: string
  createdTime?: string
  displayName?: string
  description?: string

  modelText: string
}

export class ModelSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getModels() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-models', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Model[]>>>
  }

  public async getModel(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-model', {
      params: {
        id: getId(id, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Model>>>
  }

  public async modifyModel(method: string, model: Model, columns?: string[]) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    model.owner = getOwner(model.owner, this.config.orgName)
    return (await this.request.post(url, model, {
      params: {
        id: `${model.owner}/${model.name}`,
        columns: columns?.join(','),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async getPaginationModels(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-models', {
      params: {
        ...queryMap,
        owner: this.config.orgName,
        p: String(p),
        pageSize: String(pageSize),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Model[], number>>>
  }

  public async addModel(model: Model) {
    return this.modifyModel('add-model', model)
  }

  public async updateModel(model: Model) {
    return this.modifyModel('update-model', model)
  }

  public async deleteModel(model: Model) {
    return this.modifyModel('delete-model', model)
  }
}
