import { BaseClient } from './base-client';
import { CreateRoleRequest, PaginationParams, PaginatedResponse } from './types';

export class RoleClient extends BaseClient {
  async getRoles(tenantId?: string, pagination?: PaginationParams): Promise<PaginatedResponse> {
    const tenant = tenantId || this.config.tenantId;
    if (!tenant) throw new Error('Tenant ID is required');
    
    return this.request(`tenants/${tenant}/roles`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      pagination,
    });
  }

  async createRole(request: CreateRoleRequest, tenantId?: string): Promise<any> {
    const tenant = tenantId || this.config.tenantId;
    if (!tenant) throw new Error('Tenant ID is required');
    
    return this.request(`tenants/${tenant}/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: request,
    });
  }
}
