// Copyright 2021 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as jwt from 'jsonwebtoken'
import Request from './request'
import { AxiosResponse } from 'axios'
import { Cert } from './cert'
import { Organization } from './organization'
import { Adapter } from './adapter'
import { Group } from './group'
import { Role } from './role'
import { Payment } from './payment'
import { Provider } from './provider'
import { Application } from './application'
import { Model } from './model'
import { Plan } from './plan'
import { Permission } from './permission'
import { Enforcer } from './enforcer'
import { Resource } from './resource'
import { Token } from './token'
import { Session } from './session'
import { Syncer } from './syncer'
import { Webhook } from './webhook'
import { Subscription } from './subscription'
import { Pricing } from './pricing'
import { Product } from './product'

export interface User {
  owner: string
  name: string
  createdTime: string
  updatedTime: string

  id: string
  type: string
  password?: string
  passwordSalt?: string
  displayName?: string
  firstName?: string
  lastName?: string
  avatar?: string
  permanentAvatar?: string
  email: string
  emailVerified: boolean
  phone?: string
  location?: string
  address: string[]
  affiliation?: string
  title?: string
  idCardType?: string
  idCard?: string
  homepage?: string
  bio?: string
  tag?: string
  region?: string
  language: string
  gender?: string
  birthday?: string
  education?: string
  score: number
  karma: number
  ranking: number
  isDefaultAvatar: boolean
  isOnline: boolean
  isAdmin: boolean
  isGlobalAdmin: boolean
  isForbidden: boolean
  isDeleted: boolean
  signupApplication: string
  hash?: string
  preHash?: string

  createdIp?: string
  lastSigninTime?: string
  lastSigninIp?: string

  github?: string
  google?: string
  qq?: string
  wechat?: string
  facebook?: string
  dingtalk?: string
  weibo?: string
  gitee?: string
  linkedin?: string
  wecom?: string
  lark?: string
  gitlab?: string
  adfs?: string
  baidu?: string
  alipay?: string
  casdoor?: string
  infoflow?: string
  apple?: string
  azuread?: string
  slack?: string
  steam?: string
  bilibili?: string
  okta?: string
  douyin?: string
  custom?: string

  ldap?: string
  properties: Record<string, string>
}

// the configuration of the SDK
export interface Config {
  endpoint: string
  clientId: string
  clientSecret: string
  certificate: string
  orgName: string
  appName?: string
}

export class SDK {
  private config: Config
  private request: Request

  constructor(config: Config) {
    this.config = config
    this.request = new Request({
      url: config.endpoint + '/api',
      timeout: 60000,
    })
  }

  public async getAuthToken(code: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    const {
      data: { access_token },
    } = (await this.request.post('login/oauth/access_token', {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: 'authorization_code',
      code,
    })) as unknown as AxiosResponse<{ access_token: string }>

    return access_token
  }

  public parseJwtToken(token: string) {
    return jwt.verify(token, this.config.certificate, {
      algorithms: ['RS256'],
    }) as User
  }

