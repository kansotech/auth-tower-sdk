import { SDKConfig, QueryOptions, PaginationParams } from './types';

export class BaseClient {
  protected config: SDKConfig;
  protected baseURL: string;
  protected pathPrefix: string;

  constructor(config: SDKConfig) {
    this.config = config;
    // Default to Auth Tower SaaS URL if not provided
    this.baseURL = config.baseURL || 'https://api.auth-tower.com';
    this.pathPrefix = config.pathPrefix || '/api/v1/';
  }

  protected async request(path: string, options: QueryOptions = {}): Promise<any> {
    if (!options.headers) {
      options.headers = {};
    }

    // Use tenant and client credentials for authentication
    options.headers['X-Tenant-ID'] = this.config.tenantId;
    options.headers['X-Client-ID'] = this.config.clientId;
    options.headers['Authorization'] = `Bearer ${this.config.clientSecret}`;
    options.headers['Content-Type'] = 'application/json';
    
    const url = new URL(path, `${this.baseURL}${this.pathPrefix}`);
    
    // Add pagination parameters to URL if provided
    if (options.pagination) {
      url.searchParams.set('limit', options.pagination.limit.toString());
      url.searchParams.set('offset', options.pagination.offset.toString());
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
