import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { SessionService } from './services/session.service';
import { RedisModule } from '../redis';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // JWT options for signing tokens (not for validation, which uses JWKS)
        secret: configService.get('JWT_SECRET', 'your-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_ACCESS_EXPIRATION', '15m'),
          audience: configService.get('JWT_AUDIENCE'),
          issuer: configService.get('JWT_ISSUER'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService, RefreshTokenService, SessionService],
  exports: [
    PassportModule,
    JwtModule,
    JwtStrategy,
    AuthService,
    RefreshTokenService,
    SessionService
  ],
})
export class AuthModule {}
