import { Module } from '@nestjs/common';

import { AuthController } from './infrastructure/controllers/auth.controller';
import { UserSignUpUseCase } from './application/use-cases/user-sign-up.use-case';
import { UserLogInUseCase } from './application/use-cases/user-log-in.use-case';
import { UserModule } from '@user/user.module';
import { CondominiumModule } from '../condominium/condominium.module';
import { ApplicationJwtService } from './infrastructure/jwt/application-jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '@common/env/env.validation';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    CondominiumModule,
  ],
  controllers: [AuthController],
  providers: [ApplicationJwtService, UserSignUpUseCase, UserLogInUseCase],
})
export class AuthModule {}
