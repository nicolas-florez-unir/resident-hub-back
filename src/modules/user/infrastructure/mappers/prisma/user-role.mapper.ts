import { UserRole as UserRolePrisma } from '@prisma/client';
import { UserRole as UserRoleDomain } from '@user/domain/enums/user-role.enum';

export class UserRoleMapper {
  static toDomain(role: UserRolePrisma): UserRoleDomain {
    switch (role) {
      case UserRolePrisma.administrator:
        return UserRoleDomain.Administrator;
      case UserRolePrisma.house_owner:
        return UserRoleDomain.HouseOwner;
      default:
        throw new Error(`Unknown Domain role: ${role}`);
    }
  }

  static toPrisma(role: UserRoleDomain): UserRolePrisma {
    switch (role) {
      case UserRoleDomain.Administrator:
        return UserRolePrisma.administrator;
      case UserRoleDomain.HouseOwner:
        return UserRolePrisma.house_owner;
      default:
        throw new Error(`Unknown Prisma role: ${role}`);
    }
  }
}
