// Copyright 2021 The Casdoor Authors. All Rights Reserved.
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

import { Config } from './config'
import Request from './request'
import { SetPassword, User, UserSDK } from './user'
import { Adapter, AdapterSDK } from './adapter'
import { Application, ApplicationSDK } from './application'
import { Cert, CertSDK } from './cert'
import { Enforcer, EnforcerSDK } from './enforcer'
import { Group, GroupSDK } from './group'
import { Model, ModelSDK } from './model'
import { Organization, OrganizationSDK } from './organization'
import { Payment, PaymentSDK } from './payment'
import { Session, SessionSDK } from './session'
import { Syncer, SyncerSDK } from './syncer'
import { Permission, PermissionSDK } from './permission'
import { Plan, PlanSDK } from './plan'
import { Policy, PolicySDK } from './policy'
import { Pricing, PricingSDK } from './pricing'
import { Provider, ProviderSDK } from './provider'
import { Resource, ResourceSDK } from './resource'
import { Role, RoleSDK } from './role'
import { Subscription, SubscriptionSDK } from './subscription'
import { Token, TokenSDK } from './token'
import { Webhook, WebhookSDK } from './webhook'
import { Product, ProductSDK } from './product'
import { Email, EmailSDK } from './email'
import { Invitation, InvitationSDK } from './invitation'
import { Ldap, LdapSDK, LdapUser } from './ldap'
import { Order, OrderSDK, ProductInfo } from './order'
import { Transaction, TransactionSDK } from './transaction'
import { Record as CasdoorRecord, RecordSDK } from './record'
import { Notification, NotificationSDK } from './notification'
import { PolicyFilter } from './policy'
import { getId } from './util'
import { Sms, SmsSDK } from './sms'
import { MfaData, MfaSDK } from './mfa'
import { CasbinRequest, EnforceSDK } from './enforce'
import { UrlSDK } from './url'
import type { AxiosRequestConfig } from 'axios'

export class SDK {
  protected readonly config: Config
  protected readonly request: Request
  private userSDK: UserSDK
  private adapterSDK: AdapterSDK
  private applicationSDK: ApplicationSDK
  private certSDK: CertSDK
  private enforcerSDK: EnforcerSDK
  private groupSDK: GroupSDK
  private modelSDK: ModelSDK
  private organizationSDK: OrganizationSDK
  private paymentSDK: PaymentSDK
  private sessionSDK: SessionSDK
  private syncerSDK: SyncerSDK
  private permissionSDK: PermissionSDK
  private planSDK: PlanSDK
  private policySDK: PolicySDK
  private pricingSDK: PricingSDK
  private providerSDK: ProviderSDK
  private resourceSDK: ResourceSDK
  private roleSDK: RoleSDK
  private subscriptionSDK: SubscriptionSDK
  private tokenSDK: TokenSDK
  private webhookSDK: WebhookSDK
  private productSDK: ProductSDK
  private emailSDK: EmailSDK
  private smsSDK: SmsSDK
  private mfaSDK: MfaSDK
  private enforceSDK: EnforceSDK
  private urlSDK: UrlSDK
  private invitationSDK: InvitationSDK
  private ldapSDK: LdapSDK
  private orderSDK: OrderSDK
  private transactionSDK: TransactionSDK
  private recordSDK: RecordSDK
  private notificationSDK: NotificationSDK
  private readonly axiosConfig?: AxiosRequestConfig

