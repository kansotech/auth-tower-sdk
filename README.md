# Auth Tower TypeScript SDK

Official TypeScript SDK for [Auth Tower](https://auth-tower.com) - Enterprise multi-tenant authentication and authorization SaaS platform.

[![npm version](https://badge.fury.io/js/@auth-tower%2Fsdk.svg)](https://badge.fury.io/js/@auth-tower%2Fsdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

## 🚀 About Auth Tower

Auth Tower is a centralized enterprise-grade SaaS platform that provides multi-tenant authentication and authorization for modern applications. All users connect to the same Auth Tower service using their unique tenant credentials (tenant ID, client ID, and client secret).

### 🌐 Centralized SaaS Architecture

```
Your Application                     Auth Tower SaaS
┌─────────────────┐                 ┌──────────────────────┐
│                 │                 │                      │
│  @auth-tower/   │    HTTPS        │  api.auth-tower.com  │
│  sdk            │◄───────────────►│                      │
│                 │                 │  ┌─────────────────┐ │
│ tenantId: abc   │                 │  │ Tenant: abc     │ │
│ clientId: xyz   │                 │  │ Tenant: def     │ │
│ clientSecret: * │                 │  │ Tenant: ghi     │ │
└─────────────────┘                 │  └─────────────────┘ │
                                    └──────────────────────┘
```

**Key Benefits:**
- ✅ **Tenant Isolation**: Each customer gets their own secure tenant space
- ✅ **Simple Credentials**: Just tenant ID, client ID, and client secret
- ✅ **Zero Infrastructure**: No need to deploy or manage Auth Tower yourself

## ✨ Features

- **🏗️ Enterprise Ready** - Built for production SaaS applications
- **🏢 Multi-Tenant** - Complete tenant isolation and management
- **📊 Scalable** - Built-in pagination for handling large datasets
- **🔒 Type Safe** - Full TypeScript support with comprehensive type definitions
- **⚡ Performance** - Optimized for high-throughput applications

## 📦 Installation

```bash
npm install @auth-tower/sdk
```

## 🎯 Quick Start

```typescript
import { AuthTowerSDK } from '@auth-tower/sdk';

// Initialize with your Auth Tower tenant credentials
const authTower = new AuthTowerSDK({
  tenantId: 'your-tenant-id',        // Your unique tenant identifier
  clientId: 'your-client-id',        // Your client ID from Auth Tower
  clientSecret: 'your-client-secret' // Your client secret from Auth Tower
  // baseURL defaults to https://api.auth-tower.com
  // pathPrefix defaults to /api/v1/
});

// All operations are scoped to your tenant automatically
const tenants = await authTower.tenants.getTenants();
const permissions = await authTower.permissions.getPermissions();
const roles = await authTower.roles.getRoles();
```

## 🏗️ SDK Architecture

The SDK is organized into focused modules for different Auth Tower capabilities:

```
@auth-tower/sdk
├── AuthClient          # OAuth flows and authentication
├── TenantClient        # Multi-tenant organization management
├── PermissionClient    # Fine-grained permission control
├── RoleClient          # Role-based access control (RBAC)
├── AccountClient       # User and application account management
├── AccessClient        # Resource access and authorization
└── PaginationUtils     # Efficient data pagination
```

## 📊 Handling Large Datasets

Efficiently work with large datasets using built-in pagination:

```typescript
// Create pagination parameters
const pagination = authTower.pagination.createPagination(50, 0);

// Get paginated results
const response = await authTower.tenants.getTenants(pagination);

console.log(`Page ${authTower.pagination.getCurrentPage(response)} of ${authTower.pagination.getTotalPages(response)}`);
console.log(`Showing ${response.data.length} of ${response.total} total items`);

// Navigate through pages
if (authTower.pagination.hasNextPage(response)) {
  const nextPage = authTower.pagination.getNextPage(pagination);
  const nextResponse = await authTower.tenants.getTenants(nextPage);
}
```

## 🔐 Authentication & OAuth

Implement OAuth flows for your application users:

```typescript
// Initiate OAuth authentication (tenant_id is optional - defaults to your configured tenant)
const authResponse = await authTower.auth.initiateAuth({
  redirect_uri: 'https://your-app.com/callback',
  provider: 'google'
  // tenant_id: 'specific-tenant' // Optional: override default tenant
});

// Redirect user to Auth Tower for authentication
window.location.href = authResponse.auth_url;
```

## 🏢 Multi-Tenant Management

Manage your application's tenants through Auth Tower SaaS:

```typescript
// Create a new tenant for your application
const newTenant = await authTower.tenants.createTenant({
  auth_providers: ['google', 'microsoft'],
  name: 'Acme Corporation',
  description: 'Enterprise tenant for Acme Corp',
  redirect_uris: ['https://acme.yourapp.com/callback']
});

// Get tenant details
const tenant = await authTower.tenants.getTenant('tenant-id');

// List all your tenants with pagination
const tenants = await authTower.tenants.getTenants(
  authTower.pagination.createPagination(25, 0)
);
```

## 🔑 Permissions & Roles (RBAC)

Implement fine-grained access control:

```typescript
// Create permissions for your application
await authTower.permissions.createPermission({
  name: 'reports:read',
  description: 'Can view financial reports'
}, 'tenant-id');

await authTower.permissions.createPermission({
  name: 'reports:write',
  description: 'Can create and edit reports'
}, 'tenant-id');

// Create roles with specific permissions
await authTower.roles.createRole({
  name: 'Report Manager',
  description: 'Full access to reporting features',
  permission_ids: ['permission-1', 'permission-2']
}, 'tenant-id');
```

## 🏭 Production Configuration

Configure the SDK for your production environment:

```typescript
const authTower = new AuthTowerSDK({
  tenantId: process.env.AUTH_TOWER_TENANT_ID,
  clientId: process.env.AUTH_TOWER_CLIENT_ID,
  clientSecret: process.env.AUTH_TOWER_CLIENT_SECRET,
  // Optional: override default Auth Tower SaaS URL (not typically needed)
  // baseURL: process.env.CUSTOM_AUTH_TOWER_URL,
  // pathPrefix: '/api/v1/'
});

// All operations are automatically scoped to your tenant
try {
  const tenants = await authTower.tenants.getTenants();
  // Process tenants...
} catch (error) {
  console.error('Auth Tower API Error:', error.message);
  // Handle error appropriately for your application
}
```

## 📋 TypeScript Support

Full type safety for your Auth Tower integration:

```typescript
import { 
  AuthTowerSDK, 
  SDKConfig, 
  PaginatedResponse,
  CreateTenantRequest 
} from '@auth-tower/sdk';

const config: SDKConfig = {
  tenantId: 'your-tenant-id',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
  // baseURL defaults to Auth Tower SaaS
};

const authTower = new AuthTowerSDK(config);

// Type-safe operations
const tenants: PaginatedResponse = await authTower.tenants.getTenants();
const newTenant: CreateTenantRequest = {
  auth_providers: ['google'],
  name: 'Customer Tenant',
  description: 'Tenant for customer XYZ',
  redirect_uris: ['https://customer.app.com/callback']
};
```

## 🆘 Support & Documentation

- 📧 **Enterprise Support**: support@auth-tower.com
- 📚 **Documentation**: https://docs.auth-tower.com
- 🌐 **Auth Tower Platform**: https://auth-tower.com
- 💬 **Sales & Demo**: support@auth-tower.com

**Need Auth Tower for your SaaS?** [Contact us](https://auth-tower.com/contact) for enterprise pricing and onboarding.
