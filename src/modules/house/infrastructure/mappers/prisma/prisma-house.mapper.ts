import { PrismaCondominiumMapper } from '@condominium/infrastructure/mappers/prisma/prisma-condominium.mapper';
import {
  House as PrismaHouse,
  User as PrismaUser,
  Condominium as PrismaCondominium,
} from '@prisma/client';
import { PrismaUserMapper } from '@user/infrastructure/mappers/prisma/prisma-user.mapper';
import { HouseEntity as DomainHouse } from 'src/modules/house/domain/entities/house.entity';

export class PrismaHouseMapper {
  static toDomain(
    prismaHouse: PrismaHouse,
    owner: PrismaUser,
    condominium: PrismaCondominium,
  ): DomainHouse {
    return new DomainHouse(
      prismaHouse.id,
      prismaHouse.house_number,
      PrismaUserMapper.toDomain(owner),
      PrismaCondominiumMapper.toDomain(condominium),
      prismaHouse.created_at,
      prismaHouse.updated_at,
    );
  }

  static toPrisma(domainHouse: DomainHouse): PrismaHouse {
    return {
      id: domainHouse.getId(),
      house_number: domainHouse.getHouseNumber(),
      owner_id: domainHouse.getOwner().id,
      condominium_id: domainHouse.getCondominium().getId(),
      created_at: domainHouse.getCreatedAt(),
      updated_at: domainHouse.getUpdatedAt(),
    };
  }
}
