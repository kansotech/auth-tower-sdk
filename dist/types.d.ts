export interface SDKConfig {
    baseURL?: string;
    pathPrefix?: string;
    tenantId: string;
    clientId: string;
    clientSecret: string;
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
export interface AuthInitiateRequest {
    tenant_id?: string;
    redirect_uri: string;
    provider: string;
}
export interface AuthInitiateResponse {
    auth_url: string;
}
export interface CreateTenantRequest {
    auth_providers: string[];
    name: string;
    description: string;
    redirect_uris: string[];
}
export interface CreatePermissionRequest {
    name: string;
    description: string;
}
export interface CreateRoleRequest {
    name: string;
    description: string;
    permission_ids: string[];
}
export interface CreateAccountRequest {
    name: string;
    description: string;
}
export interface GrantAccessRequest {
    access_request: {
        object_id: string;
        account_id: string;
        access_type: string;
    };
    role_id: string;
}
export interface AddResourceRequest {
    is_public: boolean;
}
