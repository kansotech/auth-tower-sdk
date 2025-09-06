import { BaseClient } from './base-client';
import { CreateRoleRequest, PaginationParams, PaginatedResponse } from './types';
export declare class RoleClient extends BaseClient {
    getRoles(tenantId?: string, pagination?: PaginationParams): Promise<PaginatedResponse>;
    createRole(request: CreateRoleRequest, tenantId?: string): Promise<any>;
}
