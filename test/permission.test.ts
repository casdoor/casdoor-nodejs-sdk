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
import { Permission } from '../src/permission'

test('TestPermission', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('permission')

  // Add a new object
  const permission: Permission = {
    owner: 'casbin',
    name: name,
    createdTime: new Date().toISOString(),
    displayName: name,
    description: 'Casdoor Website',
    users: ['casbin/*'],
    groups: [],
    roles: [],
    domains: [],
    model: 'admin/user-model-built-in',
    resourceType: 'Application',
    resources: ['app-casbin'],
    actions: ['Read', 'Write'],
    effect: 'Allow',
    isEnabled: true,
  }

  const { data: addResponse } = await sdk.addPermission(permission)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: permissions },
  } = await sdk.getPermissions()
  const found = permissions.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedPermission },
  } = await sdk.getPermission(name)
  if (retrievedPermission.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedPermission.name} != ${name}`,
    )
  }

  // Update the object
  const updatedDescription = 'Updated Casdoor Website'
  retrievedPermission.description = updatedDescription
  const { data: updateResponse } = await sdk.updatePermission(
    retrievedPermission,
  )
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedPermission },
  } = await sdk.getPermission(name)
  if (updatedPermission.description !== updatedDescription) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedPermission.description} != ${updatedDescription}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deletePermission(
    retrievedPermission,
  )
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedPermission },
  } = await sdk.getPermission(name)
  if (deletedPermission) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
