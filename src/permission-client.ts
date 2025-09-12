import { BaseClient } from './base-client';
import { CreatePermissionRequest, PaginationParams, PaginatedResponse } from './types';

export class PermissionClient extends BaseClient {
  async getPermissions(pagination?: PaginationParams): Promise<PaginatedResponse> {
    return this.request('permissions', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      pagination,
      tenantScoped: true,
    });
  }

  async getPermission(permissionId: string): Promise<any> {
    return this.request(`permissions/${permissionId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      tenantScoped: true,
    });
  }

  async createPermission(request: CreatePermissionRequest): Promise<any> {

    return this.request('permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: request,
            tenantScoped: true,
    });
  }

  async deletePermission(permissionId: string): Promise<any> {

    return this.request(`permissions/${permissionId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
            tenantScoped: true,
    });
  }

  async updatePermission(permissionId: string, request: CreatePermissionRequest): Promise<any> {
    return this.request(`permissions/${permissionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: request,
            tenantScoped: true,
    });
  }
}
