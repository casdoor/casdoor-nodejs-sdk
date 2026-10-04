# Casdoor Node.js SDK

<p align="center">
  <a href="#badge">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a>
  <a href="https://github.com/casdoor/casdoor-nodejs-sdk/actions/workflows/semantic-release.yml">
    <img alt="GitHub Workflow Status (branch)" src="https://img.shields.io/github/actions/workflow/status/casdoor/casdoor-nodejs-sdk/semantic-release.yml?branch=master">
  </a>
  <a href="https://github.com/casdoor/casdoor-nodejs-sdk/releases/latest">
    <img alt="GitHub Release" src="https://img.shields.io/github/v/release/casdoor/casdoor-nodejs-sdk.svg">
  </a>
  <a href="https://www.npmjs.com/package/casdoor-nodejs-sdk">
    <img alt="NPM version" src="https://img.shields.io/npm/v/casdoor-nodejs-sdk.svg">
  </a>
  <a href="https://www.npmjs.com/package/casdoor-nodejs-sdk">
    <img alt="NPM downloads" src="https://img.shields.io/npm/dm/casdoor-nodejs-sdk.svg">
  </a>
</p>

<p align="center">
  <a href="https://github.com/casdoor/casdoor-nodejs-sdk/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/casdoor/casdoor-nodejs-sdk?style=flat-square" alt="license">
  </a>
  <a href="https://github.com/casdoor/casdoor-nodejs-sdk/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/casdoor/casdoor-nodejs-sdk?style=flat-square">
  </a>
  <a href="#">
    <img alt="GitHub stars" src="https://img.shields.io/github/stars/casdoor/casdoor-nodejs-sdk?style=flat-square">
  </a>
  <a href="https://github.com/casdoor/casdoor-nodejs-sdk/network">
    <img alt="GitHub forks" src="https://img.shields.io/github/forks/casdoor/casdoor-nodejs-sdk?style=flat-square">
  </a>
  <a href="https://discord.gg/5rPsrAzK7S">
    <img alt="Casdoor" src="https://img.shields.io/discord/1022748306096537660?style=flat-square&logo=discord&label=discord&color=5865F2">
  </a>
</p>

