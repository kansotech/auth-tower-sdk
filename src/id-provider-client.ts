import { BaseClient } from './base-client';
import { GetAuthMethodsResponse as GetIDProvidersResponse } from './types';

export class IDProviderClient extends BaseClient {
  async getActiveProviders(tenantID?: string): Promise<GetIDProvidersResponse> {

    return this.request('active-id-providers', {
      method: 'GET',
      tenantID: tenantID,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async getAvailableProviders(): Promise<{ providers: string[] }> {
    return this.request('available-id-providers', {
      method: 'GET',
      tenantIndependent: true,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  async updateProvider(providerName: string, active: boolean): Promise<void> {
    return this.request(`id-providers/${providerName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: {
        active,
      },
    });
  }
}
