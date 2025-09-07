import { BaseClient } from './base-client';
import { CreateTenantRequest, PaginationParams, PaginatedResponse, TenantResponse } from './types';

export class TenantClient extends BaseClient {
  async getTenants(pagination?: PaginationParams): Promise<PaginatedResponse<TenantResponse[]>> {
    return this.request('tenants', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      tenantScoped: false,
      pagination,
    });
  }

  async getTenant(tenantId: string): Promise<TenantResponse> {
    return this.request(`tenants/${tenantId}`, {
      method: 'GET',
          tenantScoped: false,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async createTenant(request: CreateTenantRequest): Promise<TenantResponse> {
    return this.request('tenants', {
      method: 'POST',
            tenantScoped: false,
      headers: { 'Content-Type': 'application/json' },
      body: request,
    });
  }
}
