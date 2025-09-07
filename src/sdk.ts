import { AuthConfig, SDKConfig } from './types';
import { AuthClient } from './auth-client';
import { TenantClient } from './tenant-client';
import { PermissionClient } from './permission-client';
import { RoleClient } from './role-client';
import { AccountClient } from './account-client';
import { AccessClient } from './access-client';
import { PaginationUtils } from './pagination';
import { AuthMethodClient } from './auth-method-client';

export class AuthTowerSDK {
  public auth: AuthClient;
  public tenants: TenantClient;
  public permissions: PermissionClient;
  public roles: RoleClient;
  public accounts: AccountClient;
  public access: AccessClient;
  public pagination: typeof PaginationUtils;
  public authMethods: AuthMethodClient;
  public config: SDKConfig;

  constructor(config: SDKConfig) {
    // Validate required configuration
    this.config = config;
    if (!config.tenantId) {
      throw new Error('Auth Tower SDK: tenantId is required');
    }

    this.auth = new AuthClient(config);
    this.tenants = new TenantClient(config);
    this.permissions = new PermissionClient(config);
    this.roles = new RoleClient(config);
    this.accounts = new AccountClient(config);
    this.access = new AccessClient(config);
    this.authMethods = new AuthMethodClient(config);
    this.pagination = PaginationUtils;
  }

  async initialize() {
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('Auth Tower SDK: clientId and clientSecret are required for initialization');
    }
       const authConfig = await this.auth.getToken();

    if (authConfig) {
      this.setAuthConfig(authConfig);
    }
  }

  setAuthConfig(authConfig: AuthConfig) {
    this.auth.setAuthConfig(authConfig);
    this.tenants.setAuthConfig(authConfig);
    this.permissions.setAuthConfig(authConfig);
    this.roles.setAuthConfig(authConfig);
    this.accounts.setAuthConfig(authConfig);
    this.access.setAuthConfig(authConfig);
    this.authMethods.setAuthConfig(authConfig);
  }
  
  // Convenience methods for backwards compatibility
  async initiateAuth(...args: Parameters<AuthClient['initiateAuth']>) {
    return this.auth.initiateAuth(...args);
  }

  async getTenants(...args: Parameters<TenantClient['getTenants']>) {
    return this.tenants.getTenants(...args);
  }

  async getTenant(...args: Parameters<TenantClient['getTenant']>) {
    return this.tenants.getTenant(...args);
  }

  async createTenant(...args: Parameters<TenantClient['createTenant']>) {
    return this.tenants.createTenant(...args);
  }

  async getPermissions(...args: Parameters<PermissionClient['getPermissions']>) {
    return this.permissions.getPermissions(...args);
  }

  async getPermission(...args: Parameters<PermissionClient['getPermission']>) {
    return this.permissions.getPermission(...args);
  }

  async createPermission(...args: Parameters<PermissionClient['createPermission']>) {
    return this.permissions.createPermission(...args);
  }

  async deletePermission(...args: Parameters<PermissionClient['deletePermission']>) {
    return this.permissions.deletePermission(...args);
  }

  async getRoles(...args: Parameters<RoleClient['getRoles']>) {
    return this.roles.getRoles(...args);
  }

  async createRole(...args: Parameters<RoleClient['createRole']>) {
    return this.roles.createRole(...args);
  }

  async getAccounts(...args: Parameters<AccountClient['getAccounts']>) {
    return this.accounts.getAccounts(...args);
  }

  async createAccount(...args: Parameters<AccountClient['createAccount']>) {
    return this.accounts.createAccount(...args);
  }

  async grantAccess(...args: Parameters<AccessClient['grantAccess']>) {
    return this.access.grantAccess(...args);
  }

  async addResource(...args: Parameters<AccessClient['addResource']>) {
    return this.access.addResource(...args);
  }

  // Utility methods
  setClientSecret(clientSecret: string): void {
    this.auth.setClientSecret(clientSecret);
    this.tenants.setClientSecret(clientSecret);
    this.permissions.setClientSecret(clientSecret);
    this.roles.setClientSecret(clientSecret);
    this.accounts.setClientSecret(clientSecret);
    this.access.setClientSecret(clientSecret);
  }

  setTenantId(tenantId: string): void {
    this.auth.setTenantId(tenantId);
    this.tenants.setTenantId(tenantId);
    this.permissions.setTenantId(tenantId);
    this.roles.setTenantId(tenantId);
    this.accounts.setTenantId(tenantId);
    this.access.setTenantId(tenantId);
  }

  getConfig(): SDKConfig {
    return this.auth.getConfig();
  }

  // Pagination helpers (for backwards compatibility)
  createPagination = PaginationUtils.createPagination;
  getNextPage = PaginationUtils.getNextPage;
  getPreviousPage = PaginationUtils.getPreviousPage;
  hasNextPage = PaginationUtils.hasNextPage;
  hasPreviousPage = PaginationUtils.hasPreviousPage;
  getTotalPages = PaginationUtils.getTotalPages;
  getCurrentPage = PaginationUtils.getCurrentPage;
}
