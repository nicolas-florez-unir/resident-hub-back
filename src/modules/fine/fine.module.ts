import { Module } from '@nestjs/common';
import { FineController } from './infrastructure/controllers/fine.controller';
import { CreateFineUseCase } from './application/use-cases/create-fine.use-case';
import { GetFinesByCondominiumIdUseCase } from './application/use-cases/get-fines-by-condominium.use-case';
import { FineRepository } from './domain/repositories/fine.repository';
import { PrismaFineRepository } from './infrastructure/repositories/prisma-fine.repository';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { UpdateFineUseCase } from './application/use-cases/update-fine.use-case';
import { DeleteFineUseCase } from './application/use-cases/delete-fine.use-case';

@Module({
  controllers: [FineController],
  providers: [
    PrismaService,
    CreateFineUseCase,
    GetFinesByCondominiumIdUseCase,
    UpdateFineUseCase,
    DeleteFineUseCase,
    {
      provide: FineRepository,
      useClass: PrismaFineRepository,
    },
  ],
})
export class FineModule {}
