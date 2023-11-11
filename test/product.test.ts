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
import { Product } from '../src/product'

test('TestProduct', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('product')

  // Add a new object
  const product: Product = {
    owner: 'admin',
    name: name,
    createdTime: new Date().toISOString(),
    displayName: name,
    image: 'https://cdn.casbin.org/img/casdoor-logo_1185x256.png',
    description: 'Casdoor Website',
    tag: 'auto_created_product_for_plan',
    quantity: 999,
    sold: 0,
    state: 'Published',
  }

  const { data: addResponse } = await sdk.addProduct(product)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: products },
  } = await sdk.getProducts()
  const found = products.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedProduct },
  } = await sdk.getProduct(name)
  if (retrievedProduct.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedProduct.name} != ${name}`,
    )
  }

  // Update the object
  const updatedDescription = 'Updated Casdoor Website'
  retrievedProduct.description = updatedDescription
  const { data: updateResponse } = await sdk.updateProduct(retrievedProduct)
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedProduct },
  } = await sdk.getProduct(name)
  if (updatedProduct.description !== updatedDescription) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedProduct.description} != ${updatedDescription}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deleteProduct(retrievedProduct)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedProduct },
  } = await sdk.getProduct(name)
  if (deletedProduct) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
