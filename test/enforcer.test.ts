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
import { Enforcer } from '../src/enforcer'

test('TestEnforcer', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('enforcer')

  // Add a new object
  const enforcer: Enforcer = {
    owner: 'admin',
    name: name,
    createdTime: new Date().toISOString(),
    displayName: name,
    model: 'built-in/user-model-built-in',
    adapter: 'built-in/user-adapter-built-in',
    description: 'Casdoor Website',
  }

  const { data: addResponse } = await sdk.addEnforcer(enforcer)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: enforcers },
  } = await sdk.getEnforcers()
  const found = enforcers.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedEnforcer },
  } = await sdk.getEnforcer(name)
  if (retrievedEnforcer.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedEnforcer.name} != ${name}`,
    )
  }

  // Update the object
  const updatedDescription = 'Updated Casdoor Website'
  retrievedEnforcer.description = updatedDescription
  const { data: updateResponse } = await sdk.updateEnforcer(retrievedEnforcer)
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedEnforcer },
  } = await sdk.getEnforcer(name)
  if (updatedEnforcer.description !== updatedDescription) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedEnforcer.description} != ${updatedDescription}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deleteEnforcer(retrievedEnforcer)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedEnforcer },
  } = await sdk.getEnforcer(name)
  if (deletedEnforcer) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
