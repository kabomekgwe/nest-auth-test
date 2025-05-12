import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor() {}

  validateUser(payload: any): any {
    // In a real application, you might want to validate against a database
    // For now, we'll just return the payload which contains user information
    return payload;
  }
}
