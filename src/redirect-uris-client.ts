import { BaseClient } from './base-client';
import { CreateRoleRequest, PaginationParams, PaginatedResponse } from './types';

export class RedirectURIsClient extends BaseClient {
  async getRedirectURIs(pagination?: PaginationParams): Promise<PaginatedResponse> {
    return this.request('redirect-uris', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      pagination,
    });
  }

  async addRedirectURI(request: CreateRoleRequest): Promise<any> {

    return this.request('redirect-uris', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: request,
    });
  }

  async deleteRedirectURI(id: string): Promise<any> {

    return this.request(`redirect-uris/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  }

}
