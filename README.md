# casdoor-nodejs-sdk

This is Casdoor's SDK for NodeJS will allow you to easily connect your application to the Casdoor authentication system without having to implement it from scratch.

Casdoor SDK is very simple to use. We will show you the steps below.

> Noted that this sdk has been applied to casnode, if you still don’t know how to use it after reading README.md, you can refer to it

## Step1. Init SDK

Initialization requires 5 parameters, which are all string type:

| Name (in order)  | Must | Description                                         |
| ---------------- | ---- | --------------------------------------------------- |
| Endpoint         | Yes  | Casdoor Server Url, such as `http://localhost:8000` |
| ClientId         | Yes  | your Casdoor OAuth Client ID                        |
| ClientSecret     | Yes  | your Casdoor OAuth Client Secret                    |
| JwtSecret        | No   | Same as Casdoor JWT secret.                         |
| OrganizationName | No   | Application.organization, like: "built-in"          |
| ApplicationName  | No   | Application.organization, like: "app-built-in"      |

```typescript
import { SDK, SdkConfig } from '../src/sdk'

const sdkCfg: SdkConfig = {
  Endpoint: 'http://localhost:8000',
  ClientId: 'dbd33e928e9e7cd653a4',
  ClientSecret: 'cd714093ca430c079043e4c5e3592a8663dafebb',
  JwtSecret: '23456789',
  OrganizationName: 'blueprint',
  ApplicationName: 'blueprint',
}

const sdk = new SDK(sdkCfg)

// call sdk to handle
```

## Step2. Get token and parse

After casdoor verification passed, it will be redirected to your application with code and state, like `http://forum.casbin.org?code=xxx&state=yyyy`.

Your web application can get the `code`,`state` and call `getOAuthToken(code, state)`, then parse out jwt token.

The general process is as follows:

```typescript
import { SDK, SdkConfig } from '../src/sdk'

const sdkCfg: SdkConfig = {
  Endpoint: 'http://localhost:8000',
  ClientId: 'dbd33e928e9e7cd653a4',
  ClientSecret: 'cd714093ca430c079043e4c5e3592a8663dafebb',
  JwtSecret: '23456789',
  OrganizationName: 'blueprint',
  ApplicationName: 'blueprint',
}

const sdk = new SDK(sdkCfg)

const code = 'f25c3f9bdfdb50b4af34'
const state = sdkCfg.OrganizationName
const tokenSet = await sdk.getOAuthToken(code, state)
const decodeToken = sdk.parseJwtToken(tokenSet.access_token)
```

## Test

test env parameters

| Name (in order)         | Must | Description                                         |
| ----------------------- | ---- | --------------------------------------------------- |
| SDK_ENDPOINT            | Yes  | Casdoor Server Url, such as `http://localhost:8000` |
| SDK_CLIENT_ID           | Yes  | your Casdoor OAuth Client ID                        |
| SDK_CLIENT_SECRET       | Yes  | your Casdoor OAuth Client Secret                    |
| SDK_JWT_SECRET          | No   | Same as Casdoor JWT secret.                         |
| SDK_ORGANIZATION_NAME   | No   | Application.organization, like: "built-in"          |
| SDK_APPLICATION_NAME    | No   | Application.organization, like: "app-built-in"      |
| TEST_AUTHORIZATION_CODE | Yes  | Your AUTHORIZATION CODE                             |

```bash
	npm run test
```

### TODO

- Configure github action ci/cd
- Waitting "肉食大灰兔" add OIDC ProviderMetadata, and then refactor to openid-client lib
- Add more API from [casdoor swagger docs](https://door.casbin.com/swagger/)
