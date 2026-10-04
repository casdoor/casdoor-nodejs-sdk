// Copyright 2026 The Casdoor Authors. All Rights Reserved.
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
import { Payment } from './payment'

export interface Order {
  owner: string
  name: string
  createdTime?: string
  updateTime?: string
  displayName?: string
  products?: string[]
  productInfos?: ProductInfo[]
  user?: string
  payment?: string
  price?: number
  currency?: string
  state?: string
  message?: string
  couponName?: string
  couponDiscount?: number
}

export interface ProductInfo {
  owner?: string
  name: string
  createdTime?: string
  displayName?: string
  image?: string
  detail?: string
  price?: number
  currency?: string
  isRecharge?: boolean
  quantity?: number
  pricingName?: string
  planName?: string
}

export class OrderSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getOrders() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-orders', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Order[]>>>
  }

  public async getPaginationOrders(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-orders', {
      params: {
        ...queryMap,
        owner: this.config.orgName,
        p: String(p),
        pageSize: String(pageSize),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Order[], number>>>
  }

  public async getOrder(name: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-order', {
      params: {
        id: getId(name, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Order>>>
  }

  public async getUserOrders(userName: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-user-orders', {
      params: {
        owner: this.config.orgName,
        user: userName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Order[]>>>
  }

  // placeOrder creates an order of the products for the user, userName defaults to the current user
  public async placeOrder(productInfos: ProductInfo[], userName?: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.post(
      '/place-order',
      { productInfos },
      {
        params: {
          owner: this.config.orgName,
          userName: userName || undefined,
        },
      },
    )) as unknown as Promise<AxiosResponse<CasdoorResponse<Order>>>
  }

  // payOrder creates a payment of the order with the payment provider
  public async payOrder(orderName: string, providerName: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.post('/pay-order', '', {
      params: {
        id: getId(orderName, this.config.orgName),
        providerName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Payment>>>
  }

  // buyProduct places an order of a single product, providerName is kept for compatibility
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async buyProduct(
    name: string,
    providerName: string,
    userName?: string,
  ) {
    return this.placeOrder([{ name, quantity: 1 }], userName)
  }

  public async cancelOrder(name: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.post('/cancel-order', '', {
      params: {
        id: getId(name, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async modifyOrder(
    method: string,
    order: Order,
    columns?: string[],
    params: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    order.owner = getOwner(order.owner, this.config.orgName)
    return (await this.request.post(`/${method}`, order, {
      params: {
        ...params,
        id: `${order.owner}/${order.name}`,
        columns: columns?.join(','),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addOrder(order: Order) {
    return this.modifyOrder('add-order', order)
  }

  public async updateOrder(order: Order) {
    return this.modifyOrder('update-order', order)
  }

  public async deleteOrder(order: Order) {
    return this.modifyOrder('delete-order', order)
  }
}
