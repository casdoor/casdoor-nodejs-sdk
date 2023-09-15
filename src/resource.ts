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

import {AxiosResponse} from 'axios'
import {Config} from "./config";
import Request from "./request";

export interface Resource {
    owner: string
    name: string
    createdTime: string

    user: string
    provider: string
    application: string
    tag: string
    parent: string
    fileName: string
    fileType: string
    fileFormat: string
    fileSize: number
    url: string
    description: string
}

export class ResourceSDK {
    private config: Config;
    private readonly request: Request;

    constructor(config: Config, request: Request) {
        this.config = config;
        this.request = request;
    }

    public async getResources(owner: string, user: string, field: string, value: string, sortField: string, sortOrder: string,) {
        if (!this.request) {
            throw new Error('request init failed')
        }

        return (await this.request.get('/get-resources', {
            params: {
                owner: owner, user: user, field: field, value: value, sortField: sortField, sortOrder: sortOrder, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        })) as unknown as Promise<AxiosResponse<Resource[]>>
    }

    public async getResource(id: string) {
        if (!this.request) {
            throw new Error('request init failed')
        }

        return (await this.request.get('/get-resource', {
            params: {
                id: `${this.config.orgName}/${id}`, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        })) as unknown as Promise<AxiosResponse<Resource>>
    }

    public async modifyResource(method: string, resource: Resource) {
        if (!this.request) {
            throw new Error('request init failed')
        }

        const url = `/${method}`
        resource.owner = this.config.orgName
        const resourceInfo = JSON.stringify(resource)
        return (await this.request.post(url, {resourceInfo}, {
            params: {
                id: `${resource.owner}/${resource.name}`, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        },)) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
    }

    public async addResource(resource: Resource) {
        return this.modifyResource('add-resource', resource)
    }

    public async updateResource(resource: Resource) {
        return this.modifyResource('update-resource', resource)
    }

    public async deleteResource(resource: Resource) {
        return this.modifyResource('delete-resource', resource)
    }
}
