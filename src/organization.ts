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

interface AccountItem {
    name: string
    visible: boolean
    viewRule: string
    modifyRule: string
}

export interface ThemeData {
    themeType: string
    colorPrimary: string
    borderRadius: number
    isCompact: boolean
    isEnabled: boolean
}

interface MfaItem {
    name: string
    rule: string
}

export interface Organization {
    owner: string
    name: string
    createdTime: string

    displayName: string
    websiteUrl: string
    favicon: string
    passwordType: string
    passwordSalt: string
    passwordOptions?: string[]
    countryCodes?: string[]
    defaultAvatar: string
    defaultApplication: string
    tags?: string[]
    languages?: string[]
    themeData?: ThemeData
    masterPassword: string
    initScore: number
    enableSoftDeletion: boolean
    isProfilePublic: boolean

    mfaItems?: MfaItem[]
    accountItems?: AccountItem[]
}

export class OrganizationSDK {
    private config: Config;
    private readonly request: Request;

    constructor(config: Config, request: Request) {
        this.config = config;
        this.request = request;
    }

    public async getOrganizations() {
        if (!this.request) {
            throw new Error('request init failed')
        }

        return (await this.request.get('/get-organizations', {
            params: {
                owner: this.config.orgName, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        })) as unknown as Promise<AxiosResponse<Organization[]>>
    }

    public async getOrganization(id: string) {
        if (!this.request) {
            throw new Error('request init failed')
        }

        return (await this.request.get('/get-organization', {
            params: {
                id: `${this.config.orgName}/${id}`, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        })) as unknown as Promise<AxiosResponse<Organization>>
    }

    public async modifyOrganization(method: string, organization: Organization) {
        if (!this.request) {
            throw new Error('request init failed')
        }

        const url = this.config.endpoint + `/${method}`
        organization.owner = this.config.orgName
        const organizationInfo = JSON.stringify(organization)
        return (await this.request.post(url, {organizationInfo}, {
            params: {
                id: `${organization.owner}/${organization.name}`, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        },)) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
    }

    public async addOrganization(organization: Organization) {
        return this.modifyOrganization('add-organization', organization)
    }

    public async updateOrganization(organization: Organization) {
        return this.modifyOrganization('update-organization', organization)
    }

    public async deleteOrganization(organization: Organization) {
        return this.modifyOrganization('delete-organization', organization)
    }
}
