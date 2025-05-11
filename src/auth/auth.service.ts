import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from './services/refresh-token.service';
import { SessionService } from './services/session.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
    private sessionService: SessionService,
  ) {}

  validateUser(payload: any): any {
    // In a real application, you might want to validate against a database
    // For now, we'll just return the payload which contains user information
    return payload;
  }

  // Generate access and refresh tokens for a user
  async login(user: any, requestInfo?: { ip?: string; userAgent?: string }): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    const userId = user.sub || user.id;

    if (!userId) {
      throw new UnauthorizedException('Invalid user information');
    }

    // Create payload for JWT
    const payload = {
      sub: userId,
      email: user.email,
      roles: user.roles || [],
    };

    // Generate access token
    const accessToken = this.jwtService.sign(payload);

    // Generate refresh token
    const refreshToken = await this.refreshTokenService.generateRefreshToken(userId);

    // Create a session for the user
    await this.sessionService.createSession(userId, {
      email: user.email,
      roles: user.roles,
      ip: requestInfo?.ip,
      userAgent: requestInfo?.userAgent,
    });

    // Get token expiration time in seconds
    const expiresIn = this.configService.get('JWT_ACCESS_EXPIRATION_SECONDS', 15 * 60); // 15 minutes

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  // Refresh the access token using a refresh token
  async refreshToken(userId: string, refreshToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    // Validate the refresh token
    const tokenData = await this.refreshTokenService.createAccessTokenFromRefreshToken(
      userId,
      refreshToken,
    );

    if (!tokenData) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Update the user's session
    await this.sessionService.updateSession(userId, {
      lastActive: new Date(),
    });

    // Get token expiration time in seconds
    const expiresIn = this.configService.get('JWT_ACCESS_EXPIRATION_SECONDS', 15 * 60); // 15 minutes

    return {
      accessToken: tokenData.accessToken,
      expiresIn,
    };
  }

  // Logout a user
  async logout(userId: string): Promise<void> {
    // Revoke the refresh token
    await this.refreshTokenService.revokeRefreshToken(userId);

    // Delete the session
    await this.sessionService.deleteSession(userId);
  }

  // Validate a session
  async validateSession(userId: string): Promise<boolean> {
    return await this.sessionService.isSessionActive(userId);
  }
}
