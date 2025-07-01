import {
  Fine as PrismaFine,
  House as PrismaHouse,
  User as PrismaUser,
  Condominium as PrismaCondominium,
} from '@prisma/client';
import { FineEntity } from 'src/modules/fine/domain/entities/fine.entity';
import { PrismaFineTypeMapper } from './prisma-fine-type.mapper';
import { PrismaHouseMapper } from 'src/modules/house/infrastructure/mappers/prisma/prisma-house.mapper';
import { PrismaFineStatusMapper } from './prisma-fine-status.mapper';
import { PrismaCurrencyMapper } from './prisma-currency.mapper';

interface ToDomainProps {
  prismaFine: PrismaFine;
  prismaHouse: {
    entity: PrismaHouse;
    owner: PrismaUser;
    condominium: PrismaCondominium;
  };
}

export class PrismaFineMapper {
  static toDomain({ prismaFine, prismaHouse }: ToDomainProps): FineEntity {
    return new FineEntity(
      prismaFine.id,
      PrismaFineTypeMapper.toDomain(prismaFine.type),
      PrismaHouseMapper.toDomain(
        prismaHouse.entity,
        prismaHouse.owner,
        prismaHouse.condominium,
      ), // Assuming house_id is a number
      prismaFine.issued_date,
      prismaFine.amount,
      PrismaCurrencyMapper.toDomain(prismaFine.currency),
      PrismaFineStatusMapper.toDomain(prismaFine.status),
      prismaFine.reason,
      prismaFine.created_at,
      prismaFine.updated_at,
    );
  }

  static toPrisma(fine: FineEntity): PrismaFine {
    return {
      id: fine.id,
      type: PrismaFineTypeMapper.toPrisma(fine.type),
      house_id: fine.house.getId(), // Assuming house is an object with an id
      issued_date: fine.issuedDate,
      amount: fine.amount,
      currency: PrismaCurrencyMapper.toPrisma(fine.currency),
      status: PrismaFineStatusMapper.toPrisma(fine.status),
      reason: fine.reason,
      created_at: fine.createdAt,
      updated_at: fine.updatedAt,
    };
  }
}
