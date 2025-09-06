import { BaseClient } from './base-client';
import { AuthInitiateRequest, AuthInitiateResponse } from './types';
export declare class AuthClient extends BaseClient {
    initiateAuth(request: AuthInitiateRequest): Promise<AuthInitiateResponse>;
}
