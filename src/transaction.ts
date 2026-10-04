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

export interface Transaction {
  owner: string
  name: string
  createdTime?: string
  displayName?: string
  application?: string
  domain?: string
  category?: string
  type?: string
  subtype?: string
  provider?: string
  user?: string
  tag?: string
  amount?: number
  currency?: string
  payment?: string
  state?: string
}

export class TransactionSDK {
  private config: Config
  private readonly request: Request

  constructor(config: Config, request: Request) {
    this.config = config
    this.request = request
  }

  public async getTransactions() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-transactions', {
      params: {
        owner: this.config.orgName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Transaction[]>>>
  }

  public async getPaginationTransactions(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-transactions', {
      params: {
        ...queryMap,
        owner: this.config.orgName,
        p: String(p),
        pageSize: String(pageSize),
      },
    })) as unknown as Promise<
      AxiosResponse<CasdoorResponse<Transaction[], number>>
    >
  }

  public async getTransaction(name: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-transaction', {
      params: {
        id: getId(name, this.config.orgName),
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Transaction>>>
  }

  public async getUserTransactions(userName: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    // Casdoor has no get-user-transactions API, get-transactions filters the transactions by user
    return (await this.request.get('/get-transactions', {
      params: {
        owner: this.config.orgName,
        field: 'user',
        value: userName,
      },
    })) as unknown as Promise<AxiosResponse<CasdoorResponse<Transaction[]>>>
  }

  // addTransactionWithDryRun validates the transaction (e.g. the user's balance) without saving it when dryRun is true
  public async addTransactionWithDryRun(
    transaction: Transaction,
    dryRun: boolean,
  ) {
    return this.modifyTransaction(
      'add-transaction',
      transaction,
      undefined,
      dryRun ? { dryRun: '1' } : {},
    )
  }

  public async modifyTransaction(
    method: string,
    transaction: Transaction,
    columns?: string[],
    params: Record<string, string> = {},
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    transaction.owner = getOwner(transaction.owner, this.config.orgName)
    return (await this.request.post(`/${method}`, transaction, {
      params: {
        ...params,
        id: `${transaction.owner}/${transaction.name}`,
        columns: columns?.join(','),
      },
    })) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addTransaction(transaction: Transaction) {
    return this.modifyTransaction('add-transaction', transaction)
  }

  public async updateTransaction(transaction: Transaction) {
    return this.modifyTransaction('update-transaction', transaction)
  }

  public async deleteTransaction(transaction: Transaction) {
    return this.modifyTransaction('delete-transaction', transaction)
  }
}
