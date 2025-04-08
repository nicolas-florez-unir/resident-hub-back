import { Module } from '@nestjs/common';
import { CondominiumController } from './infrastructure/controllers/condominium.controller';
import { CondominiumRepository } from './domain/repositories/condominium.repository';
import { PrismaCondominiumRepository } from './infrastructure/repositories/prisma-condominium.repository';
import { AssignAdministratorUseCase } from './application/use-cases/assign-administrator.use-case';
import { CreateCondominiumUseCase } from './application/use-cases/create-condominium.use-case';
import { UserModule } from '@user/user.module';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { GetCondominiumByIdUseCase } from './application/use-cases/get-condominium-by-id.use-case';
import { LocalStorageStrategy } from '../files/application/strategies/local-storage.strategy';
import { StorageStrategy } from '../files/domain/strategies/storage.strategy';
import { UpdateCondominiumLogoUseCase } from './application/use-cases/update-condominium-logo.use-case';
import { DeleteCondominiumLogoUseCase } from './application/use-cases/delete-condominium-logo.use-case';

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
    {
      provide: CondominiumRepository,
      useClass: PrismaCondominiumRepository,
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
