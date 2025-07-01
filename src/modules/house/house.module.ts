import { Module } from '@nestjs/common';
import { HousesController } from './infrastructure/controllers/houses.controller';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { HouseRepository } from './domain/repositories/house.repository';
import { PrismaHouseRepository } from './infrastructure/repositories/prisma-house.repository';

@Module({
  controllers: [HousesController],
  providers: [
    PrismaService,
    {
      provide: HouseRepository,
      useClass: PrismaHouseRepository,
    },
  ],
  exports: [],
})
export class HouseModule {}
