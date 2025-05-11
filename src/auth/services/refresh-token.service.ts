import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../redis';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RefreshTokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {}

  // Generate a new refresh token
  async generateRefreshToken(userId: string): Promise<string> {
    // Create a unique refresh token
    const refreshToken = uuidv4();
    
    // Store the refresh token in Redis with the user ID
    const ttl = this.configService.get('REFRESH_TOKEN_TTL', 60 * 60 * 24 * 30); // 30 days
    await this.redisService.storeRefreshToken(userId, refreshToken, ttl);
    
    return refreshToken;
  }

  // Validate a refresh token
  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    return await this.redisService.validateRefreshToken(userId, refreshToken);
  }

  // Revoke a refresh token
  async revokeRefreshToken(userId: string): Promise<void> {
    await this.redisService.deleteRefreshToken(userId);
  }

  // Generate a new access token using the refresh token
  async createAccessTokenFromRefreshToken(userId: string, refreshToken: string): Promise<{ accessToken: string } | null> {
    // Validate the refresh token
    const isValid = await this.validateRefreshToken(userId, refreshToken);
    
    if (!isValid) {
      return null;
    }
    
    // Generate a new access token
    const payload = { sub: userId };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRATION', '15m'),
      audience: this.configService.get('JWT_AUDIENCE'),
      issuer: this.configService.get('JWT_ISSUER'),
    });
    
    return { accessToken };
  }
}
