"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessClient = void 0;
const base_client_1 = require("./base-client");
class AccessClient extends base_client_1.BaseClient {
    async grantAccess(request) {
        return this.request('access/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: request,
        });
    }
    async addResource(request) {
        return this.request('resources/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: request,
        });
    }
}
exports.AccessClient = AccessClient;
