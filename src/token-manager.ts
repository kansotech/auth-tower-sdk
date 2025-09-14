import { TokenStorage, TokenData, ClientCredentialsTokenData, MemoryTokenStorage } from './token-storage';
import { SDKConfig, ExchangeTokenResponse } from './types';

export interface TokenManagerConfig {
  storage?: TokenStorage;
  autoRefresh?: boolean;
  refreshThreshold?: number; // Seconds before expiry to trigger refresh
}

export interface TenantContextInfo {
  tenantId: string;
  hasUserToken: boolean;
  hasClientToken: boolean;
  userTokenExpiry?: Date;
  clientTokenExpiry?: Date;
  user?: TokenData['user'];
}

/**
 * TokenManager handles automatic token storage, retrieval, and refresh
 * Supports multi-tenant context switching
 */
export class TokenManager {
  private storage: TokenStorage;
  private autoRefresh: boolean;
  private refreshThreshold: number;
  private initialTenantID: string;
  private initialConfig: SDKConfig;
  private currentTenantID: string;
  private refreshPromises = new Map<string, Promise<boolean>>();

  constructor(config: SDKConfig, options: TokenManagerConfig = {}) {
    this.initialConfig = config;
    this.storage = options.storage || new MemoryTokenStorage();
    this.autoRefresh = options.autoRefresh ?? true;
    this.refreshThreshold = options.refreshThreshold ?? 300; // 5 minutes default
    this.initialTenantID = config.tenantId;
    this.currentTenantID = this.initialTenantID;
    this.storage.getCurrentTenantID().then(tenantId => {
      this.currentTenantID = tenantId || this.initialTenantID;
    });
  }

  /**
   * Switch to a different tenant context
   */
  async switchTenant(tenantId: string): Promise<void> {
    this.currentTenantID = tenantId;
  }

  /**
   * Get initial tenant ID
   */
  getInitialTenantId(): string {
    return this.initialTenantID;
  }

  /**
   * Get current tenant ID
   */
  getCurrentTenantId(): string {
    return this.currentTenantID;
  }

  /**
   * Store user token (from OAuth exchange or refresh)
   */
  async storeUserToken(tenantId: string, tokenResponse: ExchangeTokenResponse): Promise<void> {
    const tokenData: TokenData = {
      access_token: tokenResponse.access_token,
      refresh_token: tokenResponse.refresh_token,
      token_type: tokenResponse.token_type,
      expires_in: tokenResponse.expires_in,
      expires_at: Date.now() + (tokenResponse.expires_in * 1000),
      user: tokenResponse.user
    };

    await this.storage.setUserToken(tenantId, tokenData);
  }

  /**
   * Store client credentials token
   */
  async storeClientToken(tenantId: string, tokenResponse: { access_token: string; expires_in: number }): Promise<void> {
    const tokenData: ClientCredentialsTokenData = {
      access_token: tokenResponse.access_token,
      token_type: 'Bearer',
      expires_in: tokenResponse.expires_in,
      expires_at: Date.now() + (tokenResponse.expires_in * 1000)
    };

    await this.storage.setClientToken(tenantId, tokenData);
  }

  /**
   * Get valid access token for current tenant
   * Automatically refreshes if needed and possible
   */
  async getValidToken(tenantId?: string): Promise<string | null> {
    const targetTenantId = tenantId || this.initialTenantID;

    // Try user token first
    let userToken = await this.storage.getUserToken(targetTenantId);
    if (userToken) {
      if (this.isTokenExpiringSoon(userToken.expires_at)) {
        if (this.autoRefresh) {
          const refreshed = await this.refreshUserToken(targetTenantId, userToken.refresh_token);
          if (refreshed) {
            userToken = await this.storage.getUserToken(targetTenantId);
          }
        }
      }

      if (userToken && !this.isTokenExpired(userToken.expires_at)) {
        return userToken.access_token;
      }
    }

    // Fall back to client token
    let clientToken = await this.storage.getClientToken(targetTenantId);
    if (clientToken) {
      if (this.isTokenExpiringSoon(clientToken.expires_at)) {
        if (this.autoRefresh) {
          const refreshed = await this.refreshClientToken(targetTenantId);
          if (refreshed) {
            clientToken = await this.storage.getClientToken(targetTenantId);
          }
        }
      }

      if (clientToken && !this.isTokenExpired(clientToken.expires_at)) {
        return clientToken.access_token;
      }
    }

    return null;
  }

  /**
   * Get user token data for current tenant
   */
  async getUserToken(tenantId?: string): Promise<TokenData | null> {
    const targetTenantId = tenantId || this.initialTenantID;
    return await this.storage.getUserToken(targetTenantId);
  }

