import { BaseClient } from './base-client';
import { CreateTenantRequest, PaginationParams, PaginatedResponse, TenantResponse, TenantContext } from './types';

export class TenantClient extends BaseClient {
  async getTenants(pagination?: PaginationParams): Promise<PaginatedResponse<TenantResponse>> {
    return this.request('tenants', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      tenantIndependent: true,
      pagination,
    });
  }

  async getChildrenTenants(pagination?: PaginationParams): Promise<PaginatedResponse<TenantResponse>> {
    return this.request(`children`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      pagination,
    });
  }

  async getTenant(tenantId: string): Promise<TenantContext> {
    return this.request(`tenants/${tenantId}`, {
      method: 'GET',
      tenantIndependent: true,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async createTenant(request: CreateTenantRequest): Promise<TenantResponse> {
    return this.request('tenants', {
      method: 'POST',
      tenantIndependent: true,
      headers: { 'Content-Type': 'application/json' },
      body: request,
    });
  }
}