  // accessToken is set by withAccessToken() to call the APIs as the user who owns the token
  constructor(
    config: Config,
    axiosConfig?: AxiosRequestConfig,
    accessToken?: string,
  ) {
    this.config = config
    this.axiosConfig = axiosConfig
    const authorization = accessToken
      ? `Bearer ${accessToken}`
      : 'Basic ' +
        Buffer.from(
          `${this.config.clientId}:${this.config.clientSecret}`,
        ).toString('base64')
    this.request = new Request({
      url: config.endpoint + '/api',
      timeout: 60000,
      ...axiosConfig,
      headers: {
        ...(axiosConfig?.headers as Record<string, string>),
        Authorization: authorization,
      },
    })
    this.userSDK = new UserSDK(this.config, this.request)
    this.adapterSDK = new AdapterSDK(this.config, this.request)
    this.applicationSDK = new ApplicationSDK(this.config, this.request)
    this.certSDK = new CertSDK(this.config, this.request)
    this.enforcerSDK = new EnforcerSDK(this.config, this.request)
    this.groupSDK = new GroupSDK(this.config, this.request)
    this.modelSDK = new ModelSDK(this.config, this.request)
    this.organizationSDK = new OrganizationSDK(this.config, this.request)
    this.paymentSDK = new PaymentSDK(this.config, this.request)
    this.sessionSDK = new SessionSDK(this.config, this.request)
    this.syncerSDK = new SyncerSDK(this.config, this.request)
    this.permissionSDK = new PermissionSDK(this.config, this.request)
    this.planSDK = new PlanSDK(this.config, this.request)
    this.policySDK = new PolicySDK(this.config, this.request)
    this.pricingSDK = new PricingSDK(this.config, this.request)
    this.providerSDK = new ProviderSDK(this.config, this.request)
    this.resourceSDK = new ResourceSDK(this.config, this.request)
    this.roleSDK = new RoleSDK(this.config, this.request)
    this.subscriptionSDK = new SubscriptionSDK(this.config, this.request)
    this.tokenSDK = new TokenSDK(this.config, this.request)
    this.webhookSDK = new WebhookSDK(this.config, this.request)
    this.productSDK = new ProductSDK(this.config, this.request)
    this.emailSDK = new EmailSDK(this.config, this.request)
    this.smsSDK = new SmsSDK(this.config, this.request)
    this.mfaSDK = new MfaSDK(this.config, this.request)
    this.enforceSDK = new EnforceSDK(this.config, this.request)
    this.urlSDK = new UrlSDK(this.config)
    this.invitationSDK = new InvitationSDK(this.config, this.request)
    this.ldapSDK = new LdapSDK(this.config, this.request)
    this.orderSDK = new OrderSDK(this.config, this.request)
    this.transactionSDK = new TransactionSDK(this.config, this.request)
    this.recordSDK = new RecordSDK(this.config, this.request)
    this.notificationSDK = new NotificationSDK(this.config, this.request)
  }

  // withAccessToken returns a new SDK that calls the APIs as the user who owns the access token
  // (Authorization: Bearer <accessToken>) instead of as the application, the current SDK is not changed
  public withAccessToken(accessToken: string) {
    return new SDK(this.config, this.axiosConfig, accessToken)
  }

  // getId returns the "owner/name" ID of an object of the SDK's organization
  public getId(name: string) {
    return getId(name, this.config.orgName)
  }

  public async getAuthToken(code: string) {
    return await this.userSDK.getAuthToken(code)
  }

  public async refreshToken(refreshToken: string, scope?: string) {
    return await this.userSDK.refreshToken(refreshToken, scope)
  }

  public async getOAuthTokenByPassword(username: string, password: string) {
    return await this.userSDK.getOAuthTokenByPassword(username, password)
  }

  public async impersonateUser(username: string, masterPassword: string) {
    return await this.userSDK.impersonateUser(username, masterPassword)
  }

  public async logout(accessToken: string) {
    return await this.userSDK.logout(accessToken)
  }

  public async logoutCurrentSession(accessToken: string) {
    return await this.userSDK.logoutCurrentSession(accessToken)
  }

  public parseJwtToken(token: string) {
    return this.userSDK.parseJwtToken(token)
  }

  public async getUsers() {
    return await this.userSDK.getUsers()
  }

  public async getUser(id: string) {
    return await this.userSDK.getUser(id)
  }

  public async getUserCount(isOnline: boolean) {
    return await this.userSDK.getUserCount(isOnline)
  }

  public async addUser(user: User) {
    return await this.userSDK.addUser(user)
  }

  public async updateUser(user: User) {
    return await this.userSDK.updateUser(user)
  }

  public async deleteUser(user: User) {
    return await this.userSDK.deleteUser(user)
  }

