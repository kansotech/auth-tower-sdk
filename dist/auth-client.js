"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthClient = void 0;
const base_client_1 = require("./base-client");
class AuthClient extends base_client_1.BaseClient {
    async initiateAuth(request) {
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
exports.AuthClient = AuthClient;
