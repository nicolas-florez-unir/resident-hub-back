import { CondominiumModule } from '@condominium/condominium.module';
import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { CreateNewClientUseCase } from './application/use-cases/create-new-client.use-case';
import { PrivateController } from './infrastructure/controllers/private.controller';

@Module({
  controllers: [PrivateController],
  imports: [UserModule, CondominiumModule],
  providers: [CreateNewClientUseCase],
})
export class PrivateModule {}
