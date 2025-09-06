import { BaseClient } from './base-client';
import { CreateAccountRequest, PaginationParams, PaginatedResponse } from './types';

export class AccountClient extends BaseClient {
  async getAccounts(pagination?: PaginationParams): Promise<PaginatedResponse> {
    return this.request('accounts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      pagination,
    });
  }

  async createAccount(request: CreateAccountRequest): Promise<any> {
    return this.request('accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: request,
    });
  }
}
