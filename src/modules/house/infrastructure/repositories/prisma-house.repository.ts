import { PrismaService } from '@common/database/prisma/prisma.service';
import { HouseRepository } from '../../domain/repositories/house.repository';
import { HouseEntity } from '../../domain/entities/house.entity';
import { Injectable } from '@nestjs/common';
import { CreateHouseDto } from '../../domain/dtos/create-house.dto';
import { PrismaHouseMapper } from '../mappers/prisma/prisma-house.mapper';

@Injectable()
export class PrismaHouseRepository extends HouseRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async getByCondominiumId(condominiumId: number): Promise<HouseEntity[]> {
    const houses = await this.prismaService.house.findMany({
      where: { condominium_id: condominiumId },
      include: {
        Condominium: true,
        User: true,
      },
    });

    return houses.map((house) =>
      PrismaHouseMapper.toDomain(house, house.User, house.Condominium),
    );
  }

  async create(dto: CreateHouseDto): Promise<HouseEntity> {
    const house = await this.prismaService.house.create({
      data: {
        house_number: dto.houseNumber,
        condominium_id: dto.condominiumId,
        owner_id: dto.ownerId,
      },
      include: {
        Condominium: true,
        User: true,
      },
    });

    return PrismaHouseMapper.toDomain(house, house.User, house.Condominium);
  }

  async delete(houseId: number): Promise<void> {
    await this.prismaService.house.delete({
      where: { id: houseId },
    });
  }

  async patch(
    houseId: number,
    houseNumber: string,
    ownerId: number,
  ): Promise<HouseEntity> {
    const house = await this.prismaService.house.update({
      where: { id: houseId },
      data: {
        house_number: houseNumber,
        owner_id: ownerId,
      },
      include: {
        Condominium: true,
        User: true,
      },
    });

    return PrismaHouseMapper.toDomain(house, house.User, house.Condominium);
  }
}
