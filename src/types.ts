// Core configuration and shared types
export interface SDKConfig {
  baseURL?: string; // Defaults to Auth Tower SaaS
  pathPrefix?: string; // Defaults to '/api/v1/'
  tenantId: string; // Required: Your tenant identifier
  clientId: string; // Required: Your client ID
  clientSecret: string; // Required: Your client secret
}

export interface QueryOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  pagination?: PaginationParams;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T = any> {
  data: T;
  total: number;
  limit: number;
  offset: number;
}

// Auth types
export interface AuthInitiateRequest {
  tenant_id?: string; // Optional: defaults to configured tenant
  redirect_uri: string;
  provider: string;
}

export interface AuthInitiateResponse {
  auth_url: string;
}

// Tenant types
export interface CreateTenantRequest {
  auth_providers: string[];
  name: string;
  description: string;
  redirect_uris: string[];
}

// Permission types
export interface CreatePermissionRequest {
  name: string;
  description: string;
}

// Role types
export interface CreateRoleRequest {
  name: string;
  description: string;
  permission_ids: string[];
}

// Account types
export interface CreateAccountRequest {
  name: string;
  description: string;
}

// Access types
export interface GrantAccessRequest {
  access_request: {
    object_id: string;
    account_id: string;
    access_type: string;
  };
  role_id: string;
}

// Resource types
export interface AddResourceRequest {
  is_public: boolean;
}
