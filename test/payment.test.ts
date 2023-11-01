// Copyright 2023 The Casdoor Authors. All Rights Reserved.
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

import { SDK } from '../src'
import * as util from './util'
import { Config } from '../src/config'
import { Payment } from '../src/payment'

test('TestPayment', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('payment')

  // Add a new object
  const payment: Payment = {
    owner: 'admin',
    name: name,
    createdTime: new Date().toISOString(),
    displayName: name,
    productName: 'casbin',
  }

  const { data: addResponse } = await sdk.addPayment(payment)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: payments },
  } = await sdk.getPayments()
  const found = payments.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedPayment },
  } = await sdk.getPayment(name)
  if (retrievedPayment.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedPayment.name} != ${name}`,
    )
  }

  // Update the object
  const updatedProductName = 'Updated Casdoor Website'
  retrievedPayment.productName = updatedProductName
  const { data: updateResponse } = await sdk.updatePayment(retrievedPayment)
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedPayment },
  } = await sdk.getPayment(name)
  if (updatedPayment.productName !== updatedProductName) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedPayment.productName} != ${updatedProductName}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deletePayment(retrievedPayment)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedPayment },
  } = await sdk.getPayment(name)
  if (deletedPayment) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
