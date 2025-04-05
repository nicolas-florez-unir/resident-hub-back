import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from '@user/domain/enums/UserRole.enum';
import { Roles } from './roles.decorator';
import { AuthGuard } from '@common/guards/auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';

export function RequiresRoles(roles: UserRole[]) {
  return applyDecorators(Roles(roles), UseGuards(AuthGuard, RolesGuard));
}
