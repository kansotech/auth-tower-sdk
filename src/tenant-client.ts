import { BaseClient } from './base-client';
import { CreateTenantRequest, PaginationParams, PaginatedResponse } from './types';

export class TenantClient extends BaseClient {
  async getTenants(pagination?: PaginationParams): Promise<PaginatedResponse> {
    return this.request('tenants', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      pagination,
    });
  }

  async getTenant(tenantId: string): Promise<any> {
    return this.request(`tenants/${tenantId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async createTenant(request: CreateTenantRequest): Promise<any> {
    return this.request('tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: request,
    });
  }
}
