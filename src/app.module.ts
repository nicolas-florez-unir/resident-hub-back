import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { UserModule } from './modules/user/user.module';
import { CondominiumModule } from './modules/condominium/condominium.module';
import { PrivateModule } from './modules/private/private.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    AuthModule,
    HealthCheckModule,
    UserModule,
    CondominiumModule,
    PrivateModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
  ],
})
export class AppModule {}
