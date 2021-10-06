import { SDK } from '../src/sdk'
import { strict as assert } from 'assert'
import testConfig from './config'

describe('Casdoor-Nodejs-SDK', () => {
  let sdk: SDK
  it('discover should be run ok', async () => {
    sdk = new SDK(testConfig.casdoorClient)
    await sdk.init()
    const tokenSet = await sdk.callback({
      code: testConfig.testCode,
      state: testConfig.testApp,
    })
    assert.deepStrictEqual(Object.keys(tokenSet), [
      'access_token',
      'token_type',
      'expires_at',
      'scope',
    ])

    const parseToken = sdk.parseJwtToken(tokenSet.access_token || '')
    assert.deepStrictEqual(parseToken?.signupApplication, testConfig.testApp)
    assert.deepStrictEqual(true, !!parseToken.id)
    assert.deepStrictEqual('', parseToken?.password)
  })
})
