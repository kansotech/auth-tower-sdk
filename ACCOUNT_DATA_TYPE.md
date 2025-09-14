# AccountData Type Usage Examples

The `AccountData` type is now available for use throughout your application when working with user account information.

## Type Definition

```typescript
export interface AccountData {
  id: string;           // Unique user identifier
  email: string;        // User's email address
  name: string;         // User's display name
  avatar?: string;      // Optional avatar URL
  provider: string;     // OAuth provider (google, github, etc.)
  role_id: string;      // User's role identifier
  tenant_id: string;    // Tenant the user belongs to
}
```

## Import and Usage

```typescript
import { AuthTowerSDK, AccountData } from 'auth-tower-sdk';

const sdk = new AuthTowerSDK(config);
await sdk.initializeClient();

// Get account data with proper typing
const accountData: AccountData | null = await sdk.getAccountData();

if (accountData) {
  // TypeScript now knows the exact structure
  console.log(`User ID: ${accountData.id}`);
  console.log(`Email: ${accountData.email}`);
  console.log(`Name: ${accountData.name}`);
  console.log(`Provider: ${accountData.provider}`);
  console.log(`Role: ${accountData.role_id}`);
  console.log(`Tenant: ${accountData.tenant_id}`);
  
  // Optional avatar with type safety
  if (accountData.avatar) {
    console.log(`Avatar: ${accountData.avatar}`);
  }
}
```

## React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import { AuthTowerSDK, AccountData } from 'auth-tower-sdk';

interface UserProfileProps {
  sdk: AuthTowerSDK;
}

const UserProfile: React.FC<UserProfileProps> = ({ sdk }) => {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        const data = await sdk.getAccountData();
        setAccountData(data);
      } catch (error) {
        console.error('Failed to load account data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAccountData();
  }, [sdk]);

  if (loading) return <div>Loading...</div>;
  if (!accountData) return <div>Not logged in</div>;

  return (
    <div className="user-profile">
      <div className="avatar">
        {accountData.avatar ? (
          <img src={accountData.avatar} alt={accountData.name} />
        ) : (
          <div className="avatar-placeholder">
            {accountData.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="user-info">
        <h2>{accountData.name}</h2>
        <p>Email: {accountData.email}</p>
        <p>Provider: {accountData.provider}</p>
        <p>Role ID: {accountData.role_id}</p>
        <p>Tenant: {accountData.tenant_id}</p>
      </div>
    </div>
  );
};

export default UserProfile;
```

## Multi-Tenant Usage

```typescript
import { AccountData } from 'auth-tower-sdk';

interface TenantAccount {
  tenantId: string;
  accountData: AccountData;
}

const loadAllTenantAccounts = async (sdk: AuthTowerSDK): Promise<TenantAccount[]> => {
  const accounts: TenantAccount[] = [];
  
  // Assume we have a list of tenant IDs the user has access to
  const tenantIds = ['tenant-1', 'tenant-2', 'tenant-3'];
  
  for (const tenantId of tenantIds) {
    const accountData = await sdk.getAccountData(tenantId);
    if (accountData) {
      accounts.push({
        tenantId,
        accountData
      });
    }
  }
  
  return accounts;
};

// Usage
const userAccounts = await loadAllTenantAccounts(sdk);
userAccounts.forEach(({ tenantId, accountData }) => {
  console.log(`${accountData.name} in ${tenantId}: ${accountData.email}`);
});
```

## Utility Functions

```typescript
import { AccountData } from 'auth-tower-sdk';

// Helper function to get user initials
export const getUserInitials = (accountData: AccountData): string => {
  return accountData.name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

// Helper function to format user display
export const formatUserDisplay = (accountData: AccountData): string => {
  return `${accountData.name} (${accountData.email})`;
};

// Helper function to check if user has avatar
export const hasAvatar = (accountData: AccountData): boolean => {
  return !!accountData.avatar;
};

// Helper function to get provider display name
export const getProviderDisplayName = (accountData: AccountData): string => {
  const providerNames: Record<string, string> = {
    google: 'Google',
    github: 'GitHub',
    microsoft: 'Microsoft',
    facebook: 'Facebook'
  };
  
  return providerNames[accountData.provider] || accountData.provider;
};
```

## Type Guards

```typescript
import { AccountData } from 'auth-tower-sdk';

// Type guard to check if data is valid AccountData
export const isValidAccountData = (data: any): data is AccountData => {
  return (
    data &&
    typeof data.id === 'string' &&
    typeof data.email === 'string' &&
    typeof data.name === 'string' &&
    typeof data.provider === 'string' &&
    typeof data.role_id === 'string' &&
    typeof data.tenant_id === 'string' &&
    (data.avatar === undefined || typeof data.avatar === 'string')
  );
};

// Usage
const userData = await sdk.getAccountData();
if (userData && isValidAccountData(userData)) {
  // TypeScript now knows userData is definitely AccountData
  console.log(`Valid user data for ${userData.name}`);
}
```

The `AccountData` type provides consistent typing across your entire application when working with user account information from the Auth Tower SDK!