import { SDKConfig, QueryOptions } from './types';
import { TokenManager } from './token-manager';

export class BaseClient {
  protected baseURL: string;
  protected pathPrefix: string;
  protected clientID?: string;
  protected clientSecret?: string;
  protected tokenManager?: TokenManager;

  constructor(config: SDKConfig) {
    this.baseURL = config.baseURL || 'https://www.api.auth-tower.com';
    this.pathPrefix = config.pathPrefix || '/api/v1/';
    this.clientID = config.clientId;
    this.clientSecret = config.clientSecret;
  }

  setTokenManager(tokenManager: TokenManager): void {
    this.tokenManager = tokenManager;
  }

  protected async request(path: string, options: QueryOptions = {}): Promise<any> {
    console.log(`Query Options:`, options);
    if (!options.headers) {
      options.headers = {};
    }
    const tenantID = options.tenantID || this.tokenManager?.getCurrentTenantId();

    // Use tenant and client credentials for authentication
    options.headers['X-Tenant-ID'] = tenantID ?? '';
    options.headers['X-Client-ID'] = this.clientID ?? '';

    // Get access token from token manager
    if (this.tokenManager) {
      const validToken = await this.tokenManager.getValidToken();
      if (validToken) {
        options.headers['Authorization'] = `Bearer ${validToken}`;
      }
    }

    options.headers['Content-Type'] = 'application/json';

    // Default is tenant scoped
    const tenantScoped = !options.tenantIndependent;

    // Build URL using the native URL constructor - much simpler!
    const baseUrl = new URL(this.pathPrefix, this.baseURL);


    let finalPath: string;
    if (tenantScoped) {
      finalPath = `tenants/${tenantID}/${path}`;
    } else {
      finalPath = path;
    }

    const url = new URL(finalPath, baseUrl);

    // Add pagination parameters to URL if provided
    if (options.pagination) {
      url.searchParams.set('limit', options.pagination.limit.toString());
      url.searchParams.set('offset', options.pagination.offset.toString());
      if (options.pagination.query != null && options.pagination.query !== '') {
        url.searchParams.set('query', options.pagination.query);
      }
    }

    console.log(`Fetching URL: ${url.toString()}`);

    try {
      const response = await fetch(url.toString(), {
        method: options.method || 'GET',
        headers: options.headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        // Handle token expiry - try to refresh if possible
        if (response.status === 401 && this.tokenManager) {
          const refreshed = await this.tryRefreshToken();
          if (refreshed) {
            // Retry the request with the new token
            const newToken = await this.tokenManager.getValidToken();
            if (newToken) {
              options.headers['Authorization'] = `Bearer ${newToken}`;
              const retryResponse = await fetch(url.toString(), {
                method: options.method || 'GET',
                headers: options.headers,
                body: options.body ? JSON.stringify(options.body) : undefined,
              });

              if (retryResponse.ok) {
                const data = await retryResponse.json();
                console.log(data);
                return data;
              }
            }
          }
        }

        throw new Error(`Auth Tower API Error: ${response.status} ${response.statusText} - ${await response.text()}`);
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Auth Tower API Error:', error);
      throw error;
    }
  }

  private async tryRefreshToken(): Promise<boolean> {
    if (!this.tokenManager) return false;

    try {
      const userToken = await this.tokenManager.getUserToken();
      if (userToken?.refresh_token) {
        // Try to refresh user token
        const response = await fetch(`${this.baseURL}${this.pathPrefix}auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant-ID': this.tokenManager?.getInitialTenantId() || '',
            'X-Client-ID': this.clientID || ''
          },
          body: JSON.stringify({ refresh_token: userToken.refresh_token })
        });

        if (response.ok) {
          const tokenResponse = await response.json();
          await this.tokenManager.storeUserToken(this.tokenManager?.getInitialTenantId(), tokenResponse);
          return true;
        }
      }

      // Fall back to client credentials if available
      if (this.clientID && this.clientSecret) {
        const response = await fetch(`${this.baseURL}${this.pathPrefix}auth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Tenant-ID': this.tokenManager?.getInitialTenantId() || '',
            'X-Client-ID': this.clientID || ''
          },
          body: JSON.stringify({
            client_id: this.clientID,
            client_secret: this.clientSecret,
            grant_type: 'client_credentials',
            tenant_id: this.tokenManager?.getInitialTenantId() || ''
          })
        });

        if (response.ok) {
          const tokenResponse = await response.json();
          await this.tokenManager.storeClientToken(this.tokenManager?.getInitialTenantId(), tokenResponse);
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
    }

    return false;
  }
}
