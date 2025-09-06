"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthTowerSDK = void 0;
const auth_client_1 = require("./auth-client");
const tenant_client_1 = require("./tenant-client");
const permission_client_1 = require("./permission-client");
const role_client_1 = require("./role-client");
const account_client_1 = require("./account-client");
const access_client_1 = require("./access-client");
const pagination_1 = require("./pagination");
class AuthTowerSDK {
    constructor(config) {
        // Pagination helpers (for backwards compatibility)
        this.createPagination = pagination_1.PaginationUtils.createPagination;
        this.getNextPage = pagination_1.PaginationUtils.getNextPage;
        this.getPreviousPage = pagination_1.PaginationUtils.getPreviousPage;
        this.hasNextPage = pagination_1.PaginationUtils.hasNextPage;
        this.hasPreviousPage = pagination_1.PaginationUtils.hasPreviousPage;
        this.getTotalPages = pagination_1.PaginationUtils.getTotalPages;
        this.getCurrentPage = pagination_1.PaginationUtils.getCurrentPage;
        // Validate required configuration
        if (!config.tenantId) {
            throw new Error('Auth Tower SDK: tenantId is required');
        }
        if (!config.clientId) {
            throw new Error('Auth Tower SDK: clientId is required');
        }
        if (!config.clientSecret) {
            throw new Error('Auth Tower SDK: clientSecret is required');
        }
        this.auth = new auth_client_1.AuthClient(config);
        this.tenants = new tenant_client_1.TenantClient(config);
        this.permissions = new permission_client_1.PermissionClient(config);
        this.roles = new role_client_1.RoleClient(config);
        this.accounts = new account_client_1.AccountClient(config);
        this.access = new access_client_1.AccessClient(config);
        this.pagination = pagination_1.PaginationUtils;
    }
    // Convenience methods for backwards compatibility
    async initiateAuth(...args) {
        return this.auth.initiateAuth(...args);
    }
    async getTenants(...args) {
        return this.tenants.getTenants(...args);
    }
    async getTenant(...args) {
        return this.tenants.getTenant(...args);
    }
    async createTenant(...args) {
        return this.tenants.createTenant(...args);
    }
    async getPermissions(...args) {
        return this.permissions.getPermissions(...args);
    }
    async getPermission(...args) {
        return this.permissions.getPermission(...args);
    }
    async createPermission(...args) {
        return this.permissions.createPermission(...args);
    }
    async deletePermission(...args) {
        return this.permissions.deletePermission(...args);
    }
    async getRoles(...args) {
        return this.roles.getRoles(...args);
    }
    async createRole(...args) {
        return this.roles.createRole(...args);
    }
    async getAccounts(...args) {
        return this.accounts.getAccounts(...args);
    }
    async createAccount(...args) {
        return this.accounts.createAccount(...args);
    }
    async grantAccess(...args) {
        return this.access.grantAccess(...args);
    }
    async addResource(...args) {
        return this.access.addResource(...args);
    }
    // Utility methods
    setClientSecret(clientSecret) {
        this.auth.setClientSecret(clientSecret);
        this.tenants.setClientSecret(clientSecret);
        this.permissions.setClientSecret(clientSecret);
        this.roles.setClientSecret(clientSecret);
        this.accounts.setClientSecret(clientSecret);
        this.access.setClientSecret(clientSecret);
    }
    setTenantId(tenantId) {
        this.auth.setTenantId(tenantId);
        this.tenants.setTenantId(tenantId);
        this.permissions.setTenantId(tenantId);
        this.roles.setTenantId(tenantId);
        this.accounts.setTenantId(tenantId);
        this.access.setTenantId(tenantId);
    }
    getConfig() {
        return this.auth.getConfig();
    }
}
exports.AuthTowerSDK = AuthTowerSDK;
