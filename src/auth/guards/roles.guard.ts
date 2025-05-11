import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true; // No roles required, access granted
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      return false; // No user, access denied
    }
    
    // Handle case where user has a single role
    if (typeof user.role === 'string') {
      return requiredRoles.includes(user.role as Role);
    }
    
    // Handle case where user has multiple roles in an array
    if (Array.isArray(user.roles)) {
      return requiredRoles.some(role => user.roles.includes(role));
    }
    
    // Handle case where roles might be in a different property (e.g., from Auth0 or other providers)
    // This assumes roles are in the format "role:name" in the permissions array
    if (Array.isArray(user.permissions)) {
      const userRoles = user.permissions
        .filter(p => p.startsWith('role:'))
        .map(p => p.replace('role:', ''));
      return requiredRoles.some(role => userRoles.includes(role));
    }
    
    return false;
  }
}
