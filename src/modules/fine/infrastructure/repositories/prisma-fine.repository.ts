import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { FineRepository } from '../../domain/repositories/fine.repository';
import { CreateFineDto } from '../../domain/dtos/create-fine.dto';
import { FineEntity } from '../../domain/entities/fine.entity';
import { PrismaFineTypeMapper } from '../mappers/prisma/prisma-fine-type.mapper';
import { PrismaCurrencyMapper } from '../mappers/prisma/prisma-currency.mapper';
import { PrismaFineStatusMapper } from '../mappers/prisma/prisma-fine-status.mapper';
import { PrismaFineMapper } from '../mappers/prisma/prisma-fine.mapper';
import { UpdateFineDto } from '../../domain/dtos/update-fine.dto';

@Injectable()
export class PrismaFineRepository extends FineRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async createFine(createFineDto: CreateFineDto): Promise<FineEntity> {
    const fine = await this.prismaService.fine.create({
      data: {
        type: PrismaFineTypeMapper.toPrisma(createFineDto.type),
        house_id: createFineDto.houseId,
        issued_date: createFineDto.issuedDate,
        amount: createFineDto.amount,
        currency: PrismaCurrencyMapper.toPrisma(createFineDto.currency),
        status: PrismaFineStatusMapper.toPrisma(createFineDto.status),
        reason: createFineDto.reason,
      },
      include: {
        House: {
          include: {
            User: true, // Assuming User is a User entity
            Condominium: true, // Assuming condominium is a Condominium entity
          },
        },
      },
    });

    return PrismaFineMapper.toDomain({
      prismaFine: fine,
      prismaHouse: {
        entity: fine.House,
        owner: fine.House.User,
        condominium: fine.House.Condominium,
      },
    });
  }

  async findFineById(fineId: number): Promise<FineEntity | null> {
    const fine = await this.prismaService.fine.findUnique({
      where: { id: fineId },
      include: {
        House: {
          include: {
            User: true, // Assuming User is a User entity
            Condominium: true, // Assuming condominium is a Condominium entity
          },
        },
      },
    });

    if (!fine) {
      return null;
    }

    return PrismaFineMapper.toDomain({
      prismaFine: fine,
      prismaHouse: {
        entity: fine.House,
        owner: fine.House.User,
        condominium: fine.House.Condominium,
      },
    });
  }

  async deleteFine(fineId: number): Promise<void> {
    await this.prismaService.fine.delete({
      where: { id: fineId },
    });
  }

  async findFinesByHouseOwner(houseOwnerId: number): Promise<FineEntity[]> {
    const fines = await this.prismaService.fine.findMany({
      where: {
        House: {
          User: {
            id: houseOwnerId,
          },
        },
      },
      include: {
        House: {
          include: {
            User: true, // Assuming User is a User entity
            Condominium: true, // Assuming condominium is a Condominium entity
          },
        },
      },
    });

    return fines.map((fine) =>
      PrismaFineMapper.toDomain({
        prismaFine: fine,
        prismaHouse: {
          entity: fine.House,
          owner: fine.House.User,
          condominium: fine.House.Condominium,
        },
      }),
    );
  }

  async findByCondominiumId(condominiumId: number): Promise<FineEntity[]> {
    const fines = await this.prismaService.fine.findMany({
      where: {
        House: {
          Condominium: {
            id: condominiumId,
          },
        },
      },
      include: {
        House: {
          include: {
            User: true, // Assuming User is a User entity
            Condominium: true, // Assuming condominium is a Condominium entity
          },
        },
      },
    });

    return fines.map((fine) =>
      PrismaFineMapper.toDomain({
        prismaFine: fine,
        prismaHouse: {
          entity: fine.House,
          owner: fine.House.User,
          condominium: fine.House.Condominium,
        },
      }),
    );
  }

  async update(updateFineDto: UpdateFineDto): Promise<FineEntity> {
    const fine = await this.prismaService.fine.update({
      where: { id: updateFineDto.id },
      data: {
        type: PrismaFineTypeMapper.toPrisma(updateFineDto.type),
        house_id: updateFineDto.houseId,
        issued_date: updateFineDto.issuedDate,
        amount: updateFineDto.amount,
        currency: PrismaCurrencyMapper.toPrisma(updateFineDto.currency),
        status: PrismaFineStatusMapper.toPrisma(updateFineDto.status),
        reason: updateFineDto.reason,
      },
      include: {
        House: {
          include: {
            User: true, // Assuming User is a User entity
            Condominium: true, // Assuming condominium is a Condominium entity
          },
        },
      },
    });

    return PrismaFineMapper.toDomain({
      prismaFine: fine,
      prismaHouse: {
        entity: fine.House,
        owner: fine.House.User,
        condominium: fine.House.Condominium,
      },
    });
  }
}
