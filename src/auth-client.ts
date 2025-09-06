import { BaseClient } from './base-client';
import { AuthInitiateRequest, AuthInitiateResponse } from './types';

export class AuthClient extends BaseClient {
  async initiateAuth(request: AuthInitiateRequest): Promise<AuthInitiateResponse> {
    return this.request('auth/oauth/initiate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        ...request,
        tenant_id: request.tenant_id || this.config.tenantId // Use configured tenant if not specified
      },
    });
  }
}
