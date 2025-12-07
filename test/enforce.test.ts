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
import { Enforcer } from '../src/enforcer'
import { Model } from '../src/model'
import { Adapter } from '../src/adapter'
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
  const adapterName = util.getRandomName('enforceAdapter')
  const enforcerName = util.getRandomName('enforceEnforcer')

  // Add a model
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

  // Add an adapter
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

  // Add an enforcer
  const enforcer: Enforcer = {
    owner: 'casbin',
    name: enforcerName,
    displayName: enforcerName,
    model: 'casbin/' + modelName,
    adapter: 'casbin/' + adapterName,
  }

  const { data: addEnforcerResponse } = await sdk.addEnforcer(enforcer)
  if (addEnforcerResponse.data !== 'Affected') {
    throw new Error('Failed to add enforcer')
  }

  // Add policies
  const policy1: Policy = {
    Id: 0,
    Ptype: 'p',
    V0: 'alice',
    V1: 'data1',
    V2: 'read',
  }

  const { data: addPolicy1Response } = await sdk.addPolicy(enforcer, policy1)
  if (addPolicy1Response.data !== 'Affected') {
    throw new Error('Failed to add policy1')
  }

  const policy2: Policy = {
    Id: 0,
    Ptype: 'p',
    V0: 'bob',
    V1: 'data2',
    V2: 'write',
  }

  const { data: addPolicy2Response } = await sdk.addPolicy(enforcer, policy2)
  if (addPolicy2Response.data !== 'Affected') {
    throw new Error('Failed to add policy2')
  }

  // Test enforce - alice should be able to read data1
  const req1 = ['alice', 'data1', 'read']
  const res1 = await sdk.enforce('', '', '', 'casbin/' + enforcerName, '', req1)
  if (!res1) {
    throw new Error('Enforce fail: alice should be able to read data1')
  }

  // Test enforce - bob should be able to write data2
  const req2 = ['bob', 'data2', 'write']
  const res2 = await sdk.enforce('', '', '', 'casbin/' + enforcerName, '', req2)
  if (!res2) {
    throw new Error('Enforce fail: bob should be able to write data2')
  }

  // Test enforce - alice should NOT be able to write data1
  const reqFail = ['alice', 'data1', 'write']
  const resFail = await sdk.enforce(
    '',
    '',
    '',
    'casbin/' + enforcerName,
    '',
    reqFail,
  )
  if (resFail) {
    throw new Error(
      'Enforce test fail: alice should NOT be able to write data1',
    )
  }

  // Test batch enforce
  const resBatch = await sdk.batchEnforce(
    '',
    '',
    '',
    'casbin/' + enforcerName,
    '',
    [req1, reqFail],
  )
  if (!resBatch[0][0]) {
    throw new Error('BatchEnforce test fail: first request should be allowed')
  }
  if (resBatch[0][1]) {
    throw new Error('BatchEnforce test fail: second request should be denied')
  }

  // Cleanup: delete enforcer, adapter, and model
  const { data: deleteEnforcerResponse } = await sdk.deleteEnforcer(enforcer)
  if (deleteEnforcerResponse.data !== 'Affected') {
    throw new Error('Failed to delete enforcer')
  }

  const { data: deleteAdapterResponse } = await sdk.deleteAdapter(adapter)
  if (deleteAdapterResponse.data !== 'Affected') {
    throw new Error('Failed to delete adapter')
  }

  const { data: deleteModelResponse } = await sdk.deleteModel(model)
  if (deleteModelResponse.data !== 'Affected') {
    throw new Error('Failed to delete model')
  }
})
