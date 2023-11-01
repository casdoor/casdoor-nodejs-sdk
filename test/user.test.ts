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
import { User } from '../src/user'

test('TestUser', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('user')

  // Add a new object
  const user: User = {
    owner: 'admin',
    name: name,
    createdTime: new Date().toISOString(),
    displayName: name,
  }

  const { data: addResponse } = await sdk.addUser(user)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: users },
  } = await sdk.getUsers()
  const found = users.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedUser },
  } = await sdk.getUser(name)
  if (retrievedUser.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedUser.name} != ${name}`,
    )
  }

  // Update the object
  const updatedDisplayName = 'Updated Casdoor Website'
  retrievedUser.displayName = updatedDisplayName
  const { data: updateResponse } = await sdk.updateUser(retrievedUser)
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedUser },
  } = await sdk.getUser(name)
  if (updatedUser.displayName !== updatedDisplayName) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedUser.displayName} != ${updatedDisplayName}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deleteUser(retrievedUser)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedUser },
  } = await sdk.getUser(name)
  if (deletedUser) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
