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

export interface Payment {
    owner: string
    name: string
    createdTime: string
    displayName: string

    // Payment Provider Info
    provider: string
    type: string

    // Product Info
    productName: string
    productDisplayName: string
    detail: string
    tag: string
    currency: string
    price: number
    returnUrl: string

    // Payer Info
    user: string
    personName: string
    personIdCard: string
    personEmail: string
    personPhone: string

    // Invoice Info
    invoiceType: string
    invoiceTitle: string
    invoiceTaxId: string
    invoiceRemark: string
    invoiceUrl: string

    // Order Info
    outOrderId: string
    payUrl: string

    state: string
    message: string
}

export class PaymentSDK {
    private config: Config;
    private readonly request: Request;

    constructor(config: Config, request: Request) {
        this.config = config;
        this.request = request;
    }

    public async getPayments() {
        if (!this.request) {
            throw new Error('request init failed')
        }

        return (await this.request.get('/get-payments', {
            params: {
                owner: this.config.orgName, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        })) as unknown as Promise<AxiosResponse<Payment[]>>
    }

    public async getPayment(id: string) {
        if (!this.request) {
            throw new Error('request init failed')
        }

        return (await this.request.get('/get-payment', {
            params: {
                id: `${this.config.orgName}/${id}`, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        })) as unknown as Promise<AxiosResponse<Payment>>
    }

    public async modifyPayment(method: string, payment: Payment) {
        if (!this.request) {
            throw new Error('request init failed')
        }

        const url = `/${method}`
        payment.owner = this.config.orgName
        const paymentInfo = JSON.stringify(payment)
        return (await this.request.post(url, {paymentInfo}, {
            params: {
                id: `${payment.owner}/${payment.name}`, clientId: this.config.clientId, clientSecret: this.config.clientSecret,
            },
        },)) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
    }

    public async addPayment(payment: Payment) {
        return this.modifyPayment('add-payment', payment)
    }

    public async updatePayment(payment: Payment) {
        return this.modifyPayment('update-payment', payment)
    }

    public async deletePayment(payment: Payment) {
        return this.modifyPayment('delete-payment', payment)
    }
}
