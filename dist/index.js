"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiTenancySDK = exports.PaginationUtils = exports.BaseClient = exports.AccessClient = exports.AccountClient = exports.RoleClient = exports.PermissionClient = exports.TenantClient = exports.AuthClient = exports.AuthTowerSDK = void 0;
// Main SDK exports
var sdk_1 = require("./sdk");
Object.defineProperty(exports, "AuthTowerSDK", { enumerable: true, get: function () { return sdk_1.AuthTowerSDK; } });
// Individual client exports for advanced usage
var auth_client_1 = require("./auth-client");
Object.defineProperty(exports, "AuthClient", { enumerable: true, get: function () { return auth_client_1.AuthClient; } });
var tenant_client_1 = require("./tenant-client");
Object.defineProperty(exports, "TenantClient", { enumerable: true, get: function () { return tenant_client_1.TenantClient; } });
var permission_client_1 = require("./permission-client");
Object.defineProperty(exports, "PermissionClient", { enumerable: true, get: function () { return permission_client_1.PermissionClient; } });
var role_client_1 = require("./role-client");
Object.defineProperty(exports, "RoleClient", { enumerable: true, get: function () { return role_client_1.RoleClient; } });
var account_client_1 = require("./account-client");
Object.defineProperty(exports, "AccountClient", { enumerable: true, get: function () { return account_client_1.AccountClient; } });
var access_client_1 = require("./access-client");
Object.defineProperty(exports, "AccessClient", { enumerable: true, get: function () { return access_client_1.AccessClient; } });
var base_client_1 = require("./base-client");
Object.defineProperty(exports, "BaseClient", { enumerable: true, get: function () { return base_client_1.BaseClient; } });
// Utilities
var pagination_1 = require("./pagination");
Object.defineProperty(exports, "PaginationUtils", { enumerable: true, get: function () { return pagination_1.PaginationUtils; } });
// Types
__exportStar(require("./types"), exports);
// Re-export for backwards compatibility
var sdk_2 = require("./sdk");
Object.defineProperty(exports, "MultiTenancySDK", { enumerable: true, get: function () { return sdk_2.AuthTowerSDK; } });
