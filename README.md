# casdoor-nodejs-sdk

This is Casdoor's SDK for NodeJS will allow you to easily connect your application to the Casdoor authentication system without having to implement it from scratch.

Casdoor SDK is very simple to use. We will show you the steps below.

> Noted that this sdk has been applied to casnode, if you still don’t know how to use it after reading README.md, you can refer to it

## Installation

```shell script
# NPM
npm i casdoor-nodejs-sdk

# Yarn
yarn add casdoor-nodejs-sdk
```

## Step1. Init SDK

Initialization requires 5 parameters, which are all string type:

| Name (in order)  | Must | Description                                         |
| ---------------- | ---- | --------------------------------------------------- |
| issuer           | Yes  | casdoor OIDC Issuer endpoint |
| clientId         | Yes  | your Casdoor OAuth Client ID                        |
| clientSecret     | Yes  | your Casdoor OAuth Client Secret                    |
| casdoorEndpoint  | No  | your Casdoor API endpoint                   |


```typescript
import { SDK, AuthConfig } from 'casdoor-nodejs-sdk'

const authCfg: AuthConfig = {
  issuer: 'https://b4464f21-7cef-48f1-9591-4acbe1a4590e.mock.pstmn.io/.well-known/openid-configuration',
  clientId: '673c704036c6bcd04aaa',
  clientSecret: '2ba9708658b3036206b9b96ee8872242d3f9e956',
  casdoorEndpoint: 'http://casdoor.anxing.io'
}

const sdk = new SDK(authCfg)

// call sdk to handle
```

## Step2. Get token and parse

After casdoor verification passed, it will be redirected to your application with code and state, like `http://forum.casbin.org?code=xxx&state=yyyy`.

Your web application can get the `code`,`state` and call `getOAuthToken(code, state)`, then parse out jwt token.

The general process is as follows:

```typescript
import { SDK, AuthConfig } from 'casdoor-nodejs-sdk'

const authCfg: AuthConfig = {
  issuer: 'https://b4464f21-7cef-48f1-9591-4acbe1a4590e.mock.pstmn.io/.well-known/openid-configuration',
  clientId: '673c704036c6bcd04aaa',
  clientSecret: '2ba9708658b3036206b9b96ee8872242d3f9e956',
  casdoorEndpoint: 'http://casdoor.anxing.io'
}

const sdk = new SDK(authCfg)

const tokenSet = await sdk.callback({
  code: 'your authorization code',
  state: 'your casdoor application name'
})
const parseToken = sdk.parseJwtToken(tokenSet.access_token || '')
```

## Test

test env parameters

| Name (in order)         | Must | Description                                         |
| ----------------------- | ---- | --------------------------------------------------- |
| TEST_CASDOOR_ISSUER     | Yes  | Casdoor OIDC Issuer endpoint                        |
| TEST_CASDOOR_CLIENT_ID           | Yes  | your Casdoor OAuth Client ID               |
| TEST_CASDOOR_CLIENT_SECRET       | Yes  | your Casdoor OAuth Client Secret           |
| TEST_AUTHORIZATION_CODE          | No   | Test Authorization code                         |
| TEST_APP                         | No   | Application.app, like: "built-in"          |
| TEST_TEST_ORGANIZATION           | No   | Application.organization, like: "built-in"          |

```bash
	npm run test
```
