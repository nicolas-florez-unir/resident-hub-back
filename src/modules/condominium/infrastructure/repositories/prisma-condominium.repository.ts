import { Injectable, Logger } from '@nestjs/common';

import { CondominiumRepository } from '../../domain/repositories/condominium.repository';
import { CondominiumEntity } from '../../domain/entities/condominium.entity';
import { CreateCondominiumDto } from '../../domain/dtos/create-condominium.dto';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { PrismaQueryError } from 'prisma/enums/PrismaQueryErrors.enum';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { PrismaCondominiumMapper } from '../mappers/prisma/prisma-condominium.mapper';

@Injectable()
export class PrismaCondominiumRepository implements CondominiumRepository {
  private readonly logger = new Logger(PrismaCondominiumRepository.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateCondominiumDto): Promise<CondominiumEntity> {
    const createdCondominium = await this.prisma.condominium.create({
      data: {
        name: dto.name,
        address: dto.address,
      },
    });

    return PrismaCondominiumMapper.toDomain(createdCondominium);
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
          administrator_id: condominium.getAdministrator().id,
        },
        include: {
          User: {
            where: {
              id: condominium.getAdministrator()?.id,
            },
          },
        },
      });

      const entity = PrismaCondominiumMapper.toDomain(updated, null);
      const administrator = await this.userRepository.findById(updated.administrator_id);

      if (administrator) entity.setAdministrator(administrator);

      return entity;
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

    if (!condominium) return null;

    const entity = PrismaCondominiumMapper.toDomain(condominium, null);
    const administrator = await this.userRepository.findById(
      condominium.administrator_id,
    );

    if (administrator) entity.setAdministrator(administrator);

    return entity;
  }
}