  public async getAdapters() {
    return await this.adapterSDK.getAdapters()
  }

  public async getAdapter(id: string) {
    return await this.adapterSDK.getAdapter(id)
  }

  public async addAdapter(adapter: Adapter) {
    return await this.adapterSDK.addAdapter(adapter)
  }

  public async updateAdapter(adapter: Adapter) {
    return await this.adapterSDK.updateAdapter(adapter)
  }

  public async deleteAdapter(adapter: Adapter) {
    return await this.adapterSDK.deleteAdapter(adapter)
  }

  public async getApplications() {
    return await this.applicationSDK.getApplications()
  }

  public async getApplication(name: string) {
    return await this.applicationSDK.getApplication(name)
  }

  public async addApplication(application: Application) {
    return await this.applicationSDK.addApplication(application)
  }

  public async updateApplication(application: Application) {
    return await this.applicationSDK.updateApplication(application)
  }

  public async deleteApplication(application: Application) {
    return await this.applicationSDK.deleteApplication(application)
  }

  public async getCerts() {
    return await this.certSDK.getCerts()
  }

  public async getCert(id: string) {
    return await this.certSDK.getCert(id)
  }

  public async addCert(cert: Cert) {
    return await this.certSDK.addCert(cert)
  }

  public async updateCert(cert: Cert) {
    return await this.certSDK.updateCert(cert)
  }

  public async deleteCert(cert: Cert) {
    return await this.certSDK.deleteCert(cert)
  }

  public async getEnforcers() {
    return await this.enforcerSDK.getEnforcers()
  }

  public async getEnforcer(id: string) {
    return await this.enforcerSDK.getEnforcer(id)
  }

  public async addEnforcer(enforcer: Enforcer) {
    return await this.enforcerSDK.addEnforcer(enforcer)
  }

  public async updateEnforcer(enforcer: Enforcer) {
    return await this.enforcerSDK.updateEnforcer(enforcer)
  }

  public async deleteEnforcer(enforcer: Enforcer) {
    return await this.enforcerSDK.deleteEnforcer(enforcer)
  }

  public async getGroups() {
    return await this.groupSDK.getGroups()
  }

  public async getGroup(id: string) {
    return await this.groupSDK.getGroup(id)
  }

  public async addGroup(group: Group) {
    return await this.groupSDK.addGroup(group)
  }

  public async updateGroup(group: Group) {
    return await this.groupSDK.updateGroup(group)
  }

  public async deleteGroup(group: Group) {
    return await this.groupSDK.deleteGroup(group)
  }

  public async getModels() {
    return await this.modelSDK.getModels()
  }

  public async getModel(id: string) {
    return await this.modelSDK.getModel(id)
  }

  public async addModel(model: Model) {
    return await this.modelSDK.addModel(model)
  }

  public async updateModel(model: Model) {
    return await this.modelSDK.updateModel(model)
  }

  public async deleteModel(model: Model) {
    return await this.modelSDK.deleteModel(model)
  }

  public async getOrganizations() {
    return await this.organizationSDK.getOrganizations()
  }

  public async getOrganization(id: string) {
    return await this.organizationSDK.getOrganization(id)
  }

  public async addOrganization(organization: Organization) {
    return await this.organizationSDK.addOrganization(organization)
  }

  public async updateOrganization(organization: Organization) {
    return await this.organizationSDK.updateOrganization(organization)
  }

  public async deleteOrganization(organization: Organization) {
    return await this.organizationSDK.deleteOrganization(organization)
  }

  public async getPayments() {
    return await this.paymentSDK.getPayments()
  }

  public async getPayment(id: string) {
    return await this.paymentSDK.getPayment(id)
  }

  public async addPayment(payment: Payment) {
    return await this.paymentSDK.addPayment(payment)
  }

  public async updatePayment(payment: Payment) {
    return await this.paymentSDK.updatePayment(payment)
  }

  public async deletePayment(payment: Payment) {
    return await this.paymentSDK.deletePayment(payment)
  }

