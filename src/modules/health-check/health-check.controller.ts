import { Controller, Get } from '@nestjs/common';

@Controller('health-check')
export class HealthCheckController {
  constructor() {}

  @Get()
  getHealthCheck(): Record<any, any> {
    return {
      status: 'ok',
    };
  }
}
