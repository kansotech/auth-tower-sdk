"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionClient = void 0;
const base_client_1 = require("./base-client");
class PermissionClient extends base_client_1.BaseClient {
    async getPermissions(tenantId, pagination) {
        const tenant = tenantId || this.config.tenantId;
        if (!tenant)
            throw new Error('Tenant ID is required');
        return this.request(`tenants/${tenant}/permissions`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            pagination,
        });
    }
    async getPermission(permissionId, tenantId) {
        const tenant = tenantId || this.config.tenantId;
        if (!tenant)
            throw new Error('Tenant ID is required');
        return this.request(`tenants/${tenant}/permissions/${permissionId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
    }
    async createPermission(request, tenantId) {
        const tenant = tenantId || this.config.tenantId;
        if (!tenant)
            throw new Error('Tenant ID is required');
        return this.request(`tenants/${tenant}/permissions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: request,
        });
    }
    async deletePermission(permissionId, tenantId) {
        const tenant = tenantId || this.config.tenantId;
        if (!tenant)
            throw new Error('Tenant ID is required');
        return this.request(`tenants/${tenant}/permissions/${permissionId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
exports.PermissionClient = PermissionClient;
