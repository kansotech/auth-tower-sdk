import { BaseClient } from './base-client';
import { GetAuthMethodsResponse } from './types';

export class AuthMethodClient extends BaseClient {
  async getActiveMethods(): Promise<GetAuthMethodsResponse> {
    return this.request('auth-methods/', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getAvailableMethods(): Promise<GetAuthMethodsResponse> {
    return this.request('auth-methods/', {
      method: 'GET',
      tenantScoped: false,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
