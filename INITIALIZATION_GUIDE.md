# SDK Initialization Methods

The Auth Tower SDK now provides two specialized initialization methods for different environments:

## Server-Side Initialization

Use `initializeServer()` for backend applications, microservices, or any server-side code:

```typescript
import { AuthTowerSDK } from 'auth-tower-sdk';

const sdk = new AuthTowerSDK({
  tenantId: 'your-tenant-id',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});

// Initialize for server with memory storage and automatic client credentials
await sdk.initializeServer();

// Ready to make API calls - tokens are managed automatically
const tenants = await sdk.getTenants();
const permissions = await sdk.getPermissions();
```

**Features:**
- ✅ **Memory token storage** (tokens don't persist between restarts)
- ✅ **Automatic client credentials** token retrieval
- ✅ **Auto-refresh** enabled
- ✅ **Requires** `clientId` and `clientSecret`

## Client-Side Initialization

Use `initializeClient()` for frontend applications, mobile apps, or browser-based code:

```typescript
import { AuthTowerSDK } from 'auth-tower-sdk';

const sdk = new AuthTowerSDK({
  tenantId: 'your-tenant-id',
  clientId: 'your-client-id' // clientSecret not needed for client-side
});

// Initialize for client with browser storage
await sdk.initializeClient();

// User needs to authenticate via OAuth
const authUrl = await sdk.initiateAuth({
  provider: 'google',
  redirect_uri: 'https://your-app.com/callback'
});

// After OAuth callback
await sdk.auth.exchangeTokens({ state: 'oauth-state' });

// Now can make authenticated API calls
const tenants = await sdk.getTenants();
```

**Features:**
- ✅ **Browser localStorage** token storage (persists between sessions)
- ✅ **OAuth flow** for user authentication
- ✅ **Auto-refresh** enabled (5-minute threshold)
- ✅ **No client secret** required
- ✅ **Persistent** token storage

## Tenant Switching

Both initialization methods support tenant switching:

```typescript
// Check if user has access to a tenant before switching
const canSwitch = await sdk.switchTenant('other-tenant-id');

if (canSwitch) {
  console.log('Successfully switched to other-tenant-id');
  // Make API calls for the new tenant
} else {
  console.log('User needs to authenticate for other-tenant-id');
  // Redirect to OAuth or handle authentication
}
```

## Usage Examples

### Express.js Server
```typescript
// server.js
import express from 'express';
import { AuthTowerSDK } from 'auth-tower-sdk';

const app = express();
const sdk = new AuthTowerSDK({
  tenantId: process.env.TENANT_ID,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Initialize once at startup
await sdk.initializeServer();

app.get('/api/tenants', async (req, res) => {
  try {
    const tenants = await sdk.getTenants();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### React Frontend
```typescript
// App.tsx
import { useState, useEffect } from 'react';
import { AuthTowerSDK } from 'auth-tower-sdk';

const sdk = new AuthTowerSDK({
  tenantId: 'your-tenant-id',
  clientId: 'your-client-id'
});

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeSDK = async () => {
      await sdk.initializeClient();
      setIsInitialized(true);
    };
    
    initializeSDK();
  }, []);

  const handleLogin = async () => {
    const authUrl = await sdk.initiateAuth({
      provider: 'google',
      redirect_uri: window.location.origin + '/callback'
    });
    window.location.href = authUrl;
  };

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}
```

### Next.js API Route
```typescript
// pages/api/tenants.ts
import { AuthTowerSDK } from 'auth-tower-sdk';

const sdk = new AuthTowerSDK({
  tenantId: process.env.TENANT_ID!,
  clientId: process.env.CLIENT_ID!,
  clientSecret: process.env.CLIENT_SECRET!
});

// Initialize once
let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    await sdk.initializeServer();
    initialized = true;
  }

  try {
    const tenants = await sdk.getTenants();
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Legacy Initialization

The original `initialize()` method is still available for backward compatibility:

```typescript
// Legacy method - still works
await sdk.initialize();
```

This is equivalent to `initializeServer()` but doesn't set up a token manager automatically.