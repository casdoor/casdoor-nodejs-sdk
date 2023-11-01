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
import { Model } from '../src/model'

test('TestModel', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('model')

  // Add a new object
  const model: Model = {
    owner: 'casbin',
    name: name,
    createdTime: new Date().toISOString(),
    displayName: name,
    modelText: `
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = g(r.sub, p.sub) && r.obj == p.obj && r.act == p.act
    `,
  }

  const { data: addResponse } = await sdk.addModel(model)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: models },
  } = await sdk.getModels()
  const found = models.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedModel },
  } = await sdk.getModel(name)
  if (retrievedModel.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedModel.name} != ${name}`,
    )
  }

  // Update the object
  const updatedDisplayName = 'UpdatedName1'
  retrievedModel.displayName = updatedDisplayName
  const { data: updateResponse } = await sdk.updateModel(retrievedModel)
  if (updateResponse.status !== 'ok') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedModel },
  } = await sdk.getModel(name)
  if (updatedModel.displayName !== updatedDisplayName) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedModel.displayName} != ${updatedDisplayName}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deleteModel(retrievedModel)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedModel },
  } = await sdk.getModel(name)
  if (deletedModel) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
