import { Injectable } from '@nestjs/common';
import { RedisService } from '../../redis';
import { ConfigService } from '@nestjs/config';

export interface SessionData {
  userId: string;
  email?: string;
  roles?: string[];
  lastActive: Date;
  ip?: string;
  userAgent?: string;
  deviceInfo?: any;
}

@Injectable()
export class SessionService {
  constructor(
    private redisService: RedisService,
    private configService: ConfigService,
  ) {}

  // Create a new session
  async createSession(userId: string, sessionData: Partial<SessionData>): Promise<void> {
    const session: SessionData = {
      userId,
      lastActive: new Date(),
      ...sessionData,
    };
    
    const ttl = this.configService.get('SESSION_TTL', 60 * 60 * 24); // 24 hours
    await this.redisService.storeSession(userId, session, ttl);
  }

  // Get a session
  async getSession(userId: string): Promise<SessionData | null> {
    return await this.redisService.getSession(userId);
  }

  // Update a session
  async updateSession(userId: string, sessionData: Partial<SessionData>): Promise<void> {
    const currentSession = await this.getSession(userId);
    
    if (!currentSession) {
      return;
    }
    
    const updatedSession: SessionData = {
      ...currentSession,
      ...sessionData,
      lastActive: new Date(),
    };
    
    const ttl = this.configService.get('SESSION_TTL', 60 * 60 * 24); // 24 hours
    await this.redisService.storeSession(userId, updatedSession, ttl);
  }

  // Delete a session
  async deleteSession(userId: string): Promise<void> {
    await this.redisService.deleteSession(userId);
  }

  // Check if a session is active
  async isSessionActive(userId: string): Promise<boolean> {
    const session = await this.getSession(userId);
    
    if (!session) {
      return false;
    }
    
    // Check if the session has expired
    const maxInactiveTime = this.configService.get('SESSION_INACTIVE_TIMEOUT', 60 * 60 * 24); // 24 hours
    const lastActive = new Date(session.lastActive).getTime();
    const now = Date.now();
    
    return (now - lastActive) / 1000 < maxInactiveTime;
  }
}
