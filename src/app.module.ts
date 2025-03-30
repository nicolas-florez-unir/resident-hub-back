import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [AuthModule, HealthCheckModule, UserModule],
})
export class AppModule {}
