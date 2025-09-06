import { SDKConfig, QueryOptions } from './types';
export declare class BaseClient {
    protected config: SDKConfig;
    protected baseURL: string;
    protected pathPrefix: string;
    constructor(config: SDKConfig);
    protected request(path: string, options?: QueryOptions): Promise<any>;
    setClientSecret(clientSecret: string): void;
    setTenantId(tenantId: string): void;
    getConfig(): SDKConfig;
}
