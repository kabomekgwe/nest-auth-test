import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: configService.get('JWKS_URI', 'https://your-auth-server/.well-known/jwks.json'),
      }),
      ignoreExpiration: false,
      audience: configService.get('JWT_AUDIENCE', 'your-api-audience'),
      issuer: configService.get('JWT_ISSUER', 'https://your-auth-server/'),
    });
  }

  async validate(payload: any) {
    const user = this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    // Check if the user has an active session
    const userId = payload.sub;
    if (userId) {
      const isSessionActive = await this.authService.validateSession(userId);
      if (!isSessionActive) {
        throw new UnauthorizedException('Session expired or invalid');
      }
    }

    return user;
  }
}