  public async getSessions() {
    return await this.sessionSDK.getSessions()
  }

  public async getSession(name: string, application: string) {
    return await this.sessionSDK.getSession(name, application)
  }

  public async addSession(session: Session) {
    return await this.sessionSDK.addSession(session)
  }

  public async updateSession(session: Session) {
    return await this.sessionSDK.updateSession(session)
  }

  public async deleteSession(session: Session) {
    return await this.sessionSDK.deleteSession(session)
  }

  public async getSyncers() {
    return await this.syncerSDK.getSyncers()
  }

  public async getSyncer(id: string) {
    return await this.syncerSDK.getSyncer(id)
  }

  public async addSyncer(syncer: Syncer) {
    return await this.syncerSDK.addSyncer(syncer)
  }

  public async updateSyncer(syncer: Syncer) {
    return await this.syncerSDK.updateSyncer(syncer)
  }

  public async deleteSyncer(syncer: Syncer) {
    return await this.syncerSDK.deleteSyncer(syncer)
  }

  public async getPermissions() {
    return await this.permissionSDK.getPermissions()
  }

  public async getPermission(id: string) {
    return await this.permissionSDK.getPermission(id)
  }

  public async addPermission(permission: Permission) {
    return await this.permissionSDK.addPermission(permission)
  }

  public async updatePermission(permission: Permission) {
    return await this.permissionSDK.updatePermission(permission)
  }

  public async deletePermission(permission: Permission) {
    return await this.permissionSDK.deletePermission(permission)
  }

  public async getPlans() {
    return await this.planSDK.getPlans()
  }

  public async getPlan(id: string) {
    return await this.planSDK.getPlan(id)
  }

  public async addPlan(plan: Plan) {
    return await this.planSDK.addPlan(plan)
  }

  public async updatePlan(plan: Plan) {
    return await this.planSDK.updatePlan(plan)
  }

  public async deletePlan(plan: Plan) {
    return await this.planSDK.deletePlan(plan)
  }

  public async getPolicies(enforcerName: string, adapterId?: string) {
    return await this.policySDK.getPolicies(enforcerName, adapterId)
  }

  public async addPolicy(enforcer: Enforcer, policy: Policy) {
    return await this.policySDK.addPolicy(enforcer, policy)
  }

  public async updatePolicy(
    enforcer: Enforcer,
    oldPolicy: Policy,
    newPolicy: Policy,
  ) {
    return await this.policySDK.updatePolicy(enforcer, oldPolicy, newPolicy)
  }

  public async deletePolicy(enforcer: Enforcer, policy: Policy) {
    return await this.policySDK.deletePolicy(enforcer, policy)
  }

  public async getPricings() {
    return await this.pricingSDK.getPricings()
  }

  public async getPricing(id: string) {
    return await this.pricingSDK.getPricing(id)
  }

  public async addPricing(pricing: Pricing) {
    return await this.pricingSDK.addPricing(pricing)
  }

  public async updatePricing(pricing: Pricing) {
    return await this.pricingSDK.updatePricing(pricing)
  }

  public async deletePricing(pricing: Pricing) {
    return await this.pricingSDK.deletePricing(pricing)
  }

  public async getProviders() {
    return await this.providerSDK.getProviders()
  }

  public async getProvider(id: string) {
    return await this.providerSDK.getProvider(id)
  }

  public async addProvider(provider: Provider) {
    return await this.providerSDK.addProvider(provider)
  }

  public async updateProvider(provider: Provider) {
    return await this.providerSDK.updateProvider(provider)
  }

  public async deleteProvider(provider: Provider) {
    return await this.providerSDK.deleteProvider(provider)
  }

  public async getResources(
    owner: string,
    user: string,
    field: string,
    value: string,
    sortField: string,
    sortOrder: string,
  ) {
    return await this.resourceSDK.getResources(
      owner,
      user,
      field,
      value,
      sortField,
      sortOrder,
    )
  }

  public async getResource(id: string) {
    return await this.resourceSDK.getResource(id)
  }

  public async addResource(resource: Resource) {
    return await this.resourceSDK.addResource(resource)
  }

