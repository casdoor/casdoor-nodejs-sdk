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

export interface Product {
  owner: string
  name: string
  createdTime: string
  displayName: string

  image: string
  detail: string
  description: string
  tag: string
  currency: string
  price: number
  quantity: number
  sold: number
  providers?: string[]
  returnUrl?: string

  state?: string

  providerObjs?: Provider[]
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
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<Product[]>>
  }

  public async getProduct(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-product', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<Product>>
  }

  public async modifyProduct(method: string, product: Product) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    product.owner = this.config.orgName
    const productInfo = JSON.stringify(product)
    return (await this.request.post(
      url,
      { productInfo },
      {
        params: {
          id: `${product.owner}/${product.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
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
