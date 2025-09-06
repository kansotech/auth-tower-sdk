import { BaseClient } from './base-client';
import { GrantAccessRequest, AddResourceRequest } from './types';
export declare class AccessClient extends BaseClient {
    grantAccess(request: GrantAccessRequest): Promise<any>;
    addResource(request: AddResourceRequest): Promise<any>;
}
