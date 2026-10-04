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

export interface Resource {
  owner: string
  name: string
  createdTime?: string

  user?: string
  provider?: string
  application?: string
  tag?: string
  parent?: string
  fileName?: string
  fileType?: string
  fileFormat?: string
  fileSize?: number
  url?: string
  description?: string
  fullFilePath?: string
}

export class ResourceSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async uploadResource(resource: Resource, psotFile: any) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/upload-resource`
    return (await this.request.postFile(url, psotFile, {
      params: {
        owner: this.config.orgName,
        user: resource.owner,
        application: this.config.appName,
        tag: resource.name,
        parent: resource.parent,
        fullFilePath: resource.fullFilePath,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  // uploadResourceEx uploads a file like uploadResource() with all the parameters of casdoor-go-sdk
  public async uploadResourceEx(
    user: string,
    tag: string,
    parent: string,
    fullFilePath: string,
    file: any,
    createdTime?: string,
    description?: string,
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.postFile('/upload-resource', file, {
      params: {
        owner: this.config.orgName,
        user,
        application: this.config.appName,
        tag,
        parent,
        fullFilePath,
        createdTime,
        description,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<string, string>>>
  }

  public async getPaginationResources(
    owner: string,
    user: string,
    field: string,
    value: string,
    pageSize: number,
    page: number,
    sortField: string,
    sortOrder: string,
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-resources', {
      params: {
        owner,
        user,
        field,
        value,
        p: String(page),
        pageSize: String(pageSize),
        sortField,
        sortOrder,
      },
    })) as unknown as Promise<
      AxiosResponse<CasdoorResponse<Resource[], number>>
    >
  }

  public async getResourceEx(owner: string, name: string) {
    return this.getResource(`${owner}/${name}`)
  }

  public async getResources(
    owner: string,
    user: string,
    field: string,
    value: string,
    sortField: string,
    sortOrder: string,
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-resources', {
      params: {
        owner: owner,
        user: user,
        field: field,
        value: value,
        sortField: sortField,
        sortOrder: sortOrder,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Resource[]>>>
  }

  public async getResource(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-resource', {
      params: {
        id: getId(id, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Resource>>>
  }

  public async modifyResource(method: string, resource: Resource) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    resource.owner = getOwner(resource.owner, this.config.orgName)
    return (await this.request.post(url, resource, {
      params: {
        id: `${resource.owner}/${resource.name}`,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addResource(resource: Resource) {
    return this.modifyResource('add-resource', resource)
  }

  public async updateResource(resource: Resource) {
    return this.modifyResource('update-resource', resource)
  }

  public async deleteResource(resource: Resource) {
    return this.deleteResourceWithTag(resource, '')
  }

  // deleteResourceWithTag deletes the resource, the "Direct" tag also deletes the file from the storage provider
  public async deleteResourceWithTag(resource: Resource, tag: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    resource.owner = getOwner(resource.owner, this.config.orgName)
    return (await this.request.post('/delete-resource', resource, {
      params: {
        tag,
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }
}
