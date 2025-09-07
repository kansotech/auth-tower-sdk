import { BaseClient } from './base-client';
import { AuthConfig, AuthInitiateRequest, AuthInitiateResponse, ExchangeTokenRequest, ExchangeTokenResponse, RefreshTokenRequest, LogoutRequest, LogoutResponse } from './types';

export class AuthClient extends BaseClient {
  async initiateAuth(request: AuthInitiateRequest): Promise<AuthInitiateResponse> {
    return this.request('auth/oauth/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      tenantScoped: false,
      body: {
        ...request,
        tenant_id: request.tenant_id || this.config.tenantId // Use configured tenant if not specified
      },
    });
  }

  /**
   * Exchange OAuth state for access tokens securely
   * @param request - Contains the state ID received from OAuth callback
   * @returns Promise containing access tokens and user information
   */
  async exchangeTokens(request: ExchangeTokenRequest): Promise<ExchangeTokenResponse> {
    return this.request('auth/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      tenantScoped: false,
      body: request,
    });
  }

  /**
   * Refresh access token using refresh token
   * @param request - Contains the refresh token
   * @returns Promise containing new access tokens and user information
   */
  async refreshToken(request: RefreshTokenRequest): Promise<ExchangeTokenResponse> {
    return this.request('auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      tenantScoped: false,
      body: request,
    });
  }

  /**
   * Logout user and invalidate tokens
   * @param request - Optional refresh token to blacklist
   * @returns Promise containing logout confirmation
   */
  async logout(request?: LogoutRequest): Promise<LogoutResponse> {
    return this.request('auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      tenantScoped: false,
      body: request || {},
    });
  }

  async getToken(): Promise<AuthConfig> {
    return this.request('auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      tenantScoped: false,
      body: {
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        grant_type: 'client_credentials',
        tenant_id: this.config.tenantId // Use configured tenant if not specified
      },
    });
  }
}
