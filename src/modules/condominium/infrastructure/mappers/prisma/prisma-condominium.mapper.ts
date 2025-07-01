import { Condominium as PrismaCondominium, User as PrismaUser } from '@prisma/client';
import { CondominiumEntity as CondominiumDomain } from '@condominium/domain/entities/condominium.entity';
import { PrismaUserMapper } from '@user/infrastructure/mappers/prisma/prisma-user.mapper';

export class PrismaCondominiumMapper {
  static toDomain(
    condominium: PrismaCondominium,
    administrator?: PrismaUser,
  ): CondominiumDomain {
    return new CondominiumDomain(
      condominium.id,
      condominium.name,
      condominium.address,
      condominium.logo,
      administrator ? PrismaUserMapper.toDomain(administrator) : null,
      condominium.created_at,
      condominium.updated_at,
    );
  }

  static toPrisma(condominium: CondominiumDomain): PrismaCondominium {
    return {
      id: condominium.getId(),
      name: condominium.getName(),
      address: condominium.getAddress(),
      logo: condominium.getLogo(),
      administrator_id: condominium.getAdministrator()?.id,
      created_at: condominium.getCreatedAt(),
      updated_at: condominium.getUpdatedAt(),
    };
  }
}
