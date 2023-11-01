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
import { Pricing } from '../src/pricing'

test('TestPricing', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('pricing')

  // Add a new object
  const pricing: Pricing = {
    owner: 'admin',
    name: name,
    createdTime: new Date().toISOString(),
    displayName: name,
    application: 'app-admin',
    description: 'Casdoor Websit',
  }

  const { data: addResponse } = await sdk.addPricing(pricing)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: pricings },
  } = await sdk.getPricings()
  const found = pricings.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedPricing },
  } = await sdk.getPricing(name)
  if (retrievedPricing.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedPricing.name} != ${name}`,
    )
  }

  // Update the object
  const updatedDescription = 'Updated Casdoor Website'
  retrievedPricing.description = updatedDescription
  const { data: updateResponse } = await sdk.updatePricing(retrievedPricing)
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedPricing },
  } = await sdk.getPricing(name)
  if (updatedPricing.description !== updatedDescription) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedPricing.description} != ${updatedDescription}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deletePricing(retrievedPricing)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedPricing },
  } = await sdk.getPricing(name)
  if (deletedPricing) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
