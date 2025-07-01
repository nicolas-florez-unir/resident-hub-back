import { Module } from '@nestjs/common';
import { CondominiumController } from './infrastructure/controllers/condominium.controller';
import { CondominiumRepository } from './domain/repositories/condominium.repository';
import { PrismaCondominiumRepository } from './infrastructure/repositories/prisma-condominium.repository';
import {
  AssignAdministratorUseCase,
  CreateCondominiumUseCase,
  GetCondominiumByIdUseCase,
  UpdateCondominiumLogoUseCase,
  DeleteCondominiumLogoUseCase,
  UpdateCondominiumUseCase,
} from './application/use-cases';
import { UserModule } from '@user/user.module';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { LocalStorageStrategy } from '@files/application/strategies/local-storage.strategy';
import { StorageStrategy } from '@files/domain/strategies/storage.strategy';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { PrismaUserRepository } from '@user/infrastructure/repositories/prisma-user.repository';
import { GetHouseOwnersByCondominiumUseCase } from './application/use-cases/get-house-owners.use-case';

@Module({
  imports: [UserModule],
  controllers: [CondominiumController],
  providers: [
    PrismaService,
    AssignAdministratorUseCase,
    CreateCondominiumUseCase,
    GetCondominiumByIdUseCase,
    UpdateCondominiumLogoUseCase,
    DeleteCondominiumLogoUseCase,
    UpdateCondominiumUseCase,
    GetHouseOwnersByCondominiumUseCase,
    {
      provide: CondominiumRepository,
      useClass: PrismaCondominiumRepository,
    },
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: StorageStrategy,
      useValue: new LocalStorageStrategy(),
    },
  ],
  exports: [
    GetCondominiumByIdUseCase,
    CreateCondominiumUseCase,
    AssignAdministratorUseCase,
  ],
})
export class CondominiumModule {}
