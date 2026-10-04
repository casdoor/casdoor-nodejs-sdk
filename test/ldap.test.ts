// Copyright 2026 The Casdoor Authors. All Rights Reserved.
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

import { SDK, Config } from '../src'
import * as util from './util'

const testConfig: Config = {
  endpoint: util.TestCasdoorEndpoint,
  clientId: util.TestClientId,
  clientSecret: util.TestClientSecret,
  certificate: util.TestJwtPublicKey,
  orgName: util.TestCasdoorOrganization,
  appName: util.TestCasdoorApplication,
}

test('TestLdap', async () => {
  const sdk = new SDK(testConfig)
  const id = util.getRandomName('ldap')

  // an LDAP server belongs to an organization, the synced users are added to it
  const ldap = {
    owner: '',
    id,
    createdTime: new Date().toISOString(),
    serverName: 'Test LDAP Server',
    host: 'localhost',
    port: 389,
    username: 'cn=admin,dc=example,dc=com',
    password: 'password',
    baseDn: 'dc=example,dc=com',
  }
  const { data: addResponse } = await sdk.addLdap(ldap)
  expect(addResponse.data).toBe('Affected')
  expect(ldap.owner).toBe(util.TestCasdoorOrganization)

  const {
    data: { data: ldaps },
  } = await sdk.getLdaps()
  expect(ldaps.some((item) => item.id === id)).toBe(true)

  const {
    data: { data: retrieved },
  } = await sdk.getLdap(id)
  expect(retrieved.id).toBe(id)

  retrieved.serverName = 'Updated LDAP Server'
  await sdk.updateLdap(retrieved)
  const {
    data: { data: updated },
  } = await sdk.getLdap(id)
  expect(updated.serverName).toBe('Updated LDAP Server')

  const { data: deleteResponse } = await sdk.deleteLdap(retrieved)
  expect(deleteResponse.data).toBe('Affected')
  const {
    data: { data: deleted },
  } = await sdk.getLdap(id)
  expect(deleted).toBeFalsy()
})
