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

@Module({
  controllers: [UserController],
  providers: [
    ApplicationJwtService,
    PrismaService,
    GetUserByIdUseCase,
    CreateUserUseCase,
    GetUserByEmailUseCase,
    UpdateUserUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [CreateUserUseCase, GetUserByIdUseCase, GetUserByEmailUseCase],
})
export class UserModule {}
