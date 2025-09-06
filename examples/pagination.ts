import { AuthTowerSDK } from '../src';

// Example: Pagination handling
async function paginationExample() {
  const authTower = new AuthTowerSDK({
    tenantId: 'your-tenant-id',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
  });

  try {
    console.log('=== Pagination Example ===\n');

    // Get first page
    let pagination = authTower.pagination.createPagination(5, 0);
    let pageNumber = 1;

    while (true) {
      console.log(`Fetching page ${pageNumber}...`);
      const response = await authTower.tenants.getTenants(pagination);
      
      console.log(`Page ${authTower.pagination.getCurrentPage(response)} of ${authTower.pagination.getTotalPages(response)}`);
      console.log(`Items ${response.offset + 1}-${response.offset + response.data.length} of ${response.total} total`);
      
      // Display items
      response.data.forEach((tenant: any, index: number) => {
        console.log(`  ${response.offset + index + 1}. ${tenant.name || tenant.id}`);
      });

      // Check if there are more pages
      if (!authTower.pagination.hasNextPage(response)) {
        console.log('\n✅ Reached the last page');
        break;
      }

      // Get next page
      pagination = authTower.pagination.getNextPage(pagination);
      pageNumber++;

      // Stop after 3 pages for demo
      if (pageNumber > 3) {
        console.log('\n⏹️ Stopping demo after 3 pages');
        break;
      }

      console.log(''); // Empty line between pages
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

// Example: Get all items across all pages
async function getAllItemsExample() {
  const authTower = new AuthTowerSDK({
    baseURL: 'https://your-auth-tower-instance.com',
    pathPrefix: '/api/v1/',
    tenantId: 'your-tenant-id',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
  });

  try {
    console.log('\n=== Get All Items Example ===\n');

    const allTenants: any[] = [];
    let pagination = authTower.pagination.createPagination(50, 0); // Large page size for efficiency

    while (true) {
      const response = await authTower.tenants.getTenants(pagination);
      allTenants.push(...response.data);
      
      console.log(`Loaded ${response.data.length} items (${allTenants.length}/${response.total} total)`);

      if (!authTower.pagination.hasNextPage(response)) {
        break;
      }

      pagination = authTower.pagination.getNextPage(pagination);
    }

    console.log(`\n✅ Successfully loaded all ${allTenants.length} tenants`);
    return allTenants;

  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Run the examples
async function runExamples() {
  await paginationExample();
  await getAllItemsExample();
}

runExamples();