  public async updateResource(resource: Resource) {
    return await this.resourceSDK.updateResource(resource)
  }

  public async deleteResource(resource: Resource) {
    return await this.resourceSDK.deleteResource(resource)
  }

  public async uploadResource(resource: Resource, file: any) {
    return await this.resourceSDK.uploadResource(resource, file)
  }

  public async getRoles() {
    return await this.roleSDK.getRoles()
  }

  public async getRole(id: string) {
    return await this.roleSDK.getRole(id)
  }

  public async addRole(role: Role) {
    return await this.roleSDK.addRole(role)
  }

  public async updateRole(role: Role) {
    return await this.roleSDK.updateRole(role)
  }

  public async deleteRole(role: Role) {
    return await this.roleSDK.deleteRole(role)
  }

  public async getSubscriptions() {
    return await this.subscriptionSDK.getSubscriptions()
  }

  public async getSubscription(id: string) {
    return await this.subscriptionSDK.getSubscription(id)
  }

  public async addSubscription(subscription: Subscription) {
    return await this.subscriptionSDK.addSubscription(subscription)
  }

  public async updateSubscription(subscription: Subscription) {
    return await this.subscriptionSDK.updateSubscription(subscription)
  }

  public async deleteSubscription(subscription: Subscription) {
    return await this.subscriptionSDK.deleteSubscription(subscription)
  }

  public async getTokens(p?: number, pageSize?: number) {
    return await this.tokenSDK.getTokens(p, pageSize)
  }

  public async getToken(id: string) {
    return await this.tokenSDK.getToken(id)
  }

  public async addToken(token: Token) {
    return await this.tokenSDK.addToken(token)
  }

  public async updateToken(token: Token) {
    return await this.tokenSDK.updateToken(token)
  }

  public async deleteToken(token: Token) {
    return await this.tokenSDK.deleteToken(token)
  }

  public async introspect(token: string, token_type_hint: string) {
    return await this.tokenSDK.introspect(token, token_type_hint)
  }

  public async getWebhooks() {
    return await this.webhookSDK.getWebhooks()
  }

  public async getWebhook(id: string) {
    return await this.webhookSDK.getWebhook(id)
  }

  public async addWebhook(webhook: Webhook) {
    return await this.webhookSDK.addWebhook(webhook)
  }

  public async updateWebhook(webhook: Webhook) {
    return await this.webhookSDK.updateWebhook(webhook)
  }

  public async deleteWebhook(webhook: Webhook) {
    return await this.webhookSDK.deleteWebhook(webhook)
  }

  public async getProducts() {
    return await this.productSDK.getProducts()
  }

  public async getProduct(id: string) {
    return await this.productSDK.getProduct(id)
  }

  public async addProduct(product: Product) {
    return await this.productSDK.addProduct(product)
  }

  public async updateProduct(product: Product) {
    return await this.productSDK.updateProduct(product)
  }

  public async deleteProduct(product: Product) {
    return await this.productSDK.deleteProduct(product)
  }

  public async sendEmail(email: Email) {
    return await this.emailSDK.sendEmail(email)
  }

  public async sendSms(sms: Sms) {
    return await this.smsSDK.sendSms(sms)
  }

  public async setPassword(data: SetPassword) {
    return await this.userSDK.setPassword(data)
  }

  public async initiateMfa(data: MfaData) {
    return await this.mfaSDK.initiate(data)
  }

  public async verifyMfa(data: MfaData, passcode: string) {
    return await this.mfaSDK.verify(data, passcode)
  }

  public async enableMfa(data: MfaData, cookie: any = null) {
    return await this.mfaSDK.enable(data, cookie)
  }

  public async setPreferredMfa(data: MfaData) {
    return await this.mfaSDK.setPreferred(data)
  }

  public async deleteMfa(owner: string, name: string) {
    return await this.mfaSDK.delete(owner, name)
  }

  public async enforce(
    permissionId: string,
    modelId: string,
    resourceId: string,
    enforcerId: string,
    owner: string,
    casbinRequest: CasbinRequest,
  ) {
    return await this.enforceSDK.enforce(
      permissionId,
      modelId,
      resourceId,
      enforcerId,
      owner,
      casbinRequest,
    )
  }

