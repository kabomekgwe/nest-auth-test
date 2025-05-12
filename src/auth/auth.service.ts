import { Injectable, UnauthorizedException } from '@nestjs/common';
import { MockDatabaseService } from '../database';

@Injectable()
export class AuthService {
  constructor(private databaseService: MockDatabaseService) {}

  async validateUser(payload: any): Promise<any> {
    // Extract user ID from the payload
    const userId = payload.sub;

    if (!userId) {
      throw new UnauthorizedException('Invalid token: missing user ID');
    }

    // Check if the user exists in the database
    const user = await this.databaseService.findUserById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found in database');
    }

    // Check if the user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Return the user with roles from the database
    return {
      ...payload,
      roles: user.roles,
      name: user.name,
      email: user.email,
      isActive: user.isActive
    };
  }
}
