"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantClient = void 0;
const base_client_1 = require("./base-client");
class TenantClient extends base_client_1.BaseClient {
    async getTenants(pagination) {
        return this.request('tenants', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            pagination,
        });
    }
    async getTenant(tenantId) {
        return this.request(`tenants/${tenantId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
    }
    async createTenant(request) {
        return this.request('tenants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: request,
        });
    }
}
exports.TenantClient = TenantClient;