  public async batchEnforce(
    permissionId: string,
    modelId: string,
    resourceId: string,
    enforcerId: string,
    owner: string,
    casbinRequest: CasbinRequest[],
  ) {
    return await this.enforceSDK.batchEnforce(
      permissionId,
      modelId,
      resourceId,
      enforcerId,
      owner,
      casbinRequest,
    )
  }

  public async getPaginationAdapters(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.adapterSDK.getPaginationAdapters(p, pageSize, queryMap)
  }

  public async getPaginationEnforcers(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.enforcerSDK.getPaginationEnforcers(p, pageSize, queryMap)
  }

  public async getPaginationGroups(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.groupSDK.getPaginationGroups(p, pageSize, queryMap)
  }

  public async getPaginationModels(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.modelSDK.getPaginationModels(p, pageSize, queryMap)
  }

  public async getPaginationPayments(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.paymentSDK.getPaginationPayments(p, pageSize, queryMap)
  }

  public async getPaginationPermissions(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.permissionSDK.getPaginationPermissions(
      p,
      pageSize,
      queryMap,
    )
  }

  public async getPaginationPlans(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.planSDK.getPaginationPlans(p, pageSize, queryMap)
  }

  public async getPaginationPricings(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.pricingSDK.getPaginationPricings(p, pageSize, queryMap)
  }

  public async getPaginationProducts(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.productSDK.getPaginationProducts(p, pageSize, queryMap)
  }

  public async getPaginationProviders(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.providerSDK.getPaginationProviders(p, pageSize, queryMap)
  }

  public async getPaginationRoles(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.roleSDK.getPaginationRoles(p, pageSize, queryMap)
  }

  public async getPaginationSessions(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.sessionSDK.getPaginationSessions(p, pageSize, queryMap)
  }

  public async getPaginationSubscriptions(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.subscriptionSDK.getPaginationSubscriptions(
      p,
      pageSize,
      queryMap,
    )
  }

  public async getPaginationSyncers(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.syncerSDK.getPaginationSyncers(p, pageSize, queryMap)
  }

  public async getPaginationTokens(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.tokenSDK.getPaginationTokens(p, pageSize, queryMap)
  }

  public async getPaginationWebhooks(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.webhookSDK.getPaginationWebhooks(p, pageSize, queryMap)
  }

  public async getPaginationUsers(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.userSDK.getPaginationUsers(p, pageSize, queryMap)
  }

  public async updatePermissionForColumns(
    permission: Permission,
    columns: string[],
  ) {
    return await this.permissionSDK.updatePermissionForColumns(
      permission,
      columns,
    )
  }

  public async updateRoleForColumns(role: Role, columns: string[]) {
    return await this.roleSDK.updateRoleForColumns(role, columns)
  }

  public async updateSessionForColumns(session: Session, columns: string[]) {
    return await this.sessionSDK.updateSessionForColumns(session, columns)
  }

  public async updateTokenForColumns(token: Token, columns: string[]) {
    return await this.tokenSDK.updateTokenForColumns(token, columns)
  }

  public async updateUserForColumns(user: User, columns: string[]) {
    return await this.userSDK.updateUserForColumns(user, columns)
  }

  public async getGlobalUsers() {
    return await this.userSDK.getGlobalUsers()
  }

  public async getSortedUsers(sorter: string, limit: number) {
    return await this.userSDK.getSortedUsers(sorter, limit)
  }

  public async getAccount() {
    return await this.userSDK.getAccount()
  }

  public async getUserByEmail(email: string) {
    return await this.userSDK.getUserByEmail(email)
  }

  public async getUserByPhone(phone: string) {
    return await this.userSDK.getUserByPhone(phone)
  }

  public async getUserByUserId(userId: string) {
    return await this.userSDK.getUserByUserId(userId)
  }

  public async updateUserById(id: string, user: User) {
    return await this.userSDK.updateUserById(id, user)
  }

