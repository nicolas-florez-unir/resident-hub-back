import { UserRoleMapper } from '@user/infrastructure/mappers/prisma/user-role.mapper';
import { UserRole as UserRolePrisma } from '@prisma/client';
import { UserRole as UserRoleDomain } from '@user/domain/enums/user-role.enum';

describe('UserRoleMapper', () => {
  describe('toDomain', () => {
    it('should map Prisma administrator role to Domain Administrator role', () => {
      const result = UserRoleMapper.toDomain(UserRolePrisma.administrator);
      expect(result).toBe(UserRoleDomain.Administrator);
    });

    it('should map Prisma house_owner role to Domain HouseOwner role', () => {
      const result = UserRoleMapper.toDomain(UserRolePrisma.house_owner);
      expect(result).toBe(UserRoleDomain.HouseOwner);
    });

    it('should throw an error for unknown Prisma role', () => {
      expect(() =>
        UserRoleMapper.toDomain('unknown_role' as UserRolePrisma),
      ).toThrowError('Unknown Domain role: unknown_role');
    });
  });

  describe('toPrisma', () => {
    it('should map Domain Administrator role to Prisma administrator role', () => {
      const result = UserRoleMapper.toPrisma(UserRoleDomain.Administrator);
      expect(result).toBe(UserRolePrisma.administrator);
    });

    it('should map Domain HouseOwner role to Prisma house_owner role', () => {
      const result = UserRoleMapper.toPrisma(UserRoleDomain.HouseOwner);
      expect(result).toBe(UserRolePrisma.house_owner);
    });

    it('should throw an error for unknown Domain role', () => {
      expect(() => UserRoleMapper.toPrisma('UnknownRole' as UserRoleDomain)).toThrowError(
        'Unknown Prisma role: UnknownRole',
      );
    });
  });
});
