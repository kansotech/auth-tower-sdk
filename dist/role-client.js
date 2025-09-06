"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleClient = void 0;
const base_client_1 = require("./base-client");
class RoleClient extends base_client_1.BaseClient {
    async getRoles(tenantId, pagination) {
        const tenant = tenantId || this.config.tenantId;
        if (!tenant)
            throw new Error('Tenant ID is required');
        return this.request(`tenants/${tenant}/roles`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            pagination,
        });
    }
    async createRole(request, tenantId) {
        const tenant = tenantId || this.config.tenantId;
        if (!tenant)
            throw new Error('Tenant ID is required');
        return this.request(`tenants/${tenant}/roles`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: request,
        });
    }
}
exports.RoleClient = RoleClient;
