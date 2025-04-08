import { CondominiumModule } from '@condominium/condominium.module';
import { Module } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { CreateNewClientUseCase } from './application/use-cases/create-new-client.use-case';
import { PrivateController } from './infrastructure/controllers/private.controller';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  controllers: [PrivateController],
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: 1,
          ttl: 6000,
        },
      ],
    }),
    UserModule,
    CondominiumModule,
  ],
  providers: [CreateNewClientUseCase],
})
export class PrivateModule {}
