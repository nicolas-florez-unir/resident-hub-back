import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './infrastructure/controllers/auth.controller';
import { UserSignUpUseCase } from './application/use-cases/user-sign-up.use-case';
import { UserLogInUseCase } from './application/use-cases/user-log-in.use-case';
import { JwtService } from './infrastructure/jwt/jwt.service';
import { UserModule } from '@user/user.module';
import { envs } from '@common/env/env.validation';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [JwtService, UserSignUpUseCase, UserLogInUseCase],
})
export class AuthModule {}
