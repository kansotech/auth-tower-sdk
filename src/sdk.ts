import { SDKConfig, AccountData } from './types';
import { AuthClient } from './auth-client';
import { TenantClient } from './tenant-client';
import { PermissionClient } from './permission-client';
import { RoleClient } from './role-client';
import { AccountClient } from './account-client';
import { AccessClient } from './access-client';
import { PaginationUtils } from './pagination';
import { IDProviderClient } from './id-provider-client';
import { TokenManager } from './token-manager';
import { MemoryTokenStorage, BrowserTokenStorage } from './token-storage';

export class AuthTowerSDK {
  public auth: AuthClient;
  public tenants: TenantClient;
  public permissions: PermissionClient;
  public roles: RoleClient;
  public accounts: AccountClient;
  public access: AccessClient;
  public pagination: typeof PaginationUtils;
  public idProviderClient: IDProviderClient;
  public config: SDKConfig;
  private tokenManager?: TokenManager;

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
    this.idProviderClient = new IDProviderClient(config);
    this.pagination = PaginationUtils;
  }

  setTokenManager(tokenManager: TokenManager): void {
    this.tokenManager = tokenManager;

    // Set token manager on all clients
    this.auth.setTokenManager(tokenManager);
    this.tenants.setTokenManager(tokenManager);
    this.permissions.setTokenManager(tokenManager);
    this.roles.setTokenManager(tokenManager);
    this.accounts.setTokenManager(tokenManager);
    this.access.setTokenManager(tokenManager);
    this.idProviderClient.setTokenManager(tokenManager);
  }

  getTokenManager(): TokenManager | undefined {
    return this.tokenManager;
  }

  /**
   * Initialize SDK for server-side usage with client credentials
   * Requires clientId and clientSecret, sets up memory token storage
   */
  async initializeServer(): Promise<void> {
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('Auth Tower SDK: clientId and clientSecret are required for server initialization');
    }

    // Set up memory token storage for server
    const tokenManager = new TokenManager(this.config, {
      storage: new MemoryTokenStorage(),
      autoRefresh: true
    });

    this.setTokenManager(tokenManager);

    // Get client credentials token (automatically stored by TokenManager)
    await this.auth.getToken();
  }

  /**
   * Initialize SDK for client-side usage
   * Sets up browser token storage for persistent token management
   */
  async initializeClient(): Promise<void> {
    // Set up browser token storage for client
    const tokenManager = new TokenManager(this.config, {
      storage: new BrowserTokenStorage(),
      autoRefresh: true,
      refreshThreshold: 300 // 5 minutes before expiry
    });

    this.setTokenManager(tokenManager);
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

  /**
   * Switch to a different tenant
   * @param tenantId - The tenant ID to switch to
   * @returns Promise<boolean> - true if switch succeeded, false if login is needed
   */
  async switchTenant(tenantId: string): Promise<void> {
    if (this.tokenManager) {
      await this.tokenManager.switchTenant(tenantId);
    }
  }

  async getCurrentTenantId(): Promise<string | null> {
    if (this.tokenManager) {
      return this.tokenManager.getCurrentTenantId();
    }
    return null;
  }
  
  /**
   * Check if user is authenticated for the current tenant
   * @param tenantId - Optional tenant ID to check (defaults to current tenant)
   * @returns Promise<boolean> - true if user is logged in, false otherwise
   */
  async isLoggedIn(tenantId ?: string): Promise < boolean > {
      if(!this.tokenManager) {
      // Without token manager, we can't determine authentication status
      return false;
    }

    try {
      const targetTenantId = tenantId || this.config.tenantId;
      return await this.tokenManager.isAuthenticated(targetTenantId);
    } catch (error) {
      console.error('Failed to check authentication status:', error);
      return false;
    }
  }

  /**
   * Get account/user data from stored tokens
   * @param tenantId - Optional tenant ID to get data for (defaults to current tenant)
   * @returns Promise<AccountData | null> - user information if available, null otherwise
   */
  async getAccountData(tenantId?: string): Promise<AccountData | null> {
    if (!this.tokenManager) {
      // Without token manager, we can't access stored user data
      return null;
    }

    try {
      const targetTenantId = tenantId || this.config.tenantId;
      const userData = await this.tokenManager.getCurrentUser(targetTenantId);
      return userData || null;
    } catch (error) {
      console.error('Failed to get account data:', error);
      return null;
    }
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
