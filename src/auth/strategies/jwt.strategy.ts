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
    // For production, use JWKS
    // super({
    //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    //   secretOrKeyProvider: passportJwtSecret({
    //     cache: true,
    //     rateLimit: true,
    //     jwksRequestsPerMinute: 5,
    //     jwksUri: configService.get('JWKS_URI', 'https://your-auth-server/.well-known/jwks.json'),
    //   }),
    //   ignoreExpiration: false,
    //   audience: configService.get('JWT_AUDIENCE', 'your-api-audience'),
    //   issuer: configService.get('JWT_ISSUER', 'https://your-auth-server/'),
    // });

    // For testing purposes, use a simple secret
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'test-secret-key', // Use the same secret as in test-jwt.js
      ignoreExpiration: false,
      audience: configService.get('JWT_AUDIENCE', 'your-api-audience'),
      issuer: configService.get('JWT_ISSUER', 'https://your-auth-server/'),
    });
  }

  async validate(payload: any) {
    try {
      // This will check if the user exists in the database and is active
      const user = await this.authService.validateUser(payload);
      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message || 'Invalid token');
    }
  }
}
