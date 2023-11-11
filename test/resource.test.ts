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
import { Resource } from '../src/resource'
import * as path from 'path'
import * as fs from 'fs'

test('TestResource', async () => {
  const testConfig: Config = {
    endpoint: util.TestCasdoorEndpoint,
    clientId: util.TestClientId,
    clientSecret: util.TestClientSecret,
    certificate: util.TestJwtPublicKey,
    orgName: util.TestCasdoorOrganization,
    appName: util.TestCasdoorApplication,
  }
  const sdk = new SDK(testConfig)

  const filename = 'casbinTest.svg'
  const fullFilePath = path.join(__dirname, 'public', filename)
  const fileData = fs.createReadStream(fullFilePath)

  const resource: Resource = {
    owner: 'casbin',
    name: `/casdoor/${filename}`,
    parent: '',
    fullFilePath: filename,
  }

  const { data: uploadResponse } = await sdk.uploadResource(resource, fileData)
  if (uploadResponse.status !== 'ok') {
    throw new Error('Failed to add object')
  }

  const { data: deleteResponse } = await sdk.deleteResource(resource)
  if (deleteResponse.data !== 'Affected') {
    throw new Error('Failed to delete object')
  }
})
