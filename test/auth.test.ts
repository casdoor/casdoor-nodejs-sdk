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

// the CI user "admin" of the CI application's organization (built-in) has the password "123"
const testUsername = 'admin'
const testPassword = '123'

test('TestGetOAuthTokenByPassword', async () => {
  const sdk = new SDK(testConfig)

  const token = await sdk.getOAuthTokenByPassword(testUsername, testPassword)
  expect(token.access_token).toBeTruthy()
  expect(token.refresh_token).toBeTruthy()

  await expect(
    sdk.getOAuthTokenByPassword(testUsername, 'wrong-password'),
  ).rejects.toThrow()

  const { data: introspection } = await sdk.introspectToken(
    token.access_token,
    'access_token',
  )
  expect(introspection.active).toBe(true)

  // refreshing the token revokes the old access token
  const refreshed = await sdk.refreshToken(token.refresh_token)
  expect(refreshed.access_token).toBeTruthy()
})

test('TestWithAccessToken', async () => {
  const sdk = new SDK(testConfig)
  const token = await sdk.getOAuthTokenByPassword(testUsername, testPassword)

  const userSdk = sdk.withAccessToken(token.access_token)
  const {
    data: { data: account },
  } = await userSdk.getAccount()
  expect(account.name).toBe(testUsername)

  // the original SDK still calls the APIs as the application
  const { data: appAccount } = await sdk.getAccount()
  expect(appAccount.status).toBe('error')

  const { data: logoutResponse } = await sdk.logoutCurrentSession(
    token.access_token,
  )
  expect(logoutResponse.status).toBe('ok')

  const another = await sdk.getOAuthTokenByPassword(testUsername, testPassword)
  const { data: logoutAllResponse } = await sdk.logout(another.access_token)
  expect(logoutAllResponse.status).toBe('ok')

  await expect(sdk.logout('')).rejects.toThrow()
})

test('TestUserExtra', async () => {
  const sdk = new SDK(testConfig)
  const name = util.getRandomName('user')
  const user = {
    owner: util.TestCasdoorOrganization,
    name,
    createdTime: new Date().toISOString(),
    displayName: name,
    email: `${name}@example.com`,
    phone: `202555${util.getRandomCode(4)}`,
    countryCode: 'US',
    password: '123456',
  }
  const { data: addResponse } = await sdk.addUser(user)
  expect(addResponse.data).toBe('Affected')

  const {
    data: { data: byEmail },
  } = await sdk.getUserByEmail(user.email)
  expect(byEmail.name).toBe(name)

  const {
    data: { data: byPhone },
  } = await sdk.getUserByPhone(user.phone)
  expect(byPhone.name).toBe(name)

  const {
    data: { data: byUserId },
  } = await sdk.getUserByUserId(byEmail.id as string)
  expect(byUserId.name).toBe(name)

  const {
    data: { data: users, data2: total },
  } = await sdk.getPaginationUsers(1, 100, {})
  expect(users.length).toBeGreaterThan(0)
  expect(total).toBeGreaterThan(0)

  const {
    data: { data: sorted },
  } = await sdk.getSortedUsers('created_time', 1)
  expect(sorted.length).toBe(1)

  const {
    data: { data: globalUsers },
  } = await sdk.getGlobalUsers()
  expect(globalUsers.some((item) => item.name === name)).toBe(true)

  byEmail.displayName = 'Updated by columns'
  byEmail.bio = 'should not be updated'
  const { data: columnsResponse } = await sdk.updateUserForColumns(byEmail, [
    'displayName',
  ])
  expect(columnsResponse.data).toBe('Affected')

  const {
    data: { data: updated },
  } = await sdk.getUser(name)
  expect(updated.displayName).toBe('Updated by columns')
  expect(updated.bio).toBeFalsy()

  updated.displayName = 'Updated by id'
  const { data: byIdResponse } = await sdk.updateUserById(
    `${util.TestCasdoorOrganization}/${name}`,
    updated,
  )
  expect(byIdResponse.data).toBe('Affected')

  updated.displayName = 'Updated by user id'
  const { data: byUserIdResponse } = await sdk.updateUserByUserId(
    util.TestCasdoorOrganization,
    updated.id as string,
    updated,
  )
  expect(byUserIdResponse.data).toBe('Affected')

  const { data: passwordOk } = await sdk.checkUserPassword({
    ...updated,
    password: '123456',
  })
  expect(passwordOk.status).toBe('ok')

  const { data: passwordWrong } = await sdk.checkUserPassword({
    ...updated,
    password: 'wrong-password',
  })
  expect(passwordWrong.status).toBe('error')

  const { data: deleteResponse } = await sdk.deleteUser(updated)
  expect(deleteResponse.data).toBe('Affected')
})

test('TestOwner', async () => {
  const sdk = new SDK(testConfig)
  expect(sdk.getId('role')).toBe(`${util.TestCasdoorOrganization}/role`)
  expect(sdk.getId('other/role')).toBe('other/role')

  const {
    data: { data: names },
  } = await sdk.getOrganizationNames()
  expect(names.length).toBeGreaterThan(0)

  const {
    data: { data: applications },
  } = await sdk.getOrganizationApplications()
  expect(applications.some((item) => item.name === 'app-casbin')).toBe(true)

  const {
    data: { data: certs },
  } = await sdk.getGlobalCerts()
  expect(certs.length).toBeGreaterThan(0)

  // an "owner/name" ID addresses an object of another organization
  const {
    data: { data: builtInApp },
  } = await sdk.getApplication(`admin/${util.TestCasdoorApplication}`)
  expect(builtInApp.organization).toBe('built-in')
})