  public async updateUserByUserId(owner: string, userId: string, user: User) {
    return await this.userSDK.updateUserByUserId(owner, userId, user)
  }

  public async checkUserPassword(user: User) {
    return await this.userSDK.checkUserPassword(user)
  }

  public async getGlobalCerts() {
    return await this.certSDK.getGlobalCerts()
  }

  public async getOrganizationNames() {
    return await this.organizationSDK.getOrganizationNames()
  }

  public async getOrganizationApplications() {
    return await this.applicationSDK.getOrganizationApplications()
  }

  public async getPermissionsByRole(name: string) {
    return await this.permissionSDK.getPermissionsByRole(name)
  }

  public async getUserPayments(userName: string) {
    return await this.paymentSDK.getUserPayments(userName)
  }

  public async notifyPayment(payment: Payment) {
    return await this.paymentSDK.notifyPayment(payment)
  }

  public async invoicePayment(payment: Payment) {
    return await this.paymentSDK.invoicePayment(payment)
  }

  public async introspectToken(token: string, tokenTypeHint: string) {
    return await this.tokenSDK.introspectToken(token, tokenTypeHint)
  }

  public async removePolicy(enforcer: Enforcer, policy: Policy) {
    return await this.policySDK.removePolicy(enforcer, policy)
  }

  public async getFilteredPolicies(
    enforcerId: string,
    filters: PolicyFilter[],
  ) {
    return await this.policySDK.getFilteredPolicies(enforcerId, filters)
  }

  public async sendEmailByProvider(email: Email, provider: string) {
    return await this.emailSDK.sendEmailByProvider(email, provider)
  }

  public async sendSmsByProvider(sms: Sms, provider: string) {
    return await this.smsSDK.sendSmsByProvider(sms, provider)
  }

  public async sendNotification(notification: Notification) {
    return await this.notificationSDK.sendNotification(notification)
  }

  public async uploadResourceEx(
    user: string,
    tag: string,
    parent: string,
    fullFilePath: string,
    file: any,
    createdTime?: string,
    description?: string,
  ) {
    return await this.resourceSDK.uploadResourceEx(
      user,
      tag,
      parent,
      fullFilePath,
      file,
      createdTime,
      description,
    )
  }

  public async getPaginationResources(
    owner: string,
    user: string,
    field: string,
    value: string,
    pageSize: number,
    page: number,
    sortField: string,
    sortOrder: string,
  ) {
    return await this.resourceSDK.getPaginationResources(
      owner,
      user,
      field,
      value,
      pageSize,
      page,
      sortField,
      sortOrder,
    )
  }

  public async getResourceEx(owner: string, name: string) {
    return await this.resourceSDK.getResourceEx(owner, name)
  }

  public async deleteResourceWithTag(resource: Resource, tag: string) {
    return await this.resourceSDK.deleteResourceWithTag(resource, tag)
  }

  public async getInvitations() {
    return await this.invitationSDK.getInvitations()
  }

  public async getPaginationInvitations(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.invitationSDK.getPaginationInvitations(
      p,
      pageSize,
      queryMap,
    )
  }

  public async getInvitation(name: string) {
    return await this.invitationSDK.getInvitation(name)
  }

  public async addInvitation(invitation: Invitation) {
    return await this.invitationSDK.addInvitation(invitation)
  }

  public async updateInvitation(invitation: Invitation) {
    return await this.invitationSDK.updateInvitation(invitation)
  }

  public async deleteInvitation(invitation: Invitation) {
    return await this.invitationSDK.deleteInvitation(invitation)
  }

  public async getOrders() {
    return await this.orderSDK.getOrders()
  }

  public async getPaginationOrders(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.orderSDK.getPaginationOrders(p, pageSize, queryMap)
  }

  public async getOrder(name: string) {
    return await this.orderSDK.getOrder(name)
  }

  public async addOrder(order: Order) {
    return await this.orderSDK.addOrder(order)
  }

  public async updateOrder(order: Order) {
    return await this.orderSDK.updateOrder(order)
  }