  /**
   * Remove all tokens for a tenant (logout)
   */
  async clearTenantTokens(tenantId?: string): Promise<void> {
    const targetTenantId = tenantId || this.initialTenantID;
    await this.storage.removeUserToken(targetTenantId);
    await this.storage.removeClientToken(targetTenantId);
  }

  /**
   * Clear all tokens from storage
   */
  async clearAllTokens(): Promise<void> {
    await this.storage.clear();
  }

  /**
   * Check if user is authenticated for current tenant
   */
  async isAuthenticated(tenantId?: string): Promise<boolean> {
    const token = await this.getValidToken(tenantId);
    return !!token;
  }

  /**
   * Get current user info
   */
  async getCurrentUser(tenantId?: string): Promise<TokenData['user'] | null> {
    const userToken = await this.getUserToken(tenantId);
    return userToken?.user || null;
  }

  /**
   * Refresh user token using refresh token
   */
  private async refreshUserToken(tenantId: string, refreshToken: string): Promise<boolean> {
    const refreshKey = `user_${tenantId}`;

    // Prevent multiple concurrent refresh attempts for the same token
    if (this.refreshPromises.has(refreshKey)) {
      return await this.refreshPromises.get(refreshKey)!;
    }

    const refreshPromise = this.performUserTokenRefresh(tenantId, refreshToken);
    this.refreshPromises.set(refreshKey, refreshPromise);

    try {
      const result = await refreshPromise;
      return result;
    } finally {
      this.refreshPromises.delete(refreshKey);
    }
  }

  private async performUserTokenRefresh(tenantId: string, refreshToken: string): Promise<boolean> {
    try {
      // This would typically make an API call to refresh the token
      // For now, we'll need to integrate this with the AuthClient
      const response = await fetch(`${this.initialConfig.baseURL || 'https://api.auth-tower.com'}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId,
          'X-Client-ID': this.initialConfig.clientId || ''
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (!response.ok) {
        // Refresh failed - remove invalid token
        await this.storage.removeUserToken(tenantId);
        return false;
      }

      const tokenResponse: ExchangeTokenResponse = await response.json();
      await this.storeUserToken(tenantId, tokenResponse);
      return true;
    } catch (error) {
      console.error('Failed to refresh user token:', error);
      await this.storage.removeUserToken(tenantId);
      return false;
    }
  }

  /**
   * Refresh client credentials token
   */
  private async refreshClientToken(tenantId: string): Promise<boolean> {
    const refreshKey = `client_${tenantId}`;

    // Prevent multiple concurrent refresh attempts for the same token
    if (this.refreshPromises.has(refreshKey)) {
      return await this.refreshPromises.get(refreshKey)!;
    }

    const refreshPromise = this.performClientTokenRefresh(tenantId);
    this.refreshPromises.set(refreshKey, refreshPromise);

    try {
      const result = await refreshPromise;
      return result;
    } finally {
      this.refreshPromises.delete(refreshKey);
    }
  }

  private async performClientTokenRefresh(tenantId: string): Promise<boolean> {
    try {
      if (!this.initialConfig.clientId || !this.initialConfig.clientSecret) {
        return false;
      }

      const response = await fetch(`${this.initialConfig.baseURL || 'https://api.auth-tower.com'}/api/v1/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Tenant-ID': tenantId,
          'X-Client-ID': this.initialConfig.clientId
        },
        body: JSON.stringify({
          client_id: this.initialConfig.clientId,
          client_secret: this.initialConfig.clientSecret,
          grant_type: 'client_credentials',
          tenant_id: tenantId
        })
      });

      if (!response.ok) {
        // Refresh failed - remove invalid token
        await this.storage.removeClientToken(tenantId);
        return false;
      }

      const tokenResponse = await response.json();
      await this.storeClientToken(tenantId, tokenResponse);
      return true;
    } catch (error) {
      console.error('Failed to refresh client token:', error);
      await this.storage.removeClientToken(tenantId);
      return false;
    }
  }

  private isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt;
  }

  private isTokenExpiringSoon(expiresAt: number): boolean {
    const timeUntilExpiry = (expiresAt - Date.now()) / 1000;
    return timeUntilExpiry <= this.refreshThreshold;
  }

  /**
   * Set custom storage backend
   */
  setStorage(storage: TokenStorage): void {
    this.storage = storage;
  }

  /**
   * Get current storage backend
   */
  getStorage(): TokenStorage {
    return this.storage;
  }

  /**
   * Enable or disable auto-refresh
   */
  setAutoRefresh(enabled: boolean): void {
    this.autoRefresh = enabled;
  }

  /**
   * Set refresh threshold (seconds before expiry)
   */
  setRefreshThreshold(seconds: number): void {
    this.refreshThreshold = seconds;
  }
}