"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountClient = void 0;
const base_client_1 = require("./base-client");
class AccountClient extends base_client_1.BaseClient {
    async getAccounts(pagination) {
        return this.request('accounts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            pagination,
        });
    }
    async createAccount(request) {
        return this.request('accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: request,
        });
    }
}
exports.AccountClient = AccountClient;
