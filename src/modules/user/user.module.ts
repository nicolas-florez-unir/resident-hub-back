import { Module } from '@nestjs/common';

import { PrismaService } from '@common/database/prisma/prisma.service';
import { UserRepository } from './domain/repositories/user.repository';
import { PrismaUserRepository } from './infrastructure/repositories/prisma.user.repository';
import { UserController } from './infrastructure/controllers/user.controller';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { ApplicationJwtService } from '@auth/infrastructure/jwt/application-jwt.service';
import { GetAdministratorByIdUseCase } from './application/use-cases/get-administrator-by-id.use-case';

@Module({
  controllers: [UserController],
  providers: [
    ApplicationJwtService,
    PrismaService,
    GetUserByIdUseCase,
    CreateUserUseCase,
    GetUserByEmailUseCase,
    UpdateUserUseCase,
    GetAdministratorByIdUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [
    CreateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    GetAdministratorByIdUseCase,
  ],
})
export class UserModule {}
