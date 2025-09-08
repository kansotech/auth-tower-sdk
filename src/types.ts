// Core configuration and shared types
export interface SDKConfig {
  baseURL?: string; // Defaults to Auth Tower SaaS
  pathPrefix?: string; // Defaults to '/api/v1/'
  tenantId: string; // Required: Your tenant identifier
  clientId?: string; // Optional: Your client ID
  clientSecret?: string; // Optional: Your client secret
}

export interface AuthConfig {
  access_token: string;
  refresh_token: string;
}

export interface QueryOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  tenantScoped?: boolean;
  pagination?: PaginationParams;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
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
  tenant_id: string;
}

// Token exchange types
export interface ExchangeTokenRequest {
  state: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LogoutRequest {
  refresh_token?: string;
}

export interface LogoutResponse {
  message: string;
}

export interface ExchangeTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    provider: string;
    role_id: string;
    tenant_id: string;
  };
}

// Tenant types
export interface CreateTenantRequest {
  auth_providers: string[];
  name: string;
  description: string;
  redirect_uris: string[];
}

export interface TenantResponse {
  id: string;
  name: string;
  description?: string;
  redirect_uris?: string[];
  parent_id?: string;
  parent?: TenantResponse;
  children?: TenantResponse[];
  created_at: string; // ISO 8601 date string
  updated_at?: string; // ISO 8601 date string
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

export interface GetAuthMethodsRequest {
  tenant_id?: string; // Optional: defaults to configured tenant
}

export interface GetAuthMethodsResponse {
  methods: Array<{
    id: string;
    name: string;
    tenant_id: string;
  }>;
}