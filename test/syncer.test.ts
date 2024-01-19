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
import { Syncer } from '../src/syncer'

test('TestSyncer', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('syncer')

  // Add a new object
  const syncer: Syncer = {
    owner: 'admin',
    name: name,
    createdTime: new Date().toISOString(),
    organization: 'casbin',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123',
    databaseType: 'mysql',
    database: 'syncer_db',
    table: 'user-table',
    syncInterval: 1,
  }

  const { data: addResponse } = await sdk.addSyncer(syncer)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: syncers },
  } = await sdk.getSyncers()
  const found = syncers.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedSyncer },
  } = await sdk.getSyncer(name)
  if (retrievedSyncer.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedSyncer.name} != ${name}`,
    )
  }

  // Update the object
  const updatedHost = 'Updated Host'
  retrievedSyncer.host = updatedHost
  const { data: updateResponse } = await sdk.updateSyncer(retrievedSyncer)
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedSyncer },
  } = await sdk.getSyncer(name)
  if (updatedSyncer.host !== updatedHost) {
    throw new Error(
      `Failed to update object, host mismatch: ${updatedSyncer.host} != ${updatedHost}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deleteSyncer(retrievedSyncer)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedSyncer },
  } = await sdk.getSyncer(name)
  if (deletedSyncer) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
