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

test('TestInvitation', async () => {
  const sdk = new SDK(testConfig)
  const name = util.getRandomName('invitation')
  const code = `TEST${util.getRandomCode(6)}`

  const { data: addResponse } = await sdk.addInvitation({
    owner: util.TestCasdoorOrganization,
    name,
    createdTime: new Date().toISOString(),
    displayName: 'Test Invitation',
    code,
    defaultCode: code,
    quota: 10,
    usedCount: 0,
    application: 'app-casbin',
    email: 'test@example.com',
    state: 'Active',
  })
  expect(addResponse.data).toBe('Affected')

  const {
    data: { data: invitations },
  } = await sdk.getInvitations()
  expect(invitations.some((item) => item.name === name)).toBe(true)

  const {
    data: { data: paginated, data2: total },
  } = await sdk.getPaginationInvitations(1, 100, {})
  expect(paginated.length).toBeGreaterThan(0)
  expect(total).toBeGreaterThan(0)

  const {
    data: { data: invitation },
  } = await sdk.getInvitation(name)
  expect(invitation.code).toBe(code)

  invitation.state = 'Suspended'
  const { data: updateResponse } = await sdk.updateInvitation(invitation)
  expect(updateResponse.data).toBe('Affected')

  invitation.state = 'Active'
  invitation.displayName = 'Updated Invitation'
  const { data: columnsResponse } = await sdk.updateInvitationForColumns(
    invitation,
    ['state', 'display_name'],
  )
  expect(columnsResponse.data).toBe('Affected')

  const {
    data: { data: info },
  } = await sdk.getInvitationInfo(code, 'app-casbin')
  expect(info.name).toBe(name)

  const { data: deleteResponse } = await sdk.deleteInvitation(invitation)
  expect(deleteResponse.data).toBe('Affected')

  const {
    data: { data: deleted },
  } = await sdk.getInvitation(name)
  expect(deleted).toBeFalsy()
})
