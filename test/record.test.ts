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

test('TestRecord', async () => {
  const sdk = new SDK(testConfig)
  const name = util.getRandomName('Record')

  // Add a new object
  const { data: addResponse } = await sdk.addRecord({
    owner: util.TestCasdoorOrganization,
    name: name,
    createdTime: new Date().toISOString(),
    organization: util.TestCasdoorOrganization,
    user: 'admin',
    action: 'test-record',
  })
  expect(addResponse.status).toBe('ok')

  // Reading the records needs the access token of an admin user
  const token = await sdk.getOAuthTokenByPassword('admin', '123')
  const adminSdk = sdk.withAccessToken(token.access_token)

  // Get all objects, check if our added object is inside the list
  const {
    data: { data: records },
  } = await adminSdk.getRecords()
  expect(records.some((item) => item.name === name)).toBe(true)

  // Get the object
  const {
    data: { data: record },
  } = await adminSdk.getRecord(name)
  expect(record?.name).toBe(name)

  // Get an object that doesn't exist
  const {
    data: { data: missing },
  } = await adminSdk.getRecord(`${name}_missing`)
  expect(missing).toBeNull()
})
