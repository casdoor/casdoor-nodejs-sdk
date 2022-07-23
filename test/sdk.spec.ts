import { Config, SDK } from '../src'

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
