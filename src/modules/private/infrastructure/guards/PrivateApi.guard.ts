import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { envs } from '@common/env/env.validation';

@Injectable()
export class PrivateApiGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const privateApiSecret = request.headers['x-private-api-secret'];

    if (!privateApiSecret) {
      throw new UnauthorizedException('No private api secret provided');
    }

    const isValidRequest = privateApiSecret === envs.privateApiSecret;

    if (!isValidRequest) {
      throw new UnauthorizedException('Invalid private api secret');
    }

    return true;
  }
}