  public async deleteOrder(order: Order) {
    return await this.orderSDK.deleteOrder(order)
  }

  public async getTransactions() {
    return await this.transactionSDK.getTransactions()
  }

  public async getPaginationTransactions(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.transactionSDK.getPaginationTransactions(
      p,
      pageSize,
      queryMap,
    )
  }

  public async getTransaction(name: string) {
    return await this.transactionSDK.getTransaction(name)
  }

  public async addTransaction(transaction: Transaction) {
    return await this.transactionSDK.addTransaction(transaction)
  }

  public async updateTransaction(transaction: Transaction) {
    return await this.transactionSDK.updateTransaction(transaction)
  }

  public async deleteTransaction(transaction: Transaction) {
    return await this.transactionSDK.deleteTransaction(transaction)
  }

  public async updateInvitationForColumns(
    invitation: Invitation,
    columns: string[],
  ) {
    return await this.invitationSDK.updateInvitationForColumns(
      invitation,
      columns,
    )
  }

  public async getInvitationInfo(code: string, applicationName: string) {
    return await this.invitationSDK.getInvitationInfo(code, applicationName)
  }

  public async getUserOrders(userName: string) {
    return await this.orderSDK.getUserOrders(userName)
  }

  public async placeOrder(productInfos: ProductInfo[], userName?: string) {
    return await this.orderSDK.placeOrder(productInfos, userName)
  }

  public async payOrder(orderName: string, providerName: string) {
    return await this.orderSDK.payOrder(orderName, providerName)
  }

  public async buyProduct(
    name: string,
    providerName: string,
    userName?: string,
  ) {
    return await this.orderSDK.buyProduct(name, providerName, userName)
  }

  public async cancelOrder(name: string) {
    return await this.orderSDK.cancelOrder(name)
  }

  public async getUserTransactions(userName: string) {
    return await this.transactionSDK.getUserTransactions(userName)
  }

  public async addTransactionWithDryRun(
    transaction: Transaction,
    dryRun: boolean,
  ) {
    return await this.transactionSDK.addTransactionWithDryRun(
      transaction,
      dryRun,
    )
  }

  public async getLdaps() {
    return await this.ldapSDK.getLdaps()
  }

  public async getLdap(id: string) {
    return await this.ldapSDK.getLdap(id)
  }

  public async addLdap(ldap: Ldap) {
    return await this.ldapSDK.addLdap(ldap)
  }

  public async updateLdap(ldap: Ldap) {
    return await this.ldapSDK.updateLdap(ldap)
  }

  public async deleteLdap(ldap: Ldap) {
    return await this.ldapSDK.deleteLdap(ldap)
  }

  public async getLdapUsers(id: string) {
    return await this.ldapSDK.getLdapUsers(id)
  }

  public async syncLdapUsers(id: string, users: LdapUser[]) {
    return await this.ldapSDK.syncLdapUsers(id, users)
  }

  public async syncLdapUsersFromServer(id: string) {
    return await this.ldapSDK.syncLdapUsersFromServer(id)
  }

  public async getRecords() {
    return await this.recordSDK.getRecords()
  }

  public async getPaginationRecords(
    p: number,
    pageSize: number,
    queryMap: Record<string, string> = {},
  ) {
    return await this.recordSDK.getPaginationRecords(p, pageSize, queryMap)
  }

  public async getRecord(name: string) {
    return await this.recordSDK.getRecord(name)
  }

  public async addRecord(record: CasdoorRecord) {
    return await this.recordSDK.addRecord(record)
  }

  public getSignUpUrl(enablePassword: boolean, redirectUri: string) {
    return this.urlSDK.getSignUpUrl(enablePassword, redirectUri)
  }

  public getSignInUrl(redirectUri: string) {
    return this.urlSDK.getSignInUrl(redirectUri)
  }

  public getUserProfileUrl(userName: string, accessToken?: string) {
    return this.urlSDK.getUserProfileUrl(userName, accessToken)
  }

  public getMyProfileUrl(accessToken?: string) {
    return this.urlSDK.getMyProfileUrl(accessToken)
  }
}
