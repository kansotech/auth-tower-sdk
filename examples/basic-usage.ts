import { AuthTowerSDK } from '../src';

// Example: Basic usage of Auth Tower SDK
async function basicExample() {
  // Initialize the SDK
  const authTower = new AuthTowerSDK({
    tenantId: 'your-tenant-id',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
  });

  try {
    // Get tenants with pagination
    const pagination = authTower.pagination.createPagination(10, 0);
    const tenants = await authTower.tenants.getTenants(pagination);
    console.log('Tenants:', tenants);

    // Get permissions for the default tenant
    const permissions = await authTower.permissions.getPermissions();
    console.log('Permissions:', permissions);

    // Create a new permission
    const newPermission = await authTower.permissions.createPermission({
      name: 'read_reports',
      description: 'Can read financial reports'
    });
    console.log('Created permission:', newPermission);

    // Create a role with the permission
    const newRole = await authTower.roles.createRole({
      name: 'Report Viewer',
      description: 'Can view reports',
      permission_ids: [newPermission.id]
    });
    console.log('Created role:', newRole);

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
basicExample();
