// Copyright 2021 The casbin Authors. All Rights Reserved.
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
import { Config } from '../src/config'

const testConfig: Config = {
  endpoint: '',
  clientId: '',
  clientSecret: '',
  certificate: ``,
  orgName: 'built-in',
}

const sdk = new SDK(testConfig)

// uncomment to run tests
describe('Casdoor Nodejs SDK test', () => {
  it('should be defined', () => {
    expect(sdk).toBeDefined()
  })

  // it('getUsers test', async () => {
  //   const { data: users } = await sdk.getUsers()
  //   // print the users
  //   expect(users.length).toBeGreaterThan(0)
  // })

  // it('get auth token', async () => {
  //   const token = await sdk.getAuthToken('abcc6a964417992c003c')
  //   const user = sdk.parseJwtToken(token)
  //   expect(user).toBeTruthy()
  // })
})
