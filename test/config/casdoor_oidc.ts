export default {
  // issue endpoint
  issuer:
    process.env.TEST_CASDOOR_ISSUER ||
    'https://b4464f21-7cef-48f1-9591-4acbe1a4590e.mock.pstmn.io/.well-known/openid-configuration',
  clientId: process.env.TEST_CASDOOR_CLIENT_ID || '673c704036c6bcd04aaa',
  clientSecret:
    process.env.TEST_CASDOOR_CLIENT_SECRET ||
    '2ba9708658b3036206b9b96ee8872242d3f9e956',
}
