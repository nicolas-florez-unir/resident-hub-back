import { Module } from '@nestjs/common';
import { CondominiumController } from './infrastructure/controllers/condominium.controller';
import { CondominiumRepository } from './domain/repositories/condominium.repository';
import { PrismaCondominiumRepository } from './infrastructure/repositories/prisma-condominium.repository';
import { AssignAdministratorUseCase } from './application/use-cases/assign-administrator.use-case';
import { CreateCondominiumUseCase } from './application/use-cases/create-condominium.use-case';
import { UserModule } from '@user/user.module';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { GetCondominiumByIdUseCase } from './application/use-cases/get-condominium-by-id.use-case';

@Module({
  imports: [UserModule],
  controllers: [CondominiumController],
  providers: [
    PrismaService,
    AssignAdministratorUseCase,
    CreateCondominiumUseCase,
    GetCondominiumByIdUseCase,
    {
      provide: CondominiumRepository,
      useClass: PrismaCondominiumRepository,
    },
  ],
  exports: [
    GetCondominiumByIdUseCase,
    CreateCondominiumUseCase,
    AssignAdministratorUseCase,
  ],
})
export class CondominiumModule {}
