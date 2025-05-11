import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UnauthorizedException,
  Ip,
  Headers,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

// DTO for refresh token requests
class RefreshTokenDto {
  userId: string;
  refreshToken: string;
}

// DTO for logout requests
class LogoutDto {
  userId: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint to refresh an access token
  @Public()
  @Post('refresh-token')
  @HttpCode(200)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      const { userId, refreshToken } = refreshTokenDto;
      return await this.authService.refreshToken(userId, refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  // Endpoint to logout
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req, @Body() logoutDto: LogoutDto) {
    // Get the user ID from the JWT token or the request body
    const userId = req.user?.sub || logoutDto.userId;
    
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    
    await this.authService.logout(userId);
    return { message: 'Logout successful' };
  }

  // Endpoint to validate a session
  @UseGuards(JwtAuthGuard)
  @Post('validate-session')
  @HttpCode(200)
  async validateSession(@Request() req) {
    const userId = req.user?.sub;
    
    if (!userId) {
      throw new UnauthorizedException('User ID is required');
    }
    
    const isValid = await this.authService.validateSession(userId);
    return { valid: isValid };
  }

  // Endpoint to get a new token pair (for testing purposes)
  // In a real application, this would be handled by your identity provider
  @Public()
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() user: any,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    // This is a mock login endpoint for testing
    // In a real application, you would validate credentials and get user info
    return await this.authService.login(user, { ip, userAgent });
  }
}
