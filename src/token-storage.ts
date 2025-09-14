// Token storage interfaces and implementations
import { AccountData } from './types';

export interface TokenData {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number; // Calculated timestamp
  user?: AccountData;
}

export interface ClientCredentialsTokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number; // Calculated timestamp
}

export interface TokenStorage {
  // User tokens (from OAuth flow)
  getUserToken(tenantId: string): Promise<TokenData | null>;
  setUserToken(tenantId: string, token: TokenData): Promise<void>;
  removeUserToken(tenantId: string): Promise<void>;
  
  // Client credentials tokens (for SDK operations)
  getClientToken(tenantId: string): Promise<ClientCredentialsTokenData | null>;
  setClientToken(tenantId: string, token: ClientCredentialsTokenData): Promise<void>;
  setCurrentTenantID(tenantId: string) : Promise<void>;
  getCurrentTenantID(): Promise<string | null>;
  removeCurrentTenantID(): Promise<void>;
  removeClientToken(tenantId: string): Promise<void>;
  
  // Utility methods
  clear(): Promise<void>;
  listTenants(): Promise<string[]>;
}

/**
 * Memory-based token storage - suitable for server-side or when persistence isn't needed
 */
export class MemoryTokenStorage implements TokenStorage {
  private userTokens = new Map<string, TokenData>();
  private clientTokens = new Map<string, ClientCredentialsTokenData>();
  private currentTenantID: string | null = null;

  async getCurrentTenantID(): Promise<string | null> {
    return this.currentTenantID;
  }
  async setCurrentTenantID(tenantId: string): Promise<void> {
    this.currentTenantID = tenantId;
  }
  async removeCurrentTenantID(): Promise<void> {
    this.currentTenantID = null;
  }

  async getUserToken(tenantId: string): Promise<TokenData | null> {
    return this.userTokens.get(tenantId) || null;
  }

  async setUserToken(tenantId: string, token: TokenData): Promise<void> {
    this.userTokens.set(tenantId, token);
  }

  async removeUserToken(tenantId: string): Promise<void> {
    this.userTokens.delete(tenantId);
  }

  async getClientToken(tenantId: string): Promise<ClientCredentialsTokenData | null> {
    return this.clientTokens.get(tenantId) || null;
  }

  async setClientToken(tenantId: string, token: ClientCredentialsTokenData): Promise<void> {
    this.clientTokens.set(tenantId, token);
  }

  async removeClientToken(tenantId: string): Promise<void> {
    this.clientTokens.delete(tenantId);
  }

  async clear(): Promise<void> {
    this.userTokens.clear();
    this.clientTokens.clear();
  }

  async listTenants(): Promise<string[]> {
    const tenants = new Set([
      ...this.userTokens.keys(),
      ...this.clientTokens.keys()
    ]);
    return Array.from(tenants);
  }
}

/**
 * Browser localStorage-based token storage - suitable for client-side applications
 */
export class BrowserTokenStorage implements TokenStorage {
  private readonly prefix = 'auth_tower_';
  private readonly userTokenPrefix = `${this.prefix}user_token_`;
  private readonly clientTokenPrefix = `${this.prefix}client_token_`;
  private readonly currentTenantKey = `${this.prefix}current_tenant`;

  private isStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  private getItem(key: string): string | null {
    if (!this.isStorageAvailable()) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private setItem(key: string, value: string): void {
    if (!this.isStorageAvailable()) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage quota exceeded or other error - silently fail
    }
  }

  private removeItem(key: string): void {
    if (!this.isStorageAvailable()) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail
    }
  }

  async getCurrentTenantID(): Promise<string | null> {
    return this.getItem(this.currentTenantKey);
  }
  async setCurrentTenantID(tenantId: string): Promise<void> {
    this.setItem(this.currentTenantKey, tenantId);
  }
  async removeCurrentTenantID(): Promise<void> {
    this.removeItem(this.currentTenantKey);
  }

  async getUserToken(tenantId: string): Promise<TokenData | null> {
    const data = this.getItem(`${this.userTokenPrefix}${tenantId}`);
    if (!data) return null;
    
    try {
      const token = JSON.parse(data) as TokenData;
      // Check if token is expired
      if (Date.now() >= token.expires_at) {
        await this.removeUserToken(tenantId);
        return null;
      }
      return token;
    } catch {
      // Invalid JSON - remove corrupted data
      await this.removeUserToken(tenantId);
      return null;
    }
  }

  async setUserToken(tenantId: string, token: TokenData): Promise<void> {
    this.setItem(`${this.userTokenPrefix}${tenantId}`, JSON.stringify(token));
  }

  async removeUserToken(tenantId: string): Promise<void> {
    this.removeItem(`${this.userTokenPrefix}${tenantId}`);
  }

  async getClientToken(tenantId: string): Promise<ClientCredentialsTokenData | null> {
    const data = this.getItem(`${this.clientTokenPrefix}${tenantId}`);
    if (!data) return null;
    
    try {
      const token = JSON.parse(data) as ClientCredentialsTokenData;
      // Check if token is expired
      if (Date.now() >= token.expires_at) {
        await this.removeClientToken(tenantId);
        return null;
      }
      return token;
    } catch {
      // Invalid JSON - remove corrupted data
      await this.removeClientToken(tenantId);
      return null;
    }
  }

  async setClientToken(tenantId: string, token: ClientCredentialsTokenData): Promise<void> {
    this.setItem(`${this.clientTokenPrefix}${tenantId}`, JSON.stringify(token));
  }

  async removeClientToken(tenantId: string): Promise<void> {
    this.removeItem(`${this.clientTokenPrefix}${tenantId}`);
  }

  async clear(): Promise<void> {
    if (!this.isStorageAvailable()) return;
    
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.prefix)) {
        keys.push(key);
      }
    }
    
    keys.forEach(key => this.removeItem(key));
  }

  async listTenants(): Promise<string[]> {
    if (!this.isStorageAvailable()) return [];
    
    const tenants = new Set<string>();
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      if (key.startsWith(this.userTokenPrefix)) {
        tenants.add(key.substring(this.userTokenPrefix.length));
      } else if (key.startsWith(this.clientTokenPrefix)) {
        tenants.add(key.substring(this.clientTokenPrefix.length));
      }
    }
    
    return Array.from(tenants);
  }
}

