import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@user/domain/enums/UserRole.enum';

type TokenPayload = {
  id: number;
  role: UserRole;
  condominium_id: number;
};

@Injectable()
export class ApplicationJwtService {
  private readonly logger: Logger = new Logger(ApplicationJwtService.name);

  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload);
  }

  decodeToken(token: string): TokenPayload {
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
