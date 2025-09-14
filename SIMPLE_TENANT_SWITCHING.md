# Simple Tenant Switching

Here's how to use the simplified tenant switching functionality:

## Basic Usage

```typescript
import { AuthTowerSDK, TokenManager, BrowserTokenStorage } from 'auth-tower-sdk';

// Setup SDK with token manager for automatic token storage
const config = {
  tenantId: 'tenant-1',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
};

const sdk = new AuthTowerSDK(config);
const tokenManager = new TokenManager(config, {
  storage: new BrowserTokenStorage()
});
sdk.setTokenManager(tokenManager);

// User logs in to tenant-1 (tokens are automatically stored)
const authUrl = await sdk.initiateAuth({
  provider: 'google',
  redirect_uri: 'https://your-app.com/callback'
});

// After OAuth callback
await sdk.auth.exchangeTokens({ state: 'oauth-state-from-callback' });

// Now switch to a different tenant
const switchSuccess = await sdk.switchTenant('tenant-2');
if (switchSuccess) {
  console.log('Successfully switched to tenant-2');
  // User is authenticated for tenant-2, can make API calls
  const tenants = await sdk.getTenants();
} else {
  console.log('Need to login to tenant-2 first');
  // Redirect user to login for tenant-2
  const authUrl = await sdk.initiateAuth({
    provider: 'google',
    redirect_uri: 'https://your-app.com/callback',
    tenant_id: 'tenant-2'
  });
  window.location.href = authUrl;
}
```

## Without Token Manager (Manual Mode)

```typescript
// If you don't use token manager, switchTenant just changes the tenant ID
const sdk = new AuthTowerSDK(config);

// This will always return true and just change the tenant context
const switched = await sdk.switchTenant('tenant-2');
console.log(switched); // true

// You need to handle authentication manually
const authConfig = await sdk.auth.getToken();
sdk.setAuthConfig(authConfig);
```

## React Example

```typescript
const TenantSwitcher = () => {
  const [currentTenant, setCurrentTenant] = useState('tenant-1');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleTenantSwitch = async (tenantId: string) => {
    const success = await sdk.switchTenant(tenantId);
    if (success) {
      setCurrentTenant(tenantId);
      setIsLoggedIn(true);
    } else {
      // Need to login to this tenant
      setIsLoggedIn(false);
      const authUrl = await sdk.initiateAuth({
        provider: 'google',
        redirect_uri: window.location.origin + '/callback',
        tenant_id: tenantId
      });
      window.location.href = authUrl;
    }
  };

  return (
    <div>
      <p>Current tenant: {currentTenant}</p>
      <button onClick={() => handleTenantSwitch('tenant-1')}>
        Switch to Tenant 1
      </button>
      <button onClick={() => handleTenantSwitch('tenant-2')}>
        Switch to Tenant 2
      </button>
      {!isLoggedIn && <p>Please login to access this tenant</p>}
    </div>
  );
};
```

The `switchTenant` method returns:
- `true`: Switch successful, user is authenticated for the target tenant
- `false`: User needs to login to the target tenant first