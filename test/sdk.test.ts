// TODO: add integration tests

test('Hello world', () => {
  console.log('Hello world')
})

// import { SDK } from '../src'
// import { strict as assert } from 'assert'
// import testConfig from './config'
//
// describe('Casdoor-Nodejs-SDK', () => {
//   it('discover should be run ok', async () => {
//     const sdk = new SDK(testConfig.casdoorClient)
//     await sdk.init()
//     const tokenSet = await sdk.callback({
//       code: testConfig.testCode,
//       state: testConfig.testApp,
//     })
//     assert.deepStrictEqual(Object.keys(tokenSet), [
//       'access_token',
//       'token_type',
//       'expires_at',
//       'scope',
//     ])
//
//     const parseToken = sdk.parseJwtToken(tokenSet.access_token || '')
//     assert.deepStrictEqual(parseToken?.signupApplication, testConfig.testApp)
//     assert.deepStrictEqual(true, !!parseToken.id)
//     assert.deepStrictEqual('', parseToken?.password)
//   })
//
//   it('getUsers should be run ok', async () => {
//     const sdk = new SDK(testConfig.casdoorClient)
//     const response = await sdk.getUsers({ owner: testConfig.testOrganization })
//
//     assert.deepStrictEqual(true, response.data.length > 0)
//     assert.deepStrictEqual(testConfig.testOrganization, response.data[0].owner)
//   })
// })
