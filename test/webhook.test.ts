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
import { Webhook } from '../src/webhook'

test('TestWebhook', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('webhook')

  // Add a new object
  const webhook: Webhook = {
    owner: 'casbin',
    name: name,
    createdTime: new Date().toISOString(),
    organization: 'casbin',
  }

  const { data: addResponse } = await sdk.addWebhook(webhook)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: webhooks },
  } = await sdk.getWebhooks()
  const found = webhooks.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedWebhook },
  } = await sdk.getWebhook(name)
  if (retrievedWebhook.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedWebhook.name} != ${name}`,
    )
  }

  // Update the object
  const updatedOrganization = 'Updated Casdoor Website'
  retrievedWebhook.organization = updatedOrganization
  const { data: updateResponse } = await sdk.updateWebhook(retrievedWebhook)
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedWebhook },
  } = await sdk.getWebhook(name)
  if (updatedWebhook.organization !== updatedOrganization) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedWebhook.organization} != ${updatedOrganization}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deleteWebhook(retrievedWebhook)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedWebhook },
  } = await sdk.getWebhook(name)
  if (deletedWebhook) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