/**
 * Secure encrypted storage for sensitive environments
 */
export class SecureTokenStorage implements TokenStorage {
  private storage: TokenStorage;
  private encryptionKey: string;

  constructor(baseStorage: TokenStorage, encryptionKey: string) {
    this.storage = baseStorage;
    this.encryptionKey = encryptionKey;
  }

  private async encrypt(data: string): Promise<string> {
    // In a real implementation, use proper encryption like Web Crypto API
    // This is a simple example - use a proper encryption library in production
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const keyBytes = encoder.encode(this.encryptionKey);
    
    // Simple XOR encryption (NOT secure - replace with proper encryption)
    const encrypted = new Uint8Array(dataBytes.length);
    for (let i = 0; i < dataBytes.length; i++) {
      encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
    }
    
    return btoa(String.fromCharCode(...encrypted));
  }

  private async decrypt(encryptedData: string): Promise<string> {
    try {
      const encrypted = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      const encoder = new TextEncoder();
      const keyBytes = encoder.encode(this.encryptionKey);
      
      const decrypted = new Uint8Array(encrypted.length);
      for (let i = 0; i < encrypted.length; i++) {
        decrypted[i] = encrypted[i] ^ keyBytes[i % keyBytes.length];
      }
      
      return new TextDecoder().decode(decrypted);
    } catch {
      throw new Error('Failed to decrypt token data');
    }
  }

  async getCurrentTenantID(): Promise<string | null> {
    return await this.storage.getCurrentTenantID();
  }
  async setCurrentTenantID(tenantId: string): Promise<void> {
    await this.storage.setCurrentTenantID(tenantId);
  }
  async removeCurrentTenantID(): Promise<void> {
    await this.storage.removeCurrentTenantID();
  }

  async getUserToken(tenantId: string): Promise<TokenData | null> {
    const token = await this.storage.getUserToken(tenantId);
    if (!token) return null;
    
    try {
      const decryptedAccessToken = await this.decrypt(token.access_token);
      const decryptedRefreshToken = await this.decrypt(token.refresh_token);
      
      return {
        ...token,
        access_token: decryptedAccessToken,
        refresh_token: decryptedRefreshToken
      };
    } catch {
      // Decryption failed - remove corrupted token
      await this.removeUserToken(tenantId);
      return null;
    }
  }

  async setUserToken(tenantId: string, token: TokenData): Promise<void> {
    const encryptedToken: TokenData = {
      ...token,
      access_token: await this.encrypt(token.access_token),
      refresh_token: await this.encrypt(token.refresh_token)
    };
    
    await this.storage.setUserToken(tenantId, encryptedToken);
  }

  async removeUserToken(tenantId: string): Promise<void> {
    await this.storage.removeUserToken(tenantId);
  }

  async getClientToken(tenantId: string): Promise<ClientCredentialsTokenData | null> {
    const token = await this.storage.getClientToken(tenantId);
    if (!token) return null;
    
    try {
      const decryptedAccessToken = await this.decrypt(token.access_token);
      
      return {
        ...token,
        access_token: decryptedAccessToken
      };
    } catch {
      // Decryption failed - remove corrupted token
      await this.removeClientToken(tenantId);
      return null;
    }
  }

  async setClientToken(tenantId: string, token: ClientCredentialsTokenData): Promise<void> {
    const encryptedToken: ClientCredentialsTokenData = {
      ...token,
      access_token: await this.encrypt(token.access_token)
    };
    
    await this.storage.setClientToken(tenantId, encryptedToken);
  }

  async removeClientToken(tenantId: string): Promise<void> {
    await this.storage.removeClientToken(tenantId);
  }

  async clear(): Promise<void> {
    await this.storage.clear();
  }

  async listTenants(): Promise<string[]> {
    return await this.storage.listTenants();
  }
}