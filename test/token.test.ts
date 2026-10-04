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

test('TestToken', async () => {
  const sdk = new SDK(testConfig)
  const name = util.getRandomName('token')

  const { data: addResponse } = await sdk.addToken({
    owner: 'admin',
    name,
    createdTime: new Date().toISOString(),
    application: 'app-casbin',
    organization: util.TestCasdoorOrganization,
    user: 'admin',
    code: 'abc',
    accessToken: '123456',
    expiresIn: 3600,
    scope: 'read',
    tokenType: 'Bearer',
  })
  expect(addResponse.data).toBe('Affected')

  const {
    data: { data: tokens },
  } = await sdk.getTokens()
  expect(tokens.some((item) => item.name === name)).toBe(true)

  const {
    data: { data2: total },
  } = await sdk.getPaginationTokens(1, 10, {})
  expect(total).toBeGreaterThan(0)

  const {
    data: { data: token },
  } = await sdk.getToken(name)
  expect(token.name).toBe(name)

  token.code = 'Updated Code'
  const { data: updateResponse } = await sdk.updateToken(token)
  expect(updateResponse.data).toBe('Affected')

  token.scope = 'profile'
  const { data: columnsResponse } = await sdk.updateTokenForColumns(token, [
    'scope',
  ])
  expect(columnsResponse.data).toBe('Affected')

  const {
    data: { data: updated },
  } = await sdk.getToken(name)
  expect(updated.code).toBe('Updated Code')
  expect(updated.scope).toBe('profile')

  const { data: deleteResponse } = await sdk.deleteToken(token)
  expect(deleteResponse.data).toBe('Affected')

  const {
    data: { data: deleted },
  } = await sdk.getToken(name)
  expect(deleted).toBeFalsy()
})
