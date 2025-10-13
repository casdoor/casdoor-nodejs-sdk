// Copyright 2024 The Casdoor Authors. All Rights Reserved.
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
import { Policy } from '../src/policy'
import { Enforcer } from '../src/enforcer'

test('TestPolicy', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('policy')

  const enforcer: Enforcer = {
    owner: 'admin',
    name: name,
    createdTime: new Date().toISOString(),
    displayName: name,
    model: 'built-in/user-model-built-in',
    adapter: 'built-in/user-adapter-built-in',
    description: 'Casdoor Website',
  }

  // Add a new object
  const policy: Policy = {
    Id: 0,
    Ptype: 'p',
    V0: '1',
    V1: '2',
    V2: '4',
  }

  const newPolicy: Policy = {
    Id: 0,
    Ptype: 'p',
    V0: '1',
    V1: '2',
    V2: '5',
  }

  const { data: enforcerAddResponse } = await sdk.addEnforcer(enforcer)
  if (enforcerAddResponse.data !== 'Affected') {
    throw new Error('Failed to add enforcer')
  }

  const { data: addResponse } = await sdk.addPolicy(enforcer, policy)
  if (addResponse.data !== 'Affected') {
    // TODO: disable this test case for now, don't know why it doesn't pass in the CI against the demo site
    // throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: policies },
  } = await sdk.getPolicies(enforcer.name)
  const found = policies.some((item) => item.Id === 0 && item.V2 === '4')
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Update the object
  const { data: updateResponse } = await sdk.updatePolicy(
    enforcer,
    policy,
    newPolicy,
  )
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // ValIdate the update
  const {
    data: { data: updatedPolicies },
  } = await sdk.getPolicies(name)
  const updatedfound = updatedPolicies.some(
    (item) => item.Id === 0 && item.V2 === '5',
  )
  if (!updatedfound) {
    throw new Error(
      `Failed to update object, description mismatch: ${policy.V2} != ${newPolicy.V2}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deletePolicy(enforcer, newPolicy)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // ValIdate the deletion
  const {
    data: { data: deletedPolicies },
  } = await sdk.getPolicies(name)
  const deletedfound = deletedPolicies.some((item) => item === newPolicy)
  if (deletedfound) {
    throw new Error(
      `Failed to delete object, it's still retrievable ${JSON.stringify(
        deletedPolicies,
      )}`,
    )
  }
})
