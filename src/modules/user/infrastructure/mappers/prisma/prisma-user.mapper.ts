import { User as PrismaUser } from '@prisma/client';
import { UserEntity as UserDomain } from '@user/domain/entities/user.entity';
import { UserRoleMapper } from './user-role.mapper';

export class PrismaUserMapper {
  static toDomain(user: PrismaUser): UserDomain {
    return new UserDomain(
      user.id,
      user.condominium_id,
      user.email,
      user.password,
      user.first_name,
      user.last_name,
      user.phone,
      UserRoleMapper.toDomain(user.role),
      user.created_at,
      user.updated_at,
    );
  }

  static toPrisma(user: UserDomain): PrismaUser {
    return {
      id: user.id,
      condominium_id: user.condominiumId,
      email: user.email,
      password: user.password,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone,
      role: user.role,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
