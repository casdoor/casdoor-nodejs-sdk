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
import { Cert } from '../src/cert'

test('TestCert', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('cert')

  // Add a new object
  const cert: Cert = {
    owner: 'admin',
    name: name,
    createdTime: new Date().toISOString(),
    displayName: name,
    scope: 'JWT',
    type: 'x509',
    cryptoAlgorithm: 'RS256',
    bitSize: 4096,
    expireInYears: 20,
  }

  const { data: addResponse } = await sdk.addCert(cert)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: certs },
  } = await sdk.getCerts()
  const found = certs.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedCert },
  } = await sdk.getCert(name)
  if (retrievedCert.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedCert.name} != ${name}`,
    )
  }

  // Update the object
  const updatedDisplayName = 'Updated Casdoor Website'
  retrievedCert.displayName = updatedDisplayName
  const { data: updateResponse } = await sdk.updateCert(retrievedCert)
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedCert },
  } = await sdk.getCert(name)
  if (updatedCert.displayName !== updatedDisplayName) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedCert.displayName} != ${updatedDisplayName}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deleteCert(retrievedCert)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedCert },
  } = await sdk.getCert(name)
  if (deletedCert) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
