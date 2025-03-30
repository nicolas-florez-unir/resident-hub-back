import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';

import { DuplicatedEmailException } from '@user/domain/exceptions/duplicated-email.exception';
import { InvalidCredentialsException } from '@auth/domain/exceptions/invalid-credentials.exception';
import { JwtService } from '../jwt/jwt.service';
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userSignUpUseCase: UserSignUpUseCase,
    private readonly userLogInUseCase: UserLogInUseCase,
    private readonly jwtService: JwtService,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Post('sign-up')
  async signUp(@Body() request: UserSignUpRequest) {
    try {
      const newUser = await this.userSignUpUseCase.execute(
        new CreateUserDto(
          request.email,
          request.password,
          request.firstName,
          request.lastName,
          request.phone,
          request.role,
          new Date(),
          new Date(),
        ),
      );

      return UserPresenter.toObject(newUser);
    } catch (error) {
      if (error instanceof DuplicatedEmailException) {
        throw new ConflictException(error.message);
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

      const token = await this.jwtService.generateToken({ id: user.id });

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

    const isValid = this.jwtService.validateToken(token);
    if (!isValid) throw new UnauthorizedException(TokenError.INVALID);

    const decodedToken = await this.jwtService.decodeToken(token);

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
