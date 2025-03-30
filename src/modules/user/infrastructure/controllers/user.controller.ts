import {
  Body,
  Controller,
  Get,
  HttpException,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@common/guards/auth.guard';
import { UserFromRequest } from '@common/decorators/user-from-request.decorator';
import { UserFromRequestInterface } from '@common/interfaces/user-from-request.interface';
import { UserPresenter } from '@auth/infrastructure/presenters/User.presenter';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { GetUserByIdUseCase } from '@user/application/use-cases/get-user-by-id.use-case';
import { UpdateUserRequest } from '../requests/UpdateUser.request';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.use-case';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Get('info')
  async getUserInfo(
    @UserFromRequest() userFromRequest: UserFromRequestInterface,
  ) {
    try {
      const user = await this.getUserByIdUseCase.execute(userFromRequest.id);
      return UserPresenter.toObject(user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(error.message, 404);
      }
    }
  }

  @Put()
  async updateUser(
    @UserFromRequest() userFromRequest: UserFromRequestInterface,
    @Body() request: UpdateUserRequest,
  ) {
    try {
      const user = await this.getUserByIdUseCase.execute(userFromRequest.id);

      user.update(
        request.email,
        request.firstName,
        request.lastName,
        request.phone,
      );

      const userUpdated = await this.updateUserUseCase.execute(user);
      return UserPresenter.toObject(userUpdated);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(error.message, 404);
      }
    }
  }
}