  public async getUsers() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-users', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<User[]>>
  }

  public async getUser(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-user', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<User>>
  }

  public async getUserCount(isOnline: boolean) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-user-count', {
      params: {
        isOnline,
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<number>>
  }

  public async modifyUser(method: string, user: User){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    user.owner = this.config.orgName
    const userInfo = JSON.stringify(user)
    return (await this.request.post(
      url,
      { userInfo },
      {
        params: {
          id: `${user.owner}/${user.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addUser(user: User){
    return this.modifyUser('add-user', user)
  }

  public async updateUser(user: User){
    return this.modifyUser('update-user', user)
  }

  public async deleteUser(user: User){
    return this.modifyUser('delete-user', user)
  }

  public async getCerts() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-certs', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Cert[]>>
  }

  public async getCert(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-cert', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Cert>>
  }

  public async modifyCert(method: string, cert: Cert){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = this.config.endpoint + `/${method}`
    cert.owner = this.config.orgName
    const certInfo = JSON.stringify(cert)
    return (await this.request.post(
      url,
      { certInfo },
      {
        params: {
          id: `${cert.owner}/${cert.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addCert(cert: Cert){
    return this.modifyCert('add-cert', cert)
  }

  public async updateCert(cert: Cert){
    return this.modifyCert('update-cert', cert)
  }

  public async deleteCert(cert: Cert){
    return this.modifyCert('delete-cert', cert)
  }

  public async getOrganizations() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-organizations', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Organization[]>>
  }

  public async getOrganization(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-organization', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Organization>>
  }

  public async modifyOrganization(method: string, organization: Organization){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = this.config.endpoint + `/${method}`
    organization.owner = this.config.orgName
    const organizationInfo = JSON.stringify(organization)
    return (await this.request.post(
      url,
      { organizationInfo },
      {
        params: {
          id: `${organization.owner}/${organization.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addOrganization(organization: Organization){
    return this.modifyOrganization('add-organization', organization)
  }

  public async updateOrganization(organization: Organization){
    return this.modifyOrganization('update-organization', organization)
  }

  public async deleteOrganization(organization: Organization){
    return this.modifyOrganization('delete-organization', organization)
  }

  public async getAdapters() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-adapters', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Adapter[]>>
  }

  public async getAdapter(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-adapter', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Adapter>>
  }

  public async modifyAdapter(method: string, adapter: Adapter){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = this.config.endpoint + `/${method}`
    adapter.owner = this.config.orgName
    const adapterInfo = JSON.stringify(adapter)
    return (await this.request.post(
      url,
      { adapterInfo },
      {
        params: {
          id: `${adapter.owner}/${adapter.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addAdapter(adapter: Adapter){
    return this.modifyAdapter('add-adapter', adapter)
  }

  public async updateAdapter(adapter: Adapter){
    return this.modifyAdapter('update-adapter', adapter)
  }

  public async deleteAdapter(adapter: Adapter){
    return this.modifyAdapter('delete-adapter', adapter)
  }

  public async getGroups() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-groups', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Group[]>>
  }

  public async getGroup(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-group', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Group>>
  }

  public async modifyGroup(method: string, group: Group){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    group.owner = this.config.orgName
    const groupInfo = JSON.stringify(group)
    return (await this.request.post(
      url,
      { groupInfo },
      {
        params: {
          id: `${group.owner}/${group.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addGroup(group: Group){
    return this.modifyGroup('add-group', group)
  }

  public async updateGroup(group: Group){
    return this.modifyGroup('update-group', group)
  }

  public async deleteGroup(group: Group){
    return this.modifyGroup('delete-group', group)
  }

  public async getRoles() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-roles', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Role[]>>
  }

  public async getRole(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-role', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Role>>
  }

  public async modifyRole(method: string, role: Role){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    role.owner = this.config.orgName
    const roleInfo = JSON.stringify(role)
    return (await this.request.post(
      url,
      { roleInfo },
      {
        params: {
          id: `${role.owner}/${role.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addRole(role: Role){
    return this.modifyRole('add-role', role)
  }

  public async updateRole(role: Role){
    return this.modifyRole('update-role', role)
  }

  public async deleteRole(role: Role){
    return this.modifyRole('delete-role', role)
  }

  public async getPayments() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-payments', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Payment[]>>
  }

  public async getPayment(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-payment', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Payment>>
  }

  public async modifyPayment(method: string, payment: Payment){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    payment.owner = this.config.orgName
    const paymentInfo = JSON.stringify(payment)
    return (await this.request.post(
      url,
      { paymentInfo },
      {
        params: {
          id: `${payment.owner}/${payment.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addPayment(payment: Payment){
    return this.modifyPayment('add-payment', payment)
  }

  public async updatePayment(payment: Payment){
    return this.modifyPayment('update-payment', payment)
  }

  public async deletePayment(payment: Payment){
    return this.modifyPayment('delete-payment', payment)
  }

  public async getProviders() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-providers', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Provider[]>>
  }

  public async getProvider(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-provider', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Provider>>
  }

  public async modifyProvider(method: string, provider: Provider){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    provider.owner = this.config.orgName
    const providerInfo = JSON.stringify(provider)
    return (await this.request.post(
      url,
      { providerInfo },
      {
        params: {
          id: `${provider.owner}/${provider.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addProvider(provider: Provider){
    return this.modifyProvider('add-provider', provider)
  }

  public async updateProvider(provider: Provider){
    return this.modifyProvider('update-provider', provider)
  }

  public async deleteProvider(provider: Provider){
    return this.modifyProvider('delete-provider', provider)
  }

  public async getApplications() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-applications', {
      params: {
        owner: 'admin',
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Application[]>>
  }

  public async getApplication(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-application', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Application>>
  }

  public async modifyApplication(method: string, application: Application){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    application.owner = this.config.orgName
    const applicationInfo = JSON.stringify(application)
    return (await this.request.post(
      url,
      { applicationInfo },
      {
        params: {
          id: `${application.owner}/${application.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addApplication(application: Application){
    return this.modifyApplication('add-application', application)
  }

  public async updateApplication(application: Application){
    return this.modifyApplication('update-application', application)
  }

  public async deleteApplication(application: Application){
    return this.modifyApplication('delete-application', application)
  }

  public async getModels() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-models', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Model[]>>
  }

  public async getModel(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-model', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Model>>
  }

  public async modifyModel(method: string, model: Model){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    model.owner = this.config.orgName
    const modelInfo = JSON.stringify(model)
    return (await this.request.post(
      url,
      { modelInfo },
      {
        params: {
          id: `${model.owner}/${model.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addModel(model: Model){
    return this.modifyModel('add-model', model)
  }

  public async updateModel(model: Model){
    return this.modifyModel('update-model', model)
  }

  public async deleteModel(model: Model){
    return this.modifyModel('delete-model', model)
  }

  public async getPlans() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-plans', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Plan[]>>
  }

  public async getPlan(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-plan', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Plan>>
  }

  public async modifyPlan(method: string, plan: Plan){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    plan.owner = this.config.orgName
    const planInfo = JSON.stringify(plan)
    return (await this.request.post(
      url,
      { planInfo },
      {
        params: {
          id: `${plan.owner}/${plan.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addPlan(plan: Plan){
    return this.modifyPlan('add-plan', plan)
  }

  public async updatePlan(plan: Plan){
    return this.modifyPlan('update-plan', plan)
  }

  public async deletePlan(plan: Plan){
    return this.modifyPlan('delete-plan', plan)
  }

  public async getPermissions() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-permissions', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Permission[]>>
  }

  public async getPermission(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-permission', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Permission>>
  }

  public async modifyPermission(method: string, permission: Permission){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    permission.owner = this.config.orgName
    const permissionInfo = JSON.stringify(permission)
    return (await this.request.post(
      url,
      { permissionInfo },
      {
        params: {
          id: `${permission.owner}/${permission.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addPermission(permission: Permission){
    return this.modifyPermission('add-permission', permission)
  }

  public async updatePermission(permission: Permission){
    return this.modifyPermission('update-permission', permission)
  }

  public async deletePermission(permission: Permission){
    return this.modifyPermission('delete-permission', permission)
  }

  public async getEnforcers() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-enforcers', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Enforcer[]>>
  }

  public async getEnforcer(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-enforcer', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Enforcer>>
  }

  public async modifyEnforcer(method: string, enforcer: Enforcer){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    enforcer.owner = this.config.orgName
    const enforcerInfo = JSON.stringify(enforcer)
    return (await this.request.post(
      url,
      { enforcerInfo },
      {
        params: {
          id: `${enforcer.owner}/${enforcer.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addEnforcer(enforcer: Enforcer){
    return this.modifyEnforcer('add-enforcer', enforcer)
  }

  public async updateEnforcer(enforcer: Enforcer){
    return this.modifyEnforcer('update-enforcer', enforcer)
  }

  public async deleteEnforcer(enforcer: Enforcer){
    return this.modifyEnforcer('delete-enforcer', enforcer)
  }

  public async getResources(
    owner: string,
    user: string,
    field: string,
    value: string,
    sortField: string,
    sortOrder: string,
  ) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-resources', {
      params: {
        owner: owner,
        user: user,
        field: field,
        value: value,
        sortField: sortField,
        sortOrder: sortOrder,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Resource[]>>
  }

  public async getResource(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-resource', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Resource>>
  }

  public async modifyResource(method: string, resource: Resource){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    resource.owner = this.config.orgName
    const resourceInfo = JSON.stringify(resource)
    return (await this.request.post(
      url,
      { resourceInfo },
      {
        params: {
          id: `${resource.owner}/${resource.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addResource(resource: Resource){
    return this.modifyResource('add-resource', resource)
  }

  public async updateResource(resource: Resource){
    return this.modifyResource('update-resource', resource)
  }

  public async deleteResource(resource: Resource){
    return this.modifyResource('delete-resource', resource)
  }

  public async getTokens(p: number, pageSize: number) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-tokens', {
      params: {
        p: String(p),
        pageSize: String(pageSize),
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Token[]>>
  }

  public async getToken(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-token', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Token>>
  }

  public async modifyToken(method: string, token: Token){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    token.owner = this.config.orgName
    const tokenInfo = JSON.stringify(token)
    return (await this.request.post(
      url,
      { tokenInfo },
      {
        params: {
          id: `${token.owner}/${token.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addToken(token: Token){
    return this.modifyToken('add-token', token)
  }

  public async updateToken(token: Token){
    return this.modifyToken('update-token', token)
  }

  public async deleteToken(token: Token){
    return this.modifyToken('delete-token', token)
  }

  public async getSessions() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-sessions', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Session[]>>
  }

  public async getSession(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-session', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Session>>
  }

  public async modifySession(method: string, session: Session){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    session.owner = this.config.orgName
    const sessionInfo = JSON.stringify(session)
    return (await this.request.post(
      url,
      { sessionInfo },
      {
        params: {
          id: `${session.owner}/${session.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addSession(session: Session){
    return this.modifySession('add-session', session)
  }

  public async updateSession(session: Session){
    return this.modifySession('update-session', session)
  }

  public async deleteSession(session: Session){
    return this.modifySession('delete-session', session)
  }

  public async getSyncers() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-syncers', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Syncer[]>>
  }

  public async getSyncer(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-syncer', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Syncer>>
  }

  public async modifySyncer(method: string, syncer: Syncer){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    syncer.owner = this.config.orgName
    const syncerInfo = JSON.stringify(syncer)
    return (await this.request.post(
      url,
      { syncerInfo },
      {
        params: {
          id: `${syncer.owner}/${syncer.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addSyncer(syncer: Syncer){
    return this.modifySyncer('add-syncer', syncer)
  }

  public async updateSyncer(syncer: Syncer){
    return this.modifySyncer('update-syncer', syncer)
  }

  public async deleteSyncer(syncer: Syncer){
    return this.modifySyncer('delete-syncer', syncer)
  }

  public async getWebhooks() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-webhooks', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Webhook[]>>
  }

  public async getWebhook(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-webhook', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Webhook>>
  }

  public async modifyWebhook(method: string, webhook: Webhook){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    webhook.owner = this.config.orgName
    const webhookInfo = JSON.stringify(webhook)
    return (await this.request.post(
      url,
      { webhookInfo },
      {
        params: {
          id: `${webhook.owner}/${webhook.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addWebhook(webhook: Webhook){
    return this.modifyWebhook('add-webhook', webhook)
  }

  public async updateWebhook(webhook: Webhook){
    return this.modifyWebhook('update-webhook', webhook)
  }

  public async deleteWebhook(webhook: Webhook){
    return this.modifyWebhook('delete-webhook', webhook)
  }

  public async getSubscriptions() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-subscriptions', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<Subscription[]>>
  }

  public async getSubscription(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-subscription', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<Subscription>>
  }

  public async modifySubscription(method: string, subscription: Subscription){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    subscription.owner = this.config.orgName
    const subscriptionInfo = JSON.stringify(subscription)
    return (await this.request.post(
      url,
      { subscriptionInfo },
      {
        params: {
          id: `${subscription.owner}/${subscription.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addSubscription(subscription: Subscription){
    return this.modifySubscription('add-subscription', subscription)
  }

  public async updateSubscription(subscription: Subscription){
    return this.modifySubscription('update-subscription', subscription)
  }

  public async deleteSubscription(subscription: Subscription){
    return this.modifySubscription('delete-subscription', subscription)
  }

  public async getPricings() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-pricings', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
      },
    })) as unknown as Promise<AxiosResponse<Pricing[]>>
  }

  public async getPricing(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-pricing', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<Pricing>>
  }

  public async modifyPricing(method: string, pricing: Pricing){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    pricing.owner = this.config.orgName
    const pricingInfo = JSON.stringify(pricing)
    return (await this.request.post(
      url,
      { pricingInfo },
      {
        params: {
          id: `${pricing.owner}/${pricing.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addPricing(pricing: Pricing){
    return this.modifyPricing('add-pricing', pricing)
  }

  public async updatePricing(pricing: Pricing){
    return this.modifyPricing('update-pricing', pricing)
  }

  public async deletePricing(pricing: Pricing){
    return this.modifyPricing('delete-pricing', pricing)
  }

  public async getProducts() {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-products', {
      params: {
        owner: this.config.orgName,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<Product[]>>
  }

  public async getProduct(id: string) {
    if (!this.request) {
      throw new Error('request init failed')
    }

    return (await this.request.get('/get-product', {
      params: {
        id: `${this.config.orgName}/${id}`,
        clientId: this.config.clientId,
        clientSecret: this.config.clientSecret,
        pageSize: 1000,
      },
    })) as unknown as Promise<AxiosResponse<Product>>
  }

  public async modifyProduct(method: string, product: Product){
    if (!this.request) {
      throw new Error('request init failed')
    }

    const url = `/${method}`
    product.owner = this.config.orgName
    const productInfo = JSON.stringify(product)
    return (await this.request.post(
      url,
      { productInfo },
      {
        params: {
          id: `${product.owner}/${product.name}`,
          clientId: this.config.clientId,
          clientSecret: this.config.clientSecret,
        },
      },
    )) as unknown as Promise<AxiosResponse<Record<string, unknown>>>
  }

  public async addProduct(product: Product){
    return this.modifyProduct('add-product', product)
  }

  public async updateProduct(product: Product){
    return this.modifyProduct('update-product', product)
  }

  public async deleteProduct(product: Product){
    return this.modifyProduct('delete-product', product)
  }
}
