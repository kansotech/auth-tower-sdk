import { SDKConfig, QueryOptions, AuthConfig } from './types';

export class BaseClient {
  protected config: SDKConfig;
  protected baseURL: string;
  protected pathPrefix: string;
  protected authConfig?: AuthConfig;

  constructor(config: SDKConfig) {
    this.config = config;
    // Default to Auth Tower SaaS URL if not provided
    this.baseURL = config.baseURL || 'https://api.auth-tower.com';
    this.pathPrefix = config.pathPrefix || '/api/v1/';
  }

  setAuthConfig(authConfig: AuthConfig) {
    this.authConfig = authConfig;
  }

  protected async request(path: string, options: QueryOptions = {}): Promise<any> {
    console.log(`Query Options:`, options);
    if (!options.headers) {
      options.headers = {};
    }

    // Use tenant and client credentials for authentication
    options.headers['X-Tenant-ID'] = this.config.tenantId;
    options.headers['X-Client-ID'] = this.config.clientId ?? "";
    options.headers['Authorization'] = `Bearer ${this.authConfig?.access_token}`;
    options.headers['Content-Type'] = 'application/json';
    
    // Default is tenant scoped
    const tenantScoped = options.tenantScoped == null || options.tenantScoped;
    
    // Build URL using the native URL constructor - much simpler!
    const baseUrl = new URL(this.pathPrefix, this.baseURL);
    
    let finalPath: string;
    if (tenantScoped) {
      finalPath = `tenants/${this.config.tenantId}/${path}`;
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

  // Configuration methods
  setClientSecret(clientSecret: string): void {
    this.config.clientSecret = clientSecret;
  }

  setTenantId(tenantId: string): void {
    this.config.tenantId = tenantId;
  }

  getConfig(): SDKConfig {
    return { ...this.config };
  }
}
