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

import { SDK, Config } from '../src'
import * as util from './util'

const testConfig: Config = {
  endpoint: util.TestCasdoorEndpoint,
  clientId: util.TestClientId,
  clientSecret: util.TestClientSecret,
  certificate: util.TestJwtPublicKey,
  orgName: util.TestCasdoorOrganization,
  appName: util.TestCasdoorApplication,
}

test('TestTransaction', async () => {
  const sdk = new SDK(testConfig)

  // a recharge of the organization doesn't need a user balance, so it can be added in CI
  const transaction = {
    owner: util.TestCasdoorOrganization,
    name: '',
    createdTime: new Date().toISOString(),
    application: 'app-casbin',
    domain: 'https://casdoor.ai',
    category: 'Recharge',
    type: 'Recharge',
    tag: 'Organization',
    amount: 100,
    currency: 'USD',
    user: 'admin',
    state: 'Paid',
  }

  const { data: dryRunResponse } = await sdk.addTransactionWithDryRun(
    { ...transaction },
    true,
  )
  expect(dryRunResponse.status).toBe('ok')

  const { data: addResponse } = await sdk.addTransaction(transaction)
  expect(addResponse.status).toBe('ok')
  const name = addResponse.data as string
  expect(name).toBeTruthy()

  const {
    data: { data: transactions },
  } = await sdk.getTransactions()
  expect(transactions.some((item) => item.name === name)).toBe(true)

  const {
    data: { data: userTransactions },
  } = await sdk.getUserTransactions('admin')
  expect(userTransactions.some((item) => item.name === name)).toBe(true)

  const {
    data: { data2: total },
  } = await sdk.getPaginationTransactions(1, 10, {})
  expect(total).toBeGreaterThan(0)

  const {
    data: { data: retrieved },
  } = await sdk.getTransaction(name)
  expect(retrieved.name).toBe(name)

  retrieved.displayName = 'Updated Transaction'
  const { data: updateResponse } = await sdk.updateTransaction(retrieved)
  expect(updateResponse.data).toBe('Affected')

  const {
    data: { data: updated },
  } = await sdk.getTransaction(name)
  expect(updated.displayName).toBe('Updated Transaction')

  const { data: deleteResponse } = await sdk.deleteTransaction(retrieved)
  expect(deleteResponse.data).toBe('Affected')

  const {
    data: { data: deleted },
  } = await sdk.getTransaction(name)
  expect(deleted).toBeFalsy()
})
