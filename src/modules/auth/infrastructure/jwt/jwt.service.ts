import { Injectable, Logger } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

type TokenPayload = {
  id: number;
};

@Injectable()
export class JwtService {
  private readonly logger: Logger = new Logger(JwtService.name);

  constructor(private readonly jwtService: NestJwtService) {}

  async generateToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async decodeToken(token: string): Promise<TokenPayload> {
    return this.jwtService.decode(token);
  }

  validateToken(token: string): boolean {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (e) {
      this.logger.warn(e);
      return false;
    }
  }
}
