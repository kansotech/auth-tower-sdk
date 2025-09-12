import { BaseClient } from './base-client';
import { CreateRoleRequest, PaginationParams, PaginatedResponse } from './types';

export class RoleClient extends BaseClient {
  async getRoles(pagination?: PaginationParams): Promise<PaginatedResponse> {
    return this.request('roles', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      pagination,
    });
  }

  async createRole(request: CreateRoleRequest): Promise<any> {

    return this.request('roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: request,
    });
  }

  async deleteRole(id: string): Promise<any> {

    return this.request(`roles/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async updateRole(id: string, request: CreateRoleRequest): Promise<any> {
    return this.request(`roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: request,
    });
  }
}
