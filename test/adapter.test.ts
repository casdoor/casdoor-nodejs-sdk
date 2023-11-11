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
import { Adapter } from '../src/adapter'

test('TestAdapter', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('adapter')

  // Add a new object
  const adapter: Adapter = {
    owner: 'admin',
    name: name,
    createdTime: new Date().toISOString(),
    user: name,
    host: 'https://casdoor.org',
  }

  const { data: addResponse } = await sdk.addAdapter(adapter)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: adapters },
  } = await sdk.getAdapters()
  const found = adapters.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedAdapter },
  } = await sdk.getAdapter(name)
  if (retrievedAdapter.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedAdapter.name} != ${name}`,
    )
  }

  // Update the object
  const updatedUser = 'Updated Casdoor Website'
  retrievedAdapter.user = updatedUser
  const { data: updateResponse } = await sdk.updateAdapter(retrievedAdapter)
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedAdapter },
  } = await sdk.getAdapter(name)
  if (updatedAdapter.user !== updatedUser) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedAdapter.user} != ${updatedUser}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deleteAdapter(retrievedAdapter)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedAdapter },
  } = await sdk.getAdapter(name)
  if (deletedAdapter) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
