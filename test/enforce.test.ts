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

  // Add a new model
  const model: Model = {
    owner: 'casbin',
    name: modelName,
    displayName: modelName,
    modelText: `[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act

[policy_effect]
e = some(where (p.eft == allow))

[matchers]
m = r.sub == p.sub && r.obj == p.obj && r.act == p.act`,
  }

  const { data: addModelResponse } = await sdk.addModel(model)
  if (addModelResponse.data !== 'Affected') {
    throw new Error('Failed to add model')
  }

  const adapterName = util.getRandomName('enforceAdapter')
  const adapter: Adapter = {
    owner: 'casbin',
    name: adapterName,
    table: adapterName + '_policy',
    useSameDb: true,
  }

  const { data: addAdapterResponse } = await sdk.addAdapter(adapter)
  if (addAdapterResponse.data !== 'Affected') {
    throw new Error('Failed to add adapter')
  }

  const enforcerId = util.getRandomName('enforceEnforcer')
  const enforcer: Enforcer = {
    owner: 'casbin',
    name: enforcerId,
    displayName: enforcerId,
    model: 'casbin/' + modelName,
    adapter: 'casbin/' + adapterName,
  }

  const { data: addEnforcerResponse } = await sdk.addEnforcer(enforcer)
  if (addEnforcerResponse.data !== 'Affected') {
    throw new Error('Failed to add enforcer')
  }

  // Add policies
  const policy1: Policy = {
    ptype: 'p',
    v0: 'alice',
    v1: 'data1',
    v2: 'read',
  }

  const { data: addPolicy1Response } = await sdk.addPolicy(enforcer, policy1)
  if (addPolicy1Response.data !== 'Affected') {
    throw new Error('Failed to add policy')
  }

  const policy2: Policy = {
    ptype: 'p',
    v0: 'bob',
    v1: 'data2',
    v2: 'write',
  }

  const { data: addPolicy2Response } = await sdk.addPolicy(enforcer, policy2)
  if (addPolicy2Response.data !== 'Affected') {
    throw new Error('Failed to add policy')
  }

  // Test enforce
  const req1 = ['alice', 'data1', 'read']
  const res1 = await sdk.enforce('', '', '', 'casbin/' + enforcerId, '', req1)
  if (!res1) {
    throw new Error('Enforce test 1 failed')
  }

  const req2 = ['bob', 'data2', 'write']
  const res2 = await sdk.enforce('', '', '', 'casbin/' + enforcerId, '', req2)
  if (!res2) {
    throw new Error('Enforce test 2 failed')
  }

  const reqFail = ['alice', 'data1', 'write']
  const resFail = await sdk.enforce(
    '',
    '',
    '',
    'casbin/' + enforcerId,
    '',
    reqFail,
  )
  if (resFail) {
    throw new Error('Enforce test should have failed')
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
    throw new Error('BatchEnforce test 1 failed')
  }
  if (resBatch[0][1]) {
    throw new Error('BatchEnforce test 2 should have failed')
  }

  // Cleanup
  await sdk.deleteEnforcer(enforcer)
  await sdk.deleteAdapter(adapter)
  await sdk.deleteModel(model)
})
