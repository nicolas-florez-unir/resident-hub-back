import { Module } from '@nestjs/common';
import { HouseOwnerController } from './infrastructure/controllers/house-owner.controller';
import { GetHouseOwnersByCondominiumUseCase } from '@condominium/application/use-cases/get-house-owners.use-case';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { PrismaUserRepository } from '@user/infrastructure/repositories/prisma-user.repository';
import { PrismaService } from '@common/database/prisma/prisma.service';

@Module({
  controllers: [HouseOwnerController],
  providers: [
    GetHouseOwnersByCondominiumUseCase,
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [],
})
export class HouseOwnerModule {}
