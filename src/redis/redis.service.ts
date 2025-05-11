import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  // The reset method is not available in the Cache interface
  // We'll implement a custom method if needed in the future
  async reset(): Promise<void> {
    // For now, we'll just log that this method was called
    console.log('Reset method called, but not implemented');
  }

  // Helper method to store a session
  async storeSession(userId: string, sessionData: any, ttl?: number): Promise<void> {
    const sessionKey = `session:${userId}`;
    await this.set(sessionKey, JSON.stringify(sessionData), ttl);
  }

  // Helper method to retrieve a session
  async getSession(userId: string): Promise<any> {
    const sessionKey = `session:${userId}`;
    const session = await this.get(sessionKey);
    return session ? JSON.parse(session) : null;
  }

  // Helper method to delete a session
  async deleteSession(userId: string): Promise<void> {
    const sessionKey = `session:${userId}`;
    await this.del(sessionKey);
  }

  // Helper method to store a refresh token
  async storeRefreshToken(userId: string, token: string, ttl?: number): Promise<void> {
    const tokenKey = `refresh_token:${userId}`;
    await this.set(tokenKey, token, ttl);
  }

  // Helper method to validate a refresh token
  async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    const tokenKey = `refresh_token:${userId}`;
    const storedToken = await this.get(tokenKey);
    return storedToken === token;
  }

  // Helper method to delete a refresh token
  async deleteRefreshToken(userId: string): Promise<void> {
    const tokenKey = `refresh_token:${userId}`;
    await this.del(tokenKey);
  }
}
