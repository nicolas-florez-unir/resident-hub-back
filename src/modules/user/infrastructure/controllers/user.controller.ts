import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@common/guards/auth.guard';
import { UserFromRequest } from '@common/decorators/user-from-request.decorator';
import { UserFromRequestInterface } from '@common/interfaces/user-from-request.interface';
import { UserPresenter } from '@auth/infrastructure/presenters/user.presenter';
import {
  UserNotFoundException,
  UserAlreadyExistException,
} from '../../domain/exceptions';
import {
  GetUserByIdUseCase,
  UpdateUserUseCase,
  CreateUserUseCase,
} from '@user/application/use-cases';
import { CreateUserRequest, UpdateUserRequest } from '../requests';
import { RequiresRoles } from '@common/decorators/requires-role.decorator';
import { UserRole } from '@user/domain/enums/user-role.enum';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.use-case';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Get('info')
  async getUserInfo(@UserFromRequest() userFromRequest: UserFromRequestInterface) {
    try {
      const user = await this.getUserByIdUseCase.execute(userFromRequest.id);
      return UserPresenter.present(user);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(error.message, 404);
      }
    }
  }

  @Put()
  async updateUserFromRequest(
    @UserFromRequest() userFromRequest: UserFromRequestInterface,
    @Body() request: UpdateUserRequest,
  ) {
    try {
      const user = await this.getUserByIdUseCase.execute(userFromRequest.id);

      user.update(request.email, request.firstName, request.lastName, request.phone);

      const userUpdated = await this.updateUserUseCase.execute(user);
      return UserPresenter.present(userUpdated);
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(error.message, 404);
      }
    }
  }

  @RequiresRoles([UserRole.Administrator])
  @Post()
  async createUser(
    @Body() request: CreateUserRequest,
    @UserFromRequest() userFromRequest: UserFromRequestInterface,
  ) {
    try {
      const user = await this.createUserUseCase.execute({
        condominiumId: userFromRequest.condominium_id,
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        password: request.password,
        phone: request.phone,
        role: request.role,
      });

      return UserPresenter.present(user);
    } catch (error) {
      if (error instanceof UserAlreadyExistException) {
        throw new ConflictException('User already exists, please use another email');
      }

      throw new InternalServerErrorException(error);
    }
  }

  @RequiresRoles([UserRole.Administrator])
  @Patch('/:id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() request: UpdateUserRequest,
  ) {
    try {
      const user = await this.getUserByIdUseCase.execute(id);

      user.update(request.email, request.firstName, request.lastName, request.phone);

      const userUpdated = await this.updateUserUseCase.execute(user);

      return UserPresenter.present(userUpdated);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @RequiresRoles([UserRole.Administrator])
  @Delete('/:id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.deleteUserUseCase.execute(id);
      return;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
