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

export interface Plan {
    owner: string
    name: string
    createdTime: string
    displayName: string
    description: string

    pricePerMonth: number
    pricePerYear: number
    currency: string
    isEnabled: boolean

    role: string
    options?: string[]
}

export class PlanSDK {
    private config: Config;
    private readonly request: Request;

    constructor(config: Config, request: Request) {
        this.config = config;
        this.request = request;
    }

    public async getPlans() {
        if (!this.request) {
            throw new Error('request init failed')
        }

        return (await this.request.get('/get-plans', {
            params: {
                owner: this.config.orgName, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        })) as unknown as Promise<AxiosResponse<Plan[]>>
    }

    public async getPlan(id: string) {
        if (!this.request) {
            throw new Error('request init failed')
        }

        return (await this.request.get('/get-plan', {
            params: {
                id: `${this.config.orgName}/${id}`, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        })) as unknown as Promise<AxiosResponse<Plan>>
    }

    public async modifyPlan(method: string, plan: Plan) {
        if (!this.request) {
            throw new Error('request init failed')
        }

        const url = `/${method}`
        plan.owner = this.config.orgName
        const planInfo = JSON.stringify(plan)
        return (await this.request.post(url, {planInfo}, {
            params: {
                id: `${plan.owner}/${plan.name}`, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        },)) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
    }

    public async addPlan(plan: Plan) {
        return this.modifyPlan('add-plan', plan)
    }

    public async updatePlan(plan: Plan) {
        return this.modifyPlan('update-plan', plan)
    }

    public async deletePlan(plan: Plan) {
        return this.modifyPlan('delete-plan', plan)
    }
}
