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

import { SDK } from './sdk'
import { AxiosResponse } from 'axios'
import { User } from './user'

interface Model {
  owner: string
  name: string
  createdTime: string
  updatedTime: string

  displayName: string
  manager: string
  contactEmail: string
  type: string
  parentId: string
  isTopModel: boolean
  users?: User[]

  title?: string
  key?: string
  children?: Model[]

  isEnabled: boolean
}

export class ModelSDK extends SDK {
  public async getModels() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-models', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Model[]>>
  }

  public async getModel(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-model', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Model>>
  }

  public async modifyModel(method: string, model: Model) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    model.owner = this.config.orgName
    const modelInfo = JSON.stringify(model)
    return (await this.request.post(
      url,
      { modelInfo },
      {
        params: {
          id: `${model.owner}/${model.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
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
