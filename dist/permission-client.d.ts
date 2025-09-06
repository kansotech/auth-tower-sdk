import { BaseClient } from './base-client';
import { CreatePermissionRequest, PaginationParams, PaginatedResponse } from './types';
export declare class PermissionClient extends BaseClient {
    getPermissions(tenantId?: string, pagination?: PaginationParams): Promise<PaginatedResponse>;
    getPermission(permissionId: string, tenantId?: string): Promise<any>;
    createPermission(request: CreatePermissionRequest, tenantId?: string): Promise<any>;
    deletePermission(permissionId: string, tenantId?: string): Promise<any>;
}
