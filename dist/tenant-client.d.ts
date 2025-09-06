import { BaseClient } from './base-client';
import { CreateTenantRequest, PaginationParams, PaginatedResponse } from './types';
export declare class TenantClient extends BaseClient {
    getTenants(pagination?: PaginationParams): Promise<PaginatedResponse>;
    getTenant(tenantId: string): Promise<any>;
    createTenant(request: CreateTenantRequest): Promise<any>;
}
