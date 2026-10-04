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

test('TestOrder', async () => {
  const sdk = new SDK(testConfig)
  const productName = util.getRandomName('OrderProduct')
  const orderName = util.getRandomName('Order')

  const product = {
    owner: util.TestCasdoorOrganization,
    name: productName,
    createdTime: new Date().toISOString(),
    displayName: productName,
    image: 'https://cdn.casbin.org/img/casdoor-logo_1185x256.png',
    description: 'Casdoor Website',
    tag: 'auto_created_product_for_plan',
    quantity: 999,
    sold: 0,
    state: 'Published',
    providers: ['provider_payment_dummy'],
    price: 1,
    currency: 'USD',
  }
  const { data: addProductResponse } = await sdk.addProduct(product)
  expect(addProductResponse.data).toBe('Affected')

  const { data: addResponse } = await sdk.addOrder({
    owner: util.TestCasdoorOrganization,
    name: orderName,
    createdTime: new Date().toISOString(),
    displayName: orderName,
    products: [productName],
    productInfos: [
      {
        owner: util.TestCasdoorOrganization,
        name: productName,
        displayName: productName,
        price: 1,
        currency: 'USD',
        quantity: 1,
      },
    ],
    user: 'admin',
    price: 1,
    currency: 'USD',
    state: 'Created',
  })
  expect(addResponse.data).toBe('Affected')

  const {
    data: { data: orders },
  } = await sdk.getOrders()
  expect(orders.some((item) => item.name === orderName)).toBe(true)

  const {
    data: { data2: total },
  } = await sdk.getPaginationOrders(1, 10, {})
  expect(total).toBeGreaterThan(0)

  const {
    data: { data: userOrders },
  } = await sdk.getUserOrders('admin')
  expect(userOrders.some((item) => item.name === orderName)).toBe(true)

  const {
    data: { data: order },
  } = await sdk.getOrder(orderName)
  expect(order.name).toBe(orderName)

  order.message = 'Updated order message'
  const { data: updateResponse } = await sdk.updateOrder(order)
  expect(updateResponse.data).toBe('Affected')

  const {
    data: { data: updated },
  } = await sdk.getOrder(orderName)
  expect(updated.message).toBe('Updated order message')

  const { data: cancelResponse } = await sdk.cancelOrder(orderName)
  expect(cancelResponse.data).toBe('Affected')

  const { data: deleteResponse } = await sdk.deleteOrder(order)
  expect(deleteResponse.data).toBe('Affected')

  const {
    data: { data: deleted },
  } = await sdk.getOrder(orderName)
  expect(deleted).toBeFalsy()

  await sdk.deleteProduct(product)
})

test('TestOrderPay', async () => {
  const sdk = new SDK(testConfig)
  const productName = util.getRandomName('OrderPayProduct')

  const product = {
    owner: util.TestCasdoorOrganization,
    name: productName,
    createdTime: new Date().toISOString(),
    displayName: productName,
    image: 'https://cdn.casbin.org/img/casdoor-logo_1185x256.png',
    description: 'Casdoor Website',
    tag: 'auto_created_product_for_plan',
    quantity: 999,
    sold: 0,
    state: 'Published',
    providers: ['provider_payment_dummy'],
    price: 1,
    currency: 'USD',
  }
  const { data: addProductResponse } = await sdk.addProduct(product)
  expect(addProductResponse.data).toBe('Affected')

  const { data: placeResponse } = await sdk.placeOrder(
    [{ name: productName, quantity: 1 }],
    'admin',
  )
  expect(placeResponse.status).toBe('ok')
  const order = placeResponse.data
  expect(order.name).toBeTruthy()

  const { data: payResponse } = await sdk.payOrder(
    order.name,
    'provider_payment_dummy',
  )
  expect(payResponse.status).toBe('ok')

  const { data: buyResponse } = await sdk.buyProduct(
    productName,
    'provider_payment_dummy',
    'admin',
  )
  expect(buyResponse.status).toBe('ok')

  await sdk.deleteProduct(product)
})
