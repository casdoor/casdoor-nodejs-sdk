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

import { Provider } from './provider'
import { AxiosResponse } from 'axios'
import { Config } from './config'
import Request from './request'
import { CasdoorResponse, getId, getOwner } from './util'

export interface Product {
  owner: string
  name: string
  createdTime: string
  displayName: string

  image: string
  detail?: string
  description: string
  tag: string
  currency?: string
  price?: number
  quantity: number
  sold: number
  providers?: string[]
  returnUrl?: string

  state?: string

  providerObjs?: Provider[]
  isRecharge?: boolean
  rechargeOptions?: number[]
  disableCustomRecharge?: boolean
  successUrl?: string
  properties?: Record<string, string>
}

export class ProductSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getProducts() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-products', {
      params: {
        owner: this.config.orgName,

        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Product[]>>>
  }

  public async getProduct(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-product', {
      params: {
        id: getId(id, this.config.orgName),

        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Product>>>
  }

  public async modifyProduct(
    method: string,
    product: Product,
    columns?: string[],
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    product.owner = getOwner(product.owner, this.config.orgName)

    return (await this.request.post(url, product, {
      params: {
        id: `${product.owner}/${product.name}`,
        columns: columns?.join(','),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async getPaginationProducts(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-products', {
      params: {
        ...queryMap,
        owner: this.config.orgName,
        p: String(p),
        pageSize: String(pageSize),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Product[], number>>>
  }

  public async addProduct(product: Product) {
    return this.modifyProduct('add-product', product)
  }

  public async updateProduct(product: Product) {
    return this.modifyProduct('update-product', product)
  }

  public async deleteProduct(product: Product) {
    return this.modifyProduct('delete-product', product)
  }
}
