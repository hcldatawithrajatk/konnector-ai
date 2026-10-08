import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return true; // Handled by auth guard
    }

    // Platform Super Admin can bypass single-tenant restriction
    if (user.role === Role.SUPER_ADMIN) {
      // Optional header to switch tenant view for Super Admin
      const headerOrgId = request.headers['x-tenant-id'];
      if (headerOrgId) {
        request.organizationId = headerOrgId;
      } else {
        request.organizationId = user.organizationId;
      }
      return true;
    }

    // For standard users, tenant MUST match their organizationId
    const requestedOrgId = request.params?.organizationId || request.headers['x-tenant-id'] || request.body?.organizationId;
    if (requestedOrgId && requestedOrgId !== user.organizationId) {
      throw new ForbiddenException('Tenant Isolation Violation: Access to other organization is denied');
    }

    request.organizationId = user.organizationId;
    return true;
  }
}
