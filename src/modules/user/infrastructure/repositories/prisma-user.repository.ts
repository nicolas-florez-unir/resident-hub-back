import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@common/database/prisma/prisma.service';
import { UserEntity } from '@user/domain/entities/user.entity';
import { CreateUserDto } from '@user/domain/dtos/create-user.dto';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { envs } from '@common/env/env.validation';
import { PrismaQueryError } from 'prisma/enums/PrismaQueryErrors.enum';
import { UserRoleMapper } from '../mappers/prisma/user-role.mapper';
import { UserAlreadyExistException } from '@user/domain/exceptions/user-already-exist.exception';
import { UserRole } from '@user/domain/enums/user-role.enum';
import { PrismaUserMapper } from '../mappers/prisma/prisma-user.mapper';

@Injectable()
export class PrismaUserRepository extends UserRepository {
  private readonly logger = new Logger(PrismaUserRepository.name);

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(dto: CreateUserDto): Promise<UserEntity> {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: this.encryptPassword(dto.password),
          first_name: dto.firstName,
          last_name: dto.lastName,
          phone: dto.phone,
          role: UserRoleMapper.toPrisma(dto.role),
          condominium_id: dto.condominiumId,
        },
      });

      return PrismaUserMapper.toDomain(newUser);
    } catch (error) {
      if (error.code === PrismaQueryError.UniqueConstraintViolation) {
        throw new UserAlreadyExistException(
          `User with email ${dto.email} already exists`,
        );
      }

      this.logger.error(error);

      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async update(user: UserEntity): Promise<UserEntity | null> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: UserRoleMapper.toPrisma(user.role),
        },
      });

      return PrismaUserMapper.toDomain(updatedUser);
    } catch (error) {
      if (error.code === PrismaQueryError.RecordsNotFound) {
        return null;
      }

      this.logger.error(error);

      throw error;
    }
  }

  private encryptPassword(password: string): string {
    return bcrypt.hashSync(password, envs.encryptSaltRounds);
  }

  async findAdministratorById(id: any): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
        role: 'administrator',
      },
    });

    if (!user) return null;

    return PrismaUserMapper.toDomain(user);
  }

  async findOwnersByCondominiumId(condominiumId: number): Promise<UserEntity[]> {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          condominium_id: condominiumId,
          role: {
            in: [UserRole.HouseOwner],
          },
        },
      });

      return users.map(PrismaUserMapper.toDomain);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
