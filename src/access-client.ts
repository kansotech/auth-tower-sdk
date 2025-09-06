import { BaseClient } from './base-client';
import { GrantAccessRequest, AddResourceRequest } from './types';

export class AccessClient extends BaseClient {
  async grantAccess(request: GrantAccessRequest): Promise<any> {
    return this.request('access/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: request,
    });
  }

  async addResource(request: AddResourceRequest): Promise<any> {
    return this.request('resources/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: request,
    });
  }
}