Casdoor Node.js SDK is the official Node.js client library for [Casdoor](https://casdoor.ai/), written in TypeScript. It lets your Node.js backend sign users in with Casdoor (OAuth 2.0 / OIDC), verify the JWT tokens issued by Casdoor, and manage users, organizations, applications, roles, permissions and all the other Casdoor objects through the Casdoor APIs.

The SDK has the same features as [casdoor-go-sdk](https://github.com/casdoor/casdoor-go-sdk).

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#️-configuration)
- [Authentication](#-authentication)
- [Resource Management](#-resource-management)
- [API Reference](#-api-reference)
- [Examples](#-examples)
- [Development](#-development)
- [Documentation](#-documentation)
- [License](#-license)

## ✨ Features

- **OAuth 2.0 Authentication**: authorization code, password and refresh token grants, token introspection, SSO logout
- **JWT Verification**: verify the tokens signed by Casdoor (RS256, RS512, ES256, ES384, ES512)
- **Calling APIs as the User**: `withAccessToken()` calls the APIs with the user's own permissions
- **User Management**: CRUD, lookup by email / phone / user ID, pagination, password check and change
- **Organization & Application Management**: organizations, applications, groups, certificates, providers, LDAP
- **Authorization**: roles, permissions, models, adapters, enforcers, policies, `enforce()` and `batchEnforce()`
- **Billing**: products, orders, payments, plans, pricings, subscriptions and transactions
- **Messaging**: send emails, SMS and notifications
- **Multi-Factor Authentication (MFA)**: TOTP, email and SMS MFA setup
- **Other Objects**: sessions, tokens, webhooks, syncers, invitations, resources (file upload) and records
- **TypeScript**: typings for all the objects and API responses, ESM and CommonJS builds

## 📦 Installation

```bash
# npm
npm install casdoor-nodejs-sdk

# yarn
yarn add casdoor-nodejs-sdk
```

## 🚀 Quick Start

```typescript
import { SDK, Config } from 'casdoor-nodejs-sdk'

const config: Config = {
  endpoint: 'http://localhost:8000',
  clientId: '<client-id>',
  clientSecret: '<client-secret>',
  certificate: '<x509 certificate of the application>',
  orgName: 'my-organization',
  appName: 'my-application',
}

const sdk = new SDK(config)

// Get all users of the organization
const { data: response } = await sdk.getUsers()
console.log(`Found ${response.data.length} users`)
```

## ⚙️ Configuration

### Configuration Parameters

| Parameter    | Required | Description                                                                                                  |
|--------------|----------|--------------------------------------------------------------------------------------------------------------|
| endpoint     | Yes      | Casdoor server URL, such as `http://localhost:8000`                                                          |
| clientId     | Yes      | Client ID of the Casdoor application                                                                         |
| clientSecret | Yes      | Client secret of the Casdoor application                                                                     |
| certificate  | Yes      | x509 certificate (PEM) of the application's cert, used to verify JWT tokens                                  |
| orgName      | Yes      | Name of the Casdoor organization                                                                             |
| appName      | No       | Name of the Casdoor application                                                                              |
| algorithms   | No       | JWT signing algorithms accepted by `parseJwtToken()`, defaults to `['RS256', 'RS512', 'ES256', 'ES384', 'ES512']` |

### Getting the Configuration from Casdoor

1. **endpoint**: the URL of your Casdoor server
2. **clientId** and **clientSecret**: the application's edit page in the Casdoor admin panel
3. **certificate**: the certificate of the cert selected in the application's "Cert" field (Certs page → the cert → "Certificate")
4. **orgName**: the organization that owns your users
5. **appName**: the name of your application

### Customizing the HTTP Client

The second parameter of `new SDK()` is an [axios request config](https://axios-http.com/docs/req_config). Use it to set a timeout, a proxy, custom headers (e.g. `Accept-Language` for localized error messages) or a self-signed CA:

```typescript
import https from 'node:https'
import type { AxiosRequestConfig } from 'axios'

const axiosConfig: AxiosRequestConfig = {
  timeout: 30000,
  headers: {
    'Accept-Language': 'de',
    'X-Trace-ID': 'trace-abc-123',
  },
  httpsAgent: new https.Agent({ ca: '<self-signed CA>' }),
}

const sdk = new SDK(config, axiosConfig)
```

The `Authorization` header is always managed by the SDK.

### Responses

The API methods return the [axios response](https://axios-http.com/docs/res_schema), whose `data` is the JSON body returned by Casdoor (`CasdoorResponse`):

```typescript
const { data: response } = await sdk.getUser('alice')
// response.status: 'ok' or 'error'
// response.msg:    the error message when status is 'error'
// response.data:   the user, or null when it doesn't exist
// response.data2:  the total count for the pagination APIs
```

`add*()`, `update*()` and `delete*()` return `data: 'Affected'` when the object is changed.

## 🔐 Authentication

### OAuth 2.0 Flow

#### Step 1: Redirect the User to Casdoor

```typescript
const signinUrl = sdk.getSignInUrl('http://localhost:8080/callback')
// http://localhost:8000/login/oauth/authorize?client_id=...&response_type=code&redirect_uri=...&scope=read&state=my-application
```

`getSignUpUrl(enablePassword, redirectUri)`, `getUserProfileUrl(userName, accessToken?)` and `getMyProfileUrl(accessToken?)` build the other Casdoor pages' URLs.

#### Step 2: Handle the Callback

Casdoor redirects back to your application with `code` and `state`. Exchange the code for the tokens and verify the access token:

```typescript
const token = await sdk.getAuthToken(code)
// token.access_token, token.refresh_token

const user = sdk.parseJwtToken(token.access_token)
console.log(user.name, user.email, user.owner)
```

`parseJwtToken()` verifies the signature and the expiration of the token with the certificate, and throws an error when the token is invalid.

### Password Grant and Impersonation

```typescript
// Resource Owner Password Credentials grant, the application must enable the "Password" grant type
const token = await sdk.getOAuthTokenByPassword('alice', 'password')

// Sign in as any user of the organization with the organization's master password
const token2 = await sdk.impersonateUser('alice', '<master password>')
```

### Token Refresh and Introspection

```typescript
const newToken = await sdk.refreshToken(token.refresh_token)

const { data: introspection } = await sdk.introspectToken(token.access_token, 'access_token')
console.log(introspection.active)
```

### Calling APIs With the User's Access Token

By default, the SDK calls the Casdoor APIs as the application itself: it authenticates with the client ID and client secret, so the calls have the application's (admin) permissions.

To call the APIs on behalf of the signed-in user instead, use `withAccessToken()` with the access token returned by `getAuthToken()`. It returns a new SDK that sends the `Authorization: Bearer <access_token>` header, so Casdoor treats the requests as being made by that user and the user's own permissions apply:

```typescript
const token = await sdk.getAuthToken(code)

// An SDK that acts as the user who owns the access token
const userSdk = sdk.withAccessToken(token.access_token)

// "Who am I"
const { data: account } = await userSdk.getAccount()

// Any other API can be called in the same way
const { data: users } = await userSdk.getUsers()
```

The original SDK is not changed, so it's safe to create one such SDK per incoming HTTP request.

**Note**: a non-admin user can only access their own data. If an API returns a permission error, the user simply isn't allowed to call it — use the application's SDK (without `withAccessToken()`) for admin operations.

### Logout

```typescript
// Sign the user out of all the applications and devices (SSO logout)
await sdk.logout(accessToken)

// Only sign out the session of this access token
await sdk.logoutCurrentSession(accessToken)
```

## 📦 Resource Management

### Object Owner

Every object in Casdoor is identified by an ID of the form `owner/name`, where the owner is an organization (`role`, `group`, `user`, `product`, `ldap`, ...) or the built-in `admin` owner (`organization`, `application`, `token`).

By default the SDK fills in the owner for you: the `orgName` of the config, or `admin` for the object types listed above. You can address an object in another organization by passing a qualified `owner/name` ID instead of a plain name, and by setting the `owner` field explicitly when creating or updating an object:

```typescript
// Uses the SDK's organization: "my-organization/my-role"
await sdk.getRole('my-role')

// Uses the owner given in the name: "other-org/my-role"
await sdk.getRole('other-org/my-role')

// Created in "other-org" instead of the SDK's organization
await sdk.addRole({ owner: 'other-org', name: 'my-role', createdTime: '', displayName: '', description: '' })
```

> [!IMPORTANT]
> **Behavior change:** `add*()`, `update*()` and `delete*()` used to overwrite the `owner` field of the object with the SDK's organization (or `admin`), and to ignore any owner set by the caller. They now only fill `owner` in when it is empty. If your code sets `owner` to a value other than the SDK's organization (for example the literal `'admin'`), the request is now sent to that owner instead of being silently redirected, so clear the field or set it to the intended organization.

### Method Patterns

Most objects have the same methods:

- `get{Object}s()` - get all the objects of the organization
- `getPagination{Object}s(p, pageSize, queryMap)` - get a page of the objects, `data2` is the total count. `queryMap` can filter and sort, e.g. `{ field: 'name', value: 'abc', sortField: 'createdTime', sortOrder: 'descend' }`
- `get{Object}(name)` - get an object by name (or `owner/name` ID)
- `add{Object}(object)` - create an object
- `update{Object}(object)` - update an object
- `update{Object}ForColumns(object, columns)` - only update the given columns (users, roles, permissions, sessions, tokens, invitations)
- `delete{Object}(object)` - delete an object

### User Management

```typescript
const { data: users } = await sdk.getUsers()
const { data: page } = await sdk.getPaginationUsers(1, 10, {})
const { data: user } = await sdk.getUser('alice')
await sdk.getUserByEmail('alice@example.com')
await sdk.getUserByPhone('2025550123')
await sdk.getUserByUserId('<user id>')
await sdk.getSortedUsers('created_time', 10)
await sdk.getGlobalUsers() // users of all organizations
await sdk.getUserCount(true) // online users

await sdk.addUser({ owner: 'my-organization', name: 'alice', createdTime: new Date().toISOString(), password: '123456' })
await sdk.updateUser(user.data)
await sdk.updateUserForColumns(user.data, ['displayName', 'email'])
await sdk.updateUserById('my-organization/alice', user.data)
await sdk.updateUserByUserId('my-organization', '<user id>', user.data)
await sdk.deleteUser(user.data)

// Check and change the password
const { data: check } = await sdk.checkUserPassword({ ...user.data, password: '123456' }) // check.status === 'ok'
await sdk.setPassword({ owner: 'my-organization', name: 'alice', oldPassword: '123456', newPassword: '654321' })
```

### Organizations and Applications

```typescript
await sdk.getOrganizations()
await sdk.getOrganization('my-organization')
await sdk.getOrganizationNames()
await sdk.getApplications()
await sdk.getApplication('my-application')
await sdk.getOrganizationApplications() // applications of the SDK's organization
```

### Roles, Permissions and Enforcement

```typescript
await sdk.addRole({ owner: 'my-organization', name: 'admin', createdTime: '', displayName: 'Administrator', description: '', users: ['my-organization/alice'], isEnabled: true })
await sdk.getPermissionsByRole('admin')
await sdk.addPermission({
  owner: 'my-organization',
  name: 'read-data',
  users: ['my-organization/alice'],
  resources: ['data1'],
  actions: ['read'],
  effect: 'Allow',
  isEnabled: true,
  model: 'user-model-built-in',
  resourceType: 'Application',
})

// Check a request against a permission (or modelId / resourceId / enforcerId / owner)
const { data: allowed } = await sdk.enforce('my-organization/read-data', '', '', '', '', ['my-organization/alice', 'data1', 'read'])
const { data: results } = await sdk.batchEnforce('my-organization/read-data', '', '', '', '', [
  ['my-organization/alice', 'data1', 'read'],
  ['my-organization/bob', 'data1', 'read'],
])
```

### Enforcers and Policies

```typescript
const { data: enforcer } = await sdk.getEnforcer('my-enforcer')
await sdk.getPolicies('my-enforcer')
await sdk.getFilteredPolicies('my-organization/my-enforcer', [{ ptype: 'p', fieldIndex: 0, fieldValues: ['alice'] }])
await sdk.addPolicy(enforcer.data, { Id: 0, Ptype: 'p', V0: 'alice', V1: 'data1', V2: 'read' })
await sdk.updatePolicy(enforcer.data, oldPolicy, newPolicy)
await sdk.removePolicy(enforcer.data, policy)
```

### Billing: Products, Orders, Payments and Transactions

```typescript
// Place an order of products for a user and pay it with a payment provider
const { data: order } = await sdk.placeOrder([{ name: 'my-product', quantity: 1 }], 'alice')
const { data: payment } = await sdk.payOrder(order.data.name, 'my-payment-provider')
await sdk.cancelOrder(order.data.name)

await sdk.getUserOrders('alice')
await sdk.getUserPayments('alice')
await sdk.getUserTransactions('alice')

// Validate a transaction (e.g. the balance) without saving it
await sdk.addTransactionWithDryRun(transaction, true)
const { data: added } = await sdk.addTransaction(transaction) // added.data is the transaction name
```

### Email, SMS and Notifications

```typescript
await sdk.sendEmail({ title: 'Hello', content: 'Hello world', sender: 'Casdoor', receivers: ['alice@example.com'] })
await sdk.sendEmailByProvider(email, 'my-email-provider')
await sdk.sendSms({ content: '123456', receivers: ['+12025550123'] })
await sdk.sendSmsByProvider(sms, 'my-sms-provider')
await sdk.sendNotification({ content: 'Hello', recipient: 'alice' })
```

### Resources (File Upload)

```typescript
import fs from 'node:fs'

const file = fs.createReadStream('avatar.png')
const { data: uploaded } = await sdk.uploadResourceEx('alice', 'avatar', 'user', '/avatar/alice.png', file)
// uploaded.data is the file URL, uploaded.data2 is the resource name

await sdk.getResources('my-organization', 'alice', '', '', '', '')
await sdk.getPaginationResources('my-organization', 'alice', '', '', 10, 1, '', '')
await sdk.deleteResourceWithTag(resource, 'Direct')
```

### LDAP

```typescript
await sdk.getLdaps()
const { data: ldapUsers } = await sdk.getLdapUsers('<ldap id>')
await sdk.syncLdapUsers('<ldap id>', ldapUsers.data.users)
await sdk.syncLdapUsersFromServer('<ldap id>') // fetch and sync all the LDAP users
```

### Multi-Factor Authentication

```typescript
import { MfaType } from 'casdoor-nodejs-sdk'

const mfa = { owner: 'my-organization', name: 'alice', mfaType: MfaType.APP, secret: '' }
const { data: initiate } = await sdk.initiateMfa(mfa)
await sdk.verifyMfa({ ...mfa, secret: initiate.data.secret }, '<passcode>')
await sdk.enableMfa({ ...mfa, secret: initiate.data.secret, recoveryCode: '<recovery code>' })
await sdk.setPreferredMfa(mfa)
await sdk.deleteMfa('my-organization', 'alice')
```

## 📚 API Reference

| Object           | Methods                                                                                                                         |
|------------------|---------------------------------------------------------------------------------------------------------------------------------|
| **Auth**         | `getAuthToken`, `getOAuthTokenByPassword`, `impersonateUser`, `refreshToken`, `introspectToken`, `parseJwtToken`, `logout`, `logoutCurrentSession`, `withAccessToken`, `getAccount` |
| **URL**          | `getSignInUrl`, `getSignUpUrl`, `getUserProfileUrl`, `getMyProfileUrl`                                                          |
| **User**         | CRUD + pagination, `getUserByEmail`, `getUserByPhone`, `getUserByUserId`, `getSortedUsers`, `getGlobalUsers`, `getUserCount`, `updateUserForColumns`, `updateUserById`, `updateUserByUserId`, `checkUserPassword`, `setPassword` |
| **Organization** | CRUD, `getOrganizationNames`                                                                                                    |
| **Application**  | CRUD, `getOrganizationApplications`                                                                                             |
| **Group**        | CRUD + pagination                                                                                                               |
| **Cert**         | CRUD, `getGlobalCerts`                                                                                                          |
| **Provider**     | CRUD + pagination                                                                                                               |
| **Role**         | CRUD + pagination, `updateRoleForColumns`                                                                                       |
| **Permission**   | CRUD + pagination, `updatePermissionForColumns`, `getPermissionsByRole`                                                         |
| **Model / Adapter / Enforcer** | CRUD + pagination                                                                                                 |
| **Policy**       | `getPolicies`, `getFilteredPolicies`, `addPolicy`, `updatePolicy`, `removePolicy`                                               |
| **Enforce**      | `enforce`, `batchEnforce`                                                                                                       |
| **Session**      | CRUD + pagination, `updateSessionForColumns`                                                                                    |
| **Token**        | CRUD + pagination, `updateTokenForColumns`, `introspectToken`                                                                   |
| **Product**      | CRUD + pagination                                                                                                               |
| **Order**        | CRUD + pagination, `getUserOrders`, `placeOrder`, `payOrder`, `buyProduct`, `cancelOrder`                                       |
| **Payment**      | CRUD + pagination, `getUserPayments`, `notifyPayment`, `invoicePayment`                                                         |
| **Plan / Pricing / Subscription** | CRUD + pagination                                                                                              |
| **Transaction**  | CRUD + pagination, `getUserTransactions`, `addTransactionWithDryRun`                                                            |
| **Invitation**   | CRUD + pagination, `updateInvitationForColumns`, `getInvitationInfo`                                                            |
| **LDAP**         | CRUD, `getLdapUsers`, `syncLdapUsers`, `syncLdapUsersFromServer`                                                                |
| **Syncer / Webhook** | CRUD + pagination                                                                                                           |
| **Resource**     | `getResources`, `getPaginationResources`, `getResource`, `getResourceEx`, `addResource`, `updateResource`, `uploadResource`, `uploadResourceEx`, `deleteResource`, `deleteResourceWithTag` |
| **Record**       | `getRecords`, `getPaginationRecords`, `getRecord`, `addRecord`                                                                  |
| **Email / SMS / Notification** | `sendEmail`, `sendEmailByProvider`, `sendSms`, `sendSmsByProvider`, `sendNotification`                            |
| **MFA**          | `initiateMfa`, `verifyMfa`, `enableMfa`, `setPreferredMfa`, `deleteMfa`                                                         |

All the object interfaces (`User`, `Organization`, `Application`, ...) and `CasdoorResponse` are exported by the package.

## 💡 Examples

### Express

```typescript
import express from 'express'
import { SDK } from 'casdoor-nodejs-sdk'

const sdk = new SDK(config)
const app = express()

app.get('/login', (req, res) => {
  res.redirect(sdk.getSignInUrl('http://localhost:8080/callback'))
})

app.get('/callback', async (req, res) => {
  try {
    const token = await sdk.getAuthToken(req.query.code as string)
    const user = sdk.parseJwtToken(token.access_token)
    res.json(user)
  } catch (e) {
    res.status(401).send((e as Error).message)
  }
})

app.listen(8080)
```

Full example projects with different frontends:

1. React frontend: https://github.com/casdoor/casdoor-nodejs-react-example
2. Angular frontend: https://github.com/casdoor/casdoor-nodejs-angular-example

## 🛠 Development

The tests run against a real Casdoor server. CI starts one with Docker and the data in [.ci/casdoor/init_data.json](.ci/casdoor/init_data.json):

```bash
docker run -d --name casdoor -p 8000:8000 \
  -e driverName=sqlite \
  -e dataSourceName='file:casdoor.db?cache=shared' \
  -e initDataFile=/init_data.json \
  -v "$PWD/.ci/casdoor/init_data.json:/init_data.json:ro" \
  casbin/casdoor-all-in-one

yarn install
yarn lint
yarn test
```

Set `CASDOOR_TEST_ENDPOINT`, `CASDOOR_TEST_CLIENT_ID`, `CASDOOR_TEST_CLIENT_SECRET`, `CASDOOR_TEST_ORGANIZATION` and `CASDOOR_TEST_APPLICATION` to run the tests against another server.

Releases are published to npm automatically by semantic-release when commits are pushed to `master`.

## 📖 Documentation

- [Casdoor Documentation](https://casdoor.ai/docs/overview)
- [Casdoor Node.js SDK Documentation](https://casdoor.ai/docs/how-to-connect/sdk)
- [Casdoor API Documentation](https://door.casdoor.com/swagger)
- [Casdoor GitHub Repository](https://github.com/casdoor/casdoor)

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
