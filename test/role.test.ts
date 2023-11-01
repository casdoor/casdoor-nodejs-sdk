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
import { Role } from '../src/role'

test('TestRole', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('role')

  // Add a new object
  const role: Role = {
    owner: 'admin',
    name: name,
    createdTime: new Date().toISOString(),
    displayName: name,
    description: 'Casdoor Website',
  }

  const { data: addResponse } = await sdk.addRole(role)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: roles },
  } = await sdk.getRoles()
  const found = roles.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedRole },
  } = await sdk.getRole(name)
  if (retrievedRole.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedRole.name} != ${name}`,
    )
  }

  // Update the object
  const updatedDescription = 'Updated Casdoor Website'
  retrievedRole.description = updatedDescription
  const { data: updateResponse } = await sdk.updateRole(retrievedRole)
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedRole },
  } = await sdk.getRole(name)
  if (updatedRole.description !== updatedDescription) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedRole.description} != ${updatedDescription}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deleteRole(retrievedRole)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedRole },
  } = await sdk.getRole(name)
  if (deletedRole) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
