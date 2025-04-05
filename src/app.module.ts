import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { UserModule } from './modules/user/user.module';
import { CondominiumModule } from './modules/condominium/condominium.module';
import { PrivateModule } from './modules/private/private.module';

@Module({
  imports: [
    AuthModule,
    HealthCheckModule,
    UserModule,
    CondominiumModule,
    PrivateModule,
  ],
})
export class AppModule {}
