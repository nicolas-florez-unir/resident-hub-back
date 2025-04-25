import { envs } from '@common/env/env.validation';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@user/domain/enums/UserRole.enum';

type TokenPayload = {
  id: number;
  role: UserRole;
  condominium_id: number;
};

@Injectable()
export class ApplicationJwtService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: envs.jwt.access.secret,
      expiresIn: envs.jwt.access.expiration,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: envs.jwt.refresh.secret,
      expiresIn: envs.jwt.refresh.expiration,
    });
  }

  decodeToken(token: string): TokenPayload {
    const decoded = this.jwtService.decode(token);

    return {
      id: decoded['id'],
      condominium_id: decoded['condominium_id'],
      role: decoded['role'],
    };
  }

  validateAccessToken(accessToken: string) {
    this.jwtService.verify(accessToken, {
      secret: envs.jwt.access.secret,
    });
  }

  validateRefreshToken(refreshToken: string) {
    this.jwtService.verify(refreshToken, {
      secret: envs.jwt.refresh.secret,
    });
  }
}
