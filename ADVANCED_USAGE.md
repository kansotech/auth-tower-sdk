# Auth Tower SDK - Advanced Token Management Guide

This guide shows how to use the new advanced token management features in the Auth Tower SDK, including multi-tenant support and automatic token handling.

## Quick Start

### Basic Usage with Automatic Token Management

```typescript
import { AuthTowerSDK, TokenManager, BrowserTokenStorage } from 'auth-tower-sdk';

// Create SDK with automatic token management
const config = {
  tenantId: 'your-tenant-id',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
};

const sdk = new AuthTowerSDK(config);
const tokenManager = new TokenManager(config, {
  storage: new BrowserTokenStorage(), // Stores tokens in localStorage
  autoRefresh: true, // Automatically refresh tokens before expiry
  refreshThreshold: 300 // Refresh 5 minutes before expiry
});

sdk.setTokenManager(tokenManager);

// Now all API calls will automatically use stored tokens
const tenants = await sdk.getTenants();
```

### Multi-Tenant Context Switching

```typescript
// Switch to a different tenant
await tokenManager.switchTenant('different-tenant-id');
sdk.setTenantId('different-tenant-id');

// Or use the SDK method which updates both
sdk.setTenantId('different-tenant-id');

// Check which tenants have stored tokens
const contexts = await tokenManager.getTenantContexts();
contexts.forEach(ctx => {
  console.log(`Tenant ${ctx.tenantId}: User authenticated = ${ctx.hasUserToken}`);
});
```

### OAuth Flow with Automatic Token Storage

```typescript
// Step 1: Initiate OAuth
const authUrl = await sdk.auth.initiateAuth({
  provider: 'google',
  redirect_uri: 'https://your-app.com/callback'
});

// Redirect user to authUrl...

// Step 2: Handle callback (tokens are automatically stored)
const urlParams = new URLSearchParams(window.location.search);
const state = urlParams.get('state');
if (state) {
  await sdk.auth.exchangeTokens({ state });
  // Tokens are now automatically stored for the current tenant
}

// Check if user is authenticated
const isAuthenticated = await tokenManager.isAuthenticated();
const user = await tokenManager.getCurrentUser();
```

## Advanced Usage

### Using AuthManager for State Management

```typescript
import { createAuthManager, BrowserTokenStorage } from 'auth-tower-sdk';

const authManager = createAuthManager(config, {
  storage: new BrowserTokenStorage()
});

// Initialize
await authManager.initialize();

// Subscribe to authentication state changes
const unsubscribe = authManager.subscribe((state) => {
  console.log('Auth state changed:', {
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    currentTenant: state.currentTenantId,
    availableTenants: state.availableTenants
  });
});

// Use the auth manager
const authUrl = await authManager.getState().initiateAuth('google', 'https://your-app.com/callback');
```

### Custom Token Storage

```typescript
import { TokenStorage, TokenData, ClientCredentialsTokenData } from 'auth-tower-sdk';

// Implement custom storage (e.g., encrypted database)
class DatabaseTokenStorage implements TokenStorage {
  async getUserToken(tenantId: string): Promise<TokenData | null> {
    // Implement your database query
    return await db.getUserToken(tenantId);
  }

  async setUserToken(tenantId: string, token: TokenData): Promise<void> {
    // Implement your database save
    await db.saveUserToken(tenantId, token);
  }

  // Implement other required methods...
}

const tokenManager = new TokenManager(config, {
  storage: new DatabaseTokenStorage()
});
```

### Server-Side Usage

```typescript
import { AuthTowerSDK, TokenManager, MemoryTokenStorage } from 'auth-tower-sdk';

// For server-side, use memory storage or your own persistent storage
const tokenManager = new TokenManager(config, {
  storage: new MemoryTokenStorage(),
  autoRefresh: true
});

const sdk = new AuthTowerSDK(config);
sdk.setTokenManager(tokenManager);

// Get client credentials token for server-to-server communication
await sdk.auth.getToken();

// Now all API calls will use the client credentials token
const tenants = await sdk.getTenants();
```

## Token Storage Options

### BrowserTokenStorage (Default for Web)
- Stores tokens in localStorage
- Automatically handles token expiry
- Encrypted option available with SecureTokenStorage wrapper

### MemoryTokenStorage (Default for Server)
- Stores tokens in memory only
- Tokens are lost when application restarts
- Good for server-side or temporary usage

### SecureTokenStorage (Production Recommended)
- Wraps any storage with encryption
- Protects tokens at rest
- Requires encryption key

```typescript
import { SecureTokenStorage, BrowserTokenStorage } from 'auth-tower-sdk';

const secureStorage = new SecureTokenStorage(
  new BrowserTokenStorage(),
  'your-encryption-key'
);

const tokenManager = new TokenManager(config, {
  storage: secureStorage
});
```

## React Integration Example

```typescript
// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthManager, createAuthManager } from 'auth-tower-sdk';

const AuthContext = createContext<AuthManager | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authManager, setAuthManager] = useState<AuthManager | null>(null);

  useEffect(() => {
    const manager = createAuthManager({
      tenantId: 'your-tenant-id',
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret'
    });
    
    manager.initialize().then(() => {
      setAuthManager(manager);
    });

    return () => manager.destroy();
  }, []);

  return (
    <AuthContext.Provider value={authManager}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Usage in component
const LoginComponent = () => {
  const authManager = useAuth();
  const [authState, setAuthState] = useState(authManager.getState());

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, [authManager]);

  const handleLogin = async () => {
    const authUrl = await authState.initiateAuth('google', window.location.origin + '/callback');
    window.location.href = authUrl;
  };

  if (authState.isLoading) return <div>Loading...</div>;
  if (authState.isAuthenticated) return <div>Welcome, {authState.user?.name}</div>;

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
      
      {/* Tenant switcher */}
      {authState.availableTenants.length > 1 && (
        <select 
          value={authState.currentTenantId}
          onChange={(e) => authState.switchTenant(e.target.value)}
        >
          {authState.availableTenants.map(tenant => (
            <option key={tenant.tenantId} value={tenant.tenantId}>
              {tenant.tenantId} ({tenant.user?.name})
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
```

## Migration from Previous Version

If you're upgrading from a previous version:

### Before (Manual Token Management)
```typescript
const sdk = new AuthTowerSDK(config);
const authConfig = await sdk.auth.getToken();
sdk.setAuthConfig(authConfig);
```

### After (Automatic Token Management)
```typescript
const sdk = new AuthTowerSDK(config);
const tokenManager = new TokenManager(config);
sdk.setTokenManager(tokenManager);

// Tokens are now automatically managed
// No need to manually call getToken() or setAuthConfig()
```

## Security Best Practices

1. **Use SecureTokenStorage** in production with a strong encryption key
2. **Implement proper key management** for encryption keys
3. **Clear tokens on logout** using `tokenManager.clearTenantTokens()` or `clearAllTokens()`
4. **Validate token expiry** in your application logic
5. **Use HTTPS** for all communications
6. **Implement proper CSRF protection** for OAuth callbacks

## Error Handling

```typescript
try {
  await sdk.auth.exchangeTokens({ state });
} catch (error) {
  if (error.message.includes('401')) {
    // Token expired, clear stored tokens
    await tokenManager.clearTenantTokens();
    // Redirect to login
  } else {
    console.error('Authentication error:', error);
  }
}
```

The SDK will automatically handle token refresh for 401 errors when possible, but you should still implement proper error handling for edge cases.