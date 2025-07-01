import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './infrastructure/controllers/auth.controller';
import { UserSignUpUseCase, UserLogInUseCase } from './application/use-cases';
import { UserModule } from '@user/user.module';
import { CondominiumModule } from '@condominium/condominium.module';
import { ApplicationJwtService } from './infrastructure/jwt/application-jwt.service';

@Module({
  imports: [JwtModule.register({ global: true }), UserModule, CondominiumModule],
  controllers: [AuthController],
  providers: [ApplicationJwtService, UserSignUpUseCase, UserLogInUseCase],
})
export class AuthModule {}
