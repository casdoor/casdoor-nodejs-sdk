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
import { Session } from '../src/session'

test('TestSession', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const name = util.getRandomName('session')

  // Add a new object
  const session: Session = {
    owner: 'casbin',
    name: name,
    application: 'app-built-in',
    createdTime: new Date().toISOString(),
    sessionId: [],
  }

  const { data: addResponse } = await sdk.addSession(session)
  if (addResponse.data !== 'Affected') {
    throw new Error('Failed to add object')
  }

  // Get all objects and check if our added object is in the list
  const {
    data: { data: sessions },
  } = await sdk.getSessions()
  const found = sessions.some((item) => item.name === name)
  if (!found) {
    throw new Error('Added object not found in list')
  }

  // Get the object
  const {
    data: { data: retrievedSession },
  } = await sdk.getSession(name, session.application)
  if (retrievedSession.name !== name) {
    throw new Error(
      `Retrieved object does not match added object: ${retrievedSession.name} != ${name}`,
    )
  }

  // Update the object
  const updateTime = new Date().toISOString()
  retrievedSession.createdTime = updateTime
  const { data: updateResponse } = await sdk.updateSession(retrievedSession)
  if (updateResponse.data !== 'Affected') {
    throw new Error('Failed to update object')
  }

  // Validate the update
  const {
    data: { data: updatedSession },
  } = await sdk.getSession(name, session.application)
  if (updatedSession.createdTime !== updateTime) {
    throw new Error(
      `Failed to update object, description mismatch: ${updatedSession.createdTime} != ${updateTime}`,
    )
  }

  // Delete the object
  const { data: deleteResponse } = await sdk.deleteSession(retrievedSession)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }

  // Validate the deletion
  const {
    data: { data: deletedSession },
  } = await sdk.getSession(name, session.application)
  if (deletedSession) {
    throw new Error("Failed to delete object, it's still retrievable")
  }
})
