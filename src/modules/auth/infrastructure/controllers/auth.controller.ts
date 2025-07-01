import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { InvalidCredentialsException } from '@auth/domain/exceptions/invalid-credentials.exception';
import { ApplicationJwtService } from '../jwt/application-jwt.service';
import { UserLoggedPresenter, UserPresenter } from '../presenters';
import { UserLogInRequest, UserSignUpRequest } from '../requests';
import { UserLogInUseCase, UserSignUpUseCase } from '@auth/application/use-cases';
import { GetUserByIdUseCase } from '@user/application/use-cases/get-user-by-id.use-case';
import { CreateUserDto } from '@user/domain/dtos/create-user.dto';
import {
  UserNotFoundException,
  UserAlreadyExistException,
} from '@user/domain/exceptions';
import { TokenError } from '@auth/domain/error/token.error';
import { EntityNotFoundException } from '@common/exceptions/entity-not-found.exception';
import { UserEntity } from '@user/domain/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userSignUpUseCase: UserSignUpUseCase,
    private readonly userLogInUseCase: UserLogInUseCase,
    private readonly applicationJwtService: ApplicationJwtService,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Post('sign-up')
  async signUp(@Body() request: UserSignUpRequest) {
    try {
      const newUser = await this.userSignUpUseCase.execute(
        new CreateUserDto(
          request.condominiumId,
          request.email,
          request.password,
          request.firstName,
          request.lastName,
          request.phone,
          request.role,
        ),
      );

      return UserPresenter.present(newUser);
    } catch (error) {
      if (error instanceof UserAlreadyExistException) {
        throw new ConflictException(error.message);
      }

      if (error instanceof EntityNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() request: UserLogInRequest, @Res() response: Response) {
    try {
      const user = await this.userLogInUseCase.execute(request.email, request.password);
      return this.generateUserLoggedResponse(user, response);
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        throw new UnauthorizedException(error.message);
      }

      throw new BadRequestException(error.message);
    }
  }

  @Post('validate-access-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Req() req, @Res() res: Response) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    try {
      this.applicationJwtService.validateAccessToken(token);
    } catch {
      throw new UnauthorizedException(TokenError.INVALID);
    }

    try {
      const decodedToken = this.applicationJwtService.decodeToken(token);

      const user = await this.getUserByIdUseCase.execute(decodedToken.id);

      return this.generateUserLoggedResponse(user, res);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UnauthorizedException(error.message);
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('refresh-access-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() request: Request, @Res() response: Response) {
    const refreshToken = request.cookies['refreshToken'] || 'invalid-token';

    try {
      this.applicationJwtService.validateRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Refresh token expired');
    }

    try {
      const decodedToken = this.applicationJwtService.decodeToken(refreshToken);
      // Check if the user exists
      const user = await this.getUserByIdUseCase.execute(decodedToken.id);

      return this.generateUserLoggedResponse(user, response);
    } catch (error) {
      if (error instanceof UserNotFoundException)
        throw new UnauthorizedException(error.message);

      throw new InternalServerErrorException(error.message);
    }
  }

  private generateUserLoggedResponse(user: UserEntity, response: Response) {
    const tokenPayload = {
      id: user.id,
      role: user.role,
      condominium_id: user.condominiumId,
    };

    const accessToken = this.applicationJwtService.generateAccessToken(tokenPayload);
    const refreshToken = this.applicationJwtService.generateRefreshToken(tokenPayload);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    return response.json(UserLoggedPresenter.present(user, accessToken));
  }
}
