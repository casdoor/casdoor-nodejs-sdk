import { SDK, SdkConfig } from '../src'

const sdkCfg: SdkConfig = {
  endpoint: process.env.SDK_ENDPOINT || 'http://localhost:8000', // your Casdoor URL, like the official one: https://door.casbin.com
  clientId: process.env.SDK_CLIENT_ID || 'dbd33e928e9e7cd653a4', // your Casdoor OAuth Client ID
  clientSecret:
    process.env.SDK_CLIENT_SECRET || 'cd714093ca430c079043e4c5e3592a8663dafebb', // your Casdoor OAuth Client Secret
  jwtSecret: process.env.SDK_JWT_SECRET || '23456789', // jwt secret
  organizationName: process.env.SDK_ORGANIZATION_NAME || 'blueprint', // your Casdoor organization name, like: "built-in"
  applicationName: process.env.SDK_APPLICATION_NAME || 'blueprint', // your Casdoor application name, like: "app-built-in"
}

const TestAuthorizationCode =
  process.env.TEST_AUTHORIZATION_CODE || 'f25c3f9bdfdb50b4af34'

describe('Casdoor-Nodejs-SDK', () => {
  let sdk: SDK
  it('init SDK ok', () => {
    sdk = new SDK(sdkCfg)
    expect(sdk).toBeDefined()
  })

  it('getOAuthToken should be run ok', async () => {
    const code = TestAuthorizationCode
    const state = sdkCfg.clientId
    const result = await sdk.getOAuthToken(code, state)

    expect(result).toBeDefined()
    expect(result.access_token).toBeDefined()
    expect(result.expires_at).toBeDefined()
    expect(typeof result.expires_in).toBe('number')
    expect(result.scope).toBeDefined()
    expect(result.token_type).toEqual('Bearer')
  })

  it('parseJwtToken should be run ok', async () => {
    const tokenSet = {
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6ImJsdWVwcmludCIsIm5hbWUiOiJ6aG9uZ2ppeGl1eGluZyIsImNyZWF0ZWRUaW1lIjoiMjAyMS0wOS0yMFQwOTozMDozNloiLCJ1cGRhdGVkVGltZSI6IiIsImlkIjoiZTE5ZDVmMzYtMWRjZC00ZGZmLTk0ZjMtNzk3MDg0OTM2MDBjIiwidHlwZSI6Im5vcm1hbC11c2VyIiwicGFzc3dvcmQiOiIiLCJkaXNwbGF5TmFtZSI6ImFueGluZyIsImF2YXRhciI6Imh0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS84OTM1MjM1P3Y9NCIsInBlcm1hbmVudEF2YXRhciI6IiIsImVtYWlsIjoiMTk2NTE5ODI3MkBxcS5jb20iLCJwaG9uZSI6IiIsImxvY2F0aW9uIjoiIiwiYWRkcmVzcyI6W10sImFmZmlsaWF0aW9uIjoiIiwidGl0bGUiOiIiLCJob21lcGFnZSI6IiIsImJpbyI6IiIsInRhZyI6IiIsInJlZ2lvbiI6IiIsImxhbmd1YWdlIjoiIiwic2NvcmUiOjIwMDAsInJhbmtpbmciOjAsImlzT25saW5lIjpmYWxzZSwiaXNBZG1pbiI6ZmFsc2UsImlzR2xvYmFsQWRtaW4iOmZhbHNlLCJpc0ZvcmJpZGRlbiI6ZmFsc2UsInNpZ251cEFwcGxpY2F0aW9uIjoiYmx1ZXByaW50IiwiaGFzaCI6ImIwYjA5YTEwM2U4ODljOTQwNzg3MDMzNGNmMzU3ZGRmIiwicHJlSGFzaCI6ImIwYjA5YTEwM2U4ODljOTQwNzg3MDMzNGNmMzU3ZGRmIiwiZ2l0aHViIjoiODkzNTIzNSIsImdvb2dsZSI6IiIsInFxIjoiIiwid2VjaGF0IjoiIiwiZmFjZWJvb2siOiIiLCJkaW5ndGFsayI6IiIsIndlaWJvIjoiIiwiZ2l0ZWUiOiIiLCJsaW5rZWRpbiI6IiIsIndlY29tIjoiIiwibGFyayI6IiIsImdpdGxhYiI6IiIsImxkYXAiOiIiLCJwcm9wZXJ0aWVzIjp7Im5vIjoiMiIsIm9hdXRoX0dpdEh1Yl9hdmF0YXJVcmwiOiJodHRwczovL2F2YXRhcnMuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvODkzNTIzNT92PTQiLCJvYXV0aF9HaXRIdWJfZGlzcGxheU5hbWUiOiJhbnhpbmciLCJvYXV0aF9HaXRIdWJfZW1haWwiOiIxOTY1MTk4MjcyQHFxLmNvbSIsIm9hdXRoX0dpdEh1Yl9pZCI6Ijg5MzUyMzUiLCJvYXV0aF9HaXRIdWJfdXNlcm5hbWUiOiJ6aG9uZ2ppeGl1eGluZyJ9LCJhdWQiOiJkYmQzM2U5MjhlOWU3Y2Q2NTNhNCIsImV4cCI6MTYzMjgxMTQwMSwiaWF0IjoxNjMyMjA2NjAxLCJpc3MiOiJjYXNkb29yIiwibmJmIjoxNjMyMjA2NjAxLCJzdWIiOiJlMTlkNWYzNi0xZGNkLTRkZmYtOTRmMy03OTcwODQ5MzYwMGMifQ.v4yVLy0iK0bAYe_URJ1VP0eO_AUV_OmkG6rKNudagSo',
      token_type: 'Bearer',
      expires_in: 10080,
      scope: 'read',
      expires_at: {},
    }

    const decodeValue = sdk.parseJwtToken(tokenSet.access_token)
    expect(decodeValue).toBeDefined()
    expect(typeof decodeValue?.name).toBe('string')
  })
})
