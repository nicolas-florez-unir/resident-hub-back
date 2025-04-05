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
  Request,
  UnauthorizedException,
} from '@nestjs/common';

import { InvalidCredentialsException } from '@auth/domain/exceptions/invalid-credentials.exception';
import { ApplicationJwtService } from '../jwt/application-jwt.service';
import { UserLoggedPresenter } from '../presenters/user-logged.presenter';
import { UserLogInRequest } from '../requests/UserLogIn.request';
import { UserLogInUseCase } from '@auth/application/use-cases/user-log-in.use-case';
import { UserPresenter } from '../presenters/User.presenter';
import { UserSignUpRequest } from '../requests/UserSignUp.request';
import { UserSignUpUseCase } from '@auth/application/use-cases/user-sign-up.use-case';
import { GetUserByIdUseCase } from '@user/application/use-cases/get-user-by-id.use-case';
import { CreateUserDto } from '@user/domain/dtos/CreateUserDto';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { TokenError } from '@auth/domain/error/token.error';
import { EntityNotFoundException } from '@common/exceptions/entity-not-found.exception';
import { UserAlreadyExistException } from '@user/domain/exceptions/user-already-exist.exception';

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

      return UserPresenter.toObject(newUser);
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
  async login(@Body() request: UserLogInRequest) {
    try {
      const user = await this.userLogInUseCase.execute(
        request.email,
        request.password,
      );

      const token = this.applicationJwtService.generateToken({
        id: user.id,
        role: user.role,
        condominium_id: user.condominiumId,
      });

      return UserLoggedPresenter.present(user, token);
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        throw new UnauthorizedException(error.message);
      }

      throw new BadRequestException(error.message);
    }
  }

  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Request() req) {
    const token = req.headers.authorization?.split('Bearer ')[1];

    const isValid = this.applicationJwtService.validateToken(token);
    if (!isValid) throw new UnauthorizedException(TokenError.INVALID);

    const decodedToken = this.applicationJwtService.decodeToken(token);

    try {
      const user = await this.getUserByIdUseCase.execute(decodedToken.id);

      return UserLoggedPresenter.present(user, token);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new UnauthorizedException(error.message);
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
