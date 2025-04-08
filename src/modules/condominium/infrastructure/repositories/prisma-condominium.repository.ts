import { Injectable, Logger } from '@nestjs/common';
import { CondominiumRepository } from '../../domain/repositories/condominium.repository';
import { CondominiumEntity } from '../../domain/entities/condominium.entity';

import { CreateCondominiumDto } from '../../domain/dtos/CreateCondominium.dto';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { PrismaQueryError } from 'prisma/enums/PrismaQueryErrors.enum';

@Injectable()
export class PrismaCondominiumRepository implements CondominiumRepository {
  private readonly logger = new Logger(PrismaCondominiumRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCondominiumDto): Promise<CondominiumEntity> {
    const createdCondominium = await this.prisma.condominium.create({
      data: {
        name: dto.name,
        address: dto.address,
      },
    });

    return new CondominiumEntity(
      createdCondominium.id,
      createdCondominium.name,
      createdCondominium.address,
      createdCondominium.administrator_id,
      createdCondominium.logo,
      createdCondominium.created_at,
      createdCondominium.updated_at,
    );
  }

  async update(condominium: CondominiumEntity): Promise<CondominiumEntity> {
    try {
      const updated = await this.prisma.condominium.update({
        where: {
          id: condominium.getId(),
        },
        data: {
          name: condominium.getName(),
          address: condominium.getAddress(),
          logo: condominium.getLogo(),
          administrator_id: condominium.getAdministratorId(),
        },
      });

      return new CondominiumEntity(
        updated.id,
        updated.name,
        updated.address,
        updated.administrator_id,
        updated.logo,
        updated.created_at,
        updated.updated_at,
      );
    } catch (error) {
      if (error.code === PrismaQueryError.RecordsNotFound) {
        return null;
      }

      this.logger.error(error);

      throw error;
    }
  }

  async findById(id: number): Promise<CondominiumEntity | null> {
    const condominium = await this.prisma.condominium.findUnique({
      where: {
        id,
      },
    });

    if (!condominium) {
      return null;
    }

    return new CondominiumEntity(
      condominium.id,
      condominium.name,
      condominium.address,
      condominium.administrator_id,
      condominium.logo,
      condominium.created_at,
      condominium.updated_at,
    );
  }
}
