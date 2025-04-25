import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserFromRequestSchema } from '../schemas/user-from-request.schema';
import { TokenError } from '@auth/domain/error/token.error';
import { envs } from '@common/env/env.validation';

@Injectable()
export class AuthGuard implements CanActivate {
  private logger = new Logger(AuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(TokenError.NOT_FOUND);
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: envs.jwt.access.secret,
      });

      const tokenValidation = UserFromRequestSchema.validate(payload);

      if (tokenValidation.error) {
        throw new Error(tokenValidation.error.message);
      }

      request['user'] = payload;
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException(TokenError.INVALID);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
