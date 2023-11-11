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
import { Organization } from '../src/organization'

test('TestOrganization', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('organization')

  // Add a new object
  const organization: Organization = {
    owner: 'admin',
    name: name,
    createdTime: new Date().toISOString(),
    displayName: name,
    websiteUrl: 'https://example.com',
    passwordOptions: ['AtLeast6'],
    passwordType: 'plain',
    countryCodes: [
      'US',
      'ES',
      'FR',
      'DE',
      'GB',
      'CN',
      'JP',
      'KR',
      'VN',
      'ID',
      'SG',
      'IN',
    ],
    tags: [],
    languages: [
      'en',
      'zh',
      'es',
      'fr',
      'de',
      'id',
      'ja',
      'ko',
      'ru',
      'vi',
      'pt',
    ],
    initScore: 2000,
    enableSoftDeletion: false,
    isProfilePublic: false,
  }

  const { data: addResponse } = await sdk.addOrganization(organization)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: organizations },
  } = await sdk.getOrganizations()
  const found = organizations.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedOrganization },
  } = await sdk.getOrganization(name)
  if (retrievedOrganization.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedOrganization.name} != ${name}`,
    )
  }

  // Update the object
  const updatedDisplayName = 'Updated Casdoor Website'
  retrievedOrganization.displayName = updatedDisplayName
  const { data: updateResponse } = await sdk.updateOrganization(
    retrievedOrganization,
  )
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedOrganization },
  } = await sdk.getOrganization(name)
  if (updatedOrganization.displayName !== updatedDisplayName) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedOrganization.displayName} != ${updatedDisplayName}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deleteOrganization(
    retrievedOrganization,
  )
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedOrganization },
  } = await sdk.getOrganization(name)
  if (deletedOrganization) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
