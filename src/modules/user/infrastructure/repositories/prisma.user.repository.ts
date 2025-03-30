import { Injectable } from '@nestjs/common';
import { UserRole as UserRolePrisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '@common/database/prisma/prisma.service';
import { UserEntity } from '@user/domain/entities/User.entity';
import { CreateUserDto } from '@user/domain/dtos/CreateUserDto';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { DuplicatedEmailException } from '@user/domain/exceptions/duplicated-email.exception';
import { envs } from '@common/env/env.validation';
import { PrismaQueryError } from 'prisma/enums/PrismaQueryErrors.enum';
import { UserRole as UserRoleDomain } from '@user/domain/enums/UserRole.enum';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';

@Injectable()
export class PrismaUserRepository extends UserRepository {
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
          role: UserRolePrisma[dto.role as keyof typeof UserRolePrisma],
        },
      });

      return new UserEntity(
        newUser.id,
        newUser.email,
        newUser.password,
        newUser.first_name,
        newUser.last_name,
        newUser.phone,
        UserRoleDomain[newUser.role as keyof typeof UserRoleDomain],
        newUser.created_at,
        newUser.updated_at,
      );
    } catch (error) {
      if (error.code === PrismaQueryError.UniqueConstraintViolation) {
        throw new DuplicatedEmailException(
          `User with email ${dto.email} already exists`,
        );
      }
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.email,
      user.password,
      user.first_name,
      user.last_name,
      user.phone,
      UserRoleDomain[user.role as keyof typeof UserRoleDomain],
      user.created_at,
      user.updated_at,
    );
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) return null;

    return new UserEntity(
      user.id,
      user.email,
      user.password,
      user.first_name,
      user.last_name,
      user.phone,
      UserRoleDomain[user.role as keyof typeof UserRoleDomain],
      user.created_at,
      user.updated_at,
    );
  }

  async update(user: UserEntity): Promise<UserEntity> {
    let updatedUser;
    try {
      updatedUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: UserRolePrisma[user.role as keyof typeof UserRoleDomain],
        },
      });
    } catch (error) {
      console.log(error);
      if (error.code === PrismaQueryError.RecordsNotFound) {
        throw new UserNotFoundException(`User with id ${user.id} not found`);
      }
    }

    return new UserEntity(
      updatedUser.id,
      updatedUser.email,
      updatedUser.password,
      updatedUser.first_name,
      updatedUser.last_name,
      updatedUser.phone,
      UserRoleDomain[updatedUser.role as keyof typeof UserRoleDomain],
      updatedUser.created_at,
      updatedUser.updated_at,
    );
  }

  private encryptPassword(password: string): string {
    return bcrypt.hashSync(password, envs.encryptSaltRounds);
  }
}
