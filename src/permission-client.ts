import { BaseClient } from './base-client';
import { CreatePermissionRequest, PaginationParams, PaginatedResponse } from './types';

export class PermissionClient extends BaseClient {
  async getPermissions(tenantId?: string, pagination?: PaginationParams): Promise<PaginatedResponse> {
    const tenant = tenantId || this.config.tenantId;
    if (!tenant) throw new Error('Tenant ID is required');
    
    return this.request(`tenants/${tenant}/permissions`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      pagination,
    });
  }

  async getPermission(permissionId: string, tenantId?: string): Promise<any> {
    const tenant = tenantId || this.config.tenantId;
    if (!tenant) throw new Error('Tenant ID is required');
    
    return this.request(`tenants/${tenant}/permissions/${permissionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async createPermission(request: CreatePermissionRequest, tenantId?: string): Promise<any> {
    const tenant = tenantId || this.config.tenantId;
    if (!tenant) throw new Error('Tenant ID is required');
    
    return this.request(`tenants/${tenant}/permissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: request,
    });
  }

  async deletePermission(permissionId: string, tenantId?: string): Promise<any> {
    const tenant = tenantId || this.config.tenantId;
    if (!tenant) throw new Error('Tenant ID is required');
    
    return this.request(`tenants/${tenant}/permissions/${permissionId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
