import { BaseClient } from './base-client';
import { CreateAccountRequest, PaginationParams, PaginatedResponse } from './types';
export declare class AccountClient extends BaseClient {
    getAccounts(pagination?: PaginationParams): Promise<PaginatedResponse>;
    createAccount(request: CreateAccountRequest): Promise<any>;
}
