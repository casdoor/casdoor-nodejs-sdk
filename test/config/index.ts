import casdoor_oidc from './casdoor_oidc'

export default {
  casdoorClient: casdoor_oidc,
  testCode: process.env.TEST_AUTHORIZATION_CODE || '9d8659cbb0e4843cc40e',
  testApp: process.env.TEST_APP || 'blueprint-app',
}
