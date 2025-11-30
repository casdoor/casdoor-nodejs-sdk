// Copyright 2024 The Casdoor Authors. All Rights Reserved.
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
import { Model } from '../src/model'
import { Adapter } from '../src/adapter'
import { Enforcer } from '../src/enforcer'
import { Policy } from '../src/policy'
import { CasbinRequest } from '../src/enforce'

test('TestEnforce', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const modelName = util.getRandomName('enforceModel')

  // Add model
  const { data: modelAddResponse } = await sdk.addModel({
    owner: 'casbin',
    name: modelName,
    createdTime: new Date().toISOString(),
    displayName: modelName,
    modelText: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act`,
  } as Model)

  if (modelAddResponse.data !== 'Affected') {
    throw new Error('Failed to add model')
  }

  // Add adapter
  const adapterName = util.getRandomName('enforceAdapter')
  const { data: adapterAddResponse } = await sdk.addAdapter({
    owner: 'casbin',
    name: adapterName,
    createdTime: new Date().toISOString(),
    table: adapterName + '_policy',
    useSameDb: true,
    host: '',
    user: '',
  } as Adapter)

  if (adapterAddResponse.data !== 'Affected') {
    throw new Error('Failed to add adapter')
  }

  // Add enforcer
  const enforcerId = util.getRandomName('enforceEnforcer')
  const enforcer: Enforcer = {
    owner: 'casbin',
    name: enforcerId,
    createdTime: new Date().toISOString(),
    displayName: enforcerId,
    model: 'casbin/' + modelName,
    adapter: 'casbin/' + adapterName,
    description: '',
  }

  const { data: enforcerAddResponse } = await sdk.addEnforcer(enforcer)
  if (enforcerAddResponse.data !== 'Affected') {
    throw new Error('Failed to add enforcer')
  }

  // Add policies
  const { data: policy1AddResponse } = await sdk.addPolicy(enforcer, {
    Id: 0,
    Ptype: 'p',
    V0: 'alice',
    V1: 'data1',
    V2: 'read',
  } as Policy)
  if (policy1AddResponse.data !== 'Affected') {
    throw new Error('Failed to add policy')
  }

  const { data: policy2AddResponse } = await sdk.addPolicy(enforcer, {
    Id: 0,
    Ptype: 'p',
    V0: 'bob',
    V1: 'data2',
    V2: 'write',
  } as Policy)
  if (policy2AddResponse.data !== 'Affected') {
    throw new Error('Failed to add policy')
  }

  // Test enforce
  const req1: CasbinRequest = ['alice', 'data1', 'read']
  const res = await sdk.enforce('', '', '', 'casbin/' + enforcerId, '', req1)
  if (!res) {
    throw new Error('Enforce fail')
  }

  const req2: CasbinRequest = ['bob', 'data2', 'write']
  const res2 = await sdk.enforce('', '', '', 'casbin/' + enforcerId, '', req2)
  if (!res2) {
    throw new Error('Enforce fail')
  }

  const reqFail: CasbinRequest = ['alice', 'data1', 'write']
  const resFail = await sdk.enforce(
    '',
    '',
    '',
    'casbin/' + enforcerId,
    '',
    reqFail,
  )
  if (resFail) {
    throw new Error('Enforce test fail')
  }

  // Test batch enforce
  const resBatch = await sdk.batchEnforce(
    '',
    '',
    '',
    'casbin/' + enforcerId,
    '',
    [req1, reqFail],
  )
  if (!resBatch[0][0]) {
    throw new Error('BatchEnforce test fail')
  }
  if (resBatch[0][1]) {
    throw new Error('BatchEnforce test fail')
  }
})
