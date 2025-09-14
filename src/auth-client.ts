import { BaseClient } from './base-client';
import { AuthConfig, AuthInitiateRequest, AuthInitiateResponse, ExchangeTokenRequest, ExchangeTokenResponse, RefreshTokenRequest, LogoutRequest, LogoutResponse } from './types';

export class AuthClient extends BaseClient {
  async initiateAuth(request: AuthInitiateRequest): Promise<AuthInitiateResponse> {
    return this.request('auth/oauth/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      tenantIndependent: true,
      body: {
        ...request,
        tenant_id: request.tenant_id || this.tokenManager?.getInitialTenantId()
      },
    });
  }

  /**
   * Exchange OAuth state for access tokens securely
   * @param request - Contains the state ID received from OAuth callback
   * @returns Promise containing access tokens and user information
   */
  async exchangeTokens(request: ExchangeTokenRequest): Promise<ExchangeTokenResponse> {
    const response = await this.request('auth/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      tenantIndependent: true,
      body: request,
    });

    // Automatically store the tokens if token manager is available
    if (this.tokenManager) {
      await this.tokenManager.storeUserToken(this.tokenManager?.getInitialTenantId(), response);
    }

    return response;
  }

  /**
   * Refresh access token using refresh token
   * @param request - Contains the refresh token
   * @returns Promise containing new access tokens and user information
   */
  async refreshToken(request: RefreshTokenRequest): Promise<ExchangeTokenResponse> {
    const response = await this.request('auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      tenantIndependent: true,
      body: request,
    });

    // Automatically store the refreshed tokens if token manager is available
    if (this.tokenManager) {
      await this.tokenManager.storeUserToken(this.tokenManager?.getInitialTenantId(), response);
    }

    return response;
  }

  /**
   * Logout user and invalidate tokens
   * @param request - Optional refresh token to blacklist
   * @returns Promise containing logout confirmation
   */
  async logout(request?: LogoutRequest): Promise<LogoutResponse> {
    // Get refresh token from storage if not provided
    let logoutRequest = request;
    if (!logoutRequest?.refresh_token && this.tokenManager) {
      const userToken = await this.tokenManager.getUserToken();
      if (userToken?.refresh_token) {
        logoutRequest = { refresh_token: userToken.refresh_token };
      }
    }

    const response = await this.request('auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      tenantIndependent: true,
      body: logoutRequest || {},
    });

    // Clear stored tokens after successful logout
    if (this.tokenManager) {
      await this.tokenManager.clearTenantTokens();
    }

    return response;
  }

  async getToken(): Promise<AuthConfig> {
    const response = await this.request('auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      tenantIndependent: true,
      body: {
        client_id: this.clientID,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials',
        tenant_id: this.tokenManager?.getInitialTenantId() || '' // Use configured tenant if not specified
      },
    });

    // Automatically store the client credentials token if token manager is available
    if (this.tokenManager) {
      await this.tokenManager.storeClientToken(this.tokenManager?.getInitialTenantId(), response);
    }

    return response;
  }
}
