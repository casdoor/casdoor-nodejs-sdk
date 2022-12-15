# casdoor-nodejs-sdk

[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]
[![codebeat badge](https://codebeat.co/badges/4f1d141f-047a-43fe-a5d0-889fa4aaf726)](https://codebeat.co/projects/github-com-casdoor-casdoor-nodejs-sdk-master)
[![GitHub Actions](https://github.com/casdoor/casdoor-nodejs-sdk/workflows/main/badge.svg)](https://github.com/casdoor/casdoor-nodejs-sdk/actions)
[![Coverage Status](https://coveralls.io/repos/github/casdoor/casdoor-nodejs-sdk/badge.svg?branch=master)](https://coveralls.io/github/casdoor/casdoor-nodejs-sdk?branch=master)
[![Release](https://img.shields.io/github/release/casdoor/casdoor-nodejs-sdk.svg)](https://github.com/casdoor/casdoor-nodejs-sdk/releases/latest)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/casbin/casdoor)

[npm-image]: https://img.shields.io/npm/v/casdoor-nodejs-sdk.svg?style=flat-square
[npm-url]: https://npmjs.com/package/casdoor-nodejs-sdk
[download-image]: https://img.shields.io/npm/dm/casdoor-nodejs-sdk.svg?style=flat-square
[download-url]: https://npmjs.com/package/casdoor-nodejs-sdk

This is Casdoor's SDK for NodeJS will allow you to easily connect your application to the Casdoor authentication system without having to implement it from scratch.

Casdoor SDK is very simple to use. We will show you the steps below.

## Installation

```shell script
# NPM
npm i casdoor-nodejs-sdk

# Yarn
yarn add casdoor-nodejs-sdk
```

## Step1. Init SDK

Initialization requires 5 parameters, which are all string type:

| Name (in order) | Must | Description                                         |
| --------------- | ---- | --------------------------------------------------- |
| endpoint        | Yes  | Casdoor Server Url, such as `http://localhost:8000` |
| clientId        | Yes  | Client ID for the Casdoor application               |
| clientSecret    | Yes  | Client secret for the Casdoor application           |
| certificate     | Yes  | x509 certificate content of Application.cert        |
| orgName         | Yes  | The name for the Casdoor organization               |
| appName         | No   | The name for the Casdoor application                |

```typescript
import { SDK, Config } from 'casdoor-nodejs-sdk'

const authCfg: Config = {
  endpoint: '',
  clientId: '',
  clientSecret: '',
  certificate: '',
  orgName: '',
}

const sdk = new SDK(authCfg)

// call sdk to handle
```

## Step2. Get service and use

```typescript
// user
const { data: users } = await sdk.getUsers()

// auth
const token = await sdk.getAuthToken('<callback-code>')
const user = sdk.parseJwtToken(token)
```
