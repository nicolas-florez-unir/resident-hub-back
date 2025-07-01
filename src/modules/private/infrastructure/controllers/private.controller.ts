import {
  Body,
  ConflictException,
  Controller,
  InternalServerErrorException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateNewClientRequest } from '../requests/create-new-client.request';
import { CreateNewClientUseCase } from '../../application/use-cases/create-new-client.use-case';
import { PrivateApiGuard } from '../guards/PrivateApi.guard';
import { UserAlreadyExistException } from '@user/domain/exceptions/user-already-exist.exception';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard, PrivateApiGuard)
@Controller('private')
export class PrivateController {
  constructor(private readonly CreateNewClientUseCase: CreateNewClientUseCase) {}

  @Post('create-new-client')
  async createNewClient(@Body() request: CreateNewClientRequest) {
    try {
      await this.CreateNewClientUseCase.execute({
        condominium: request.condominium,
        administrator: {
          email: request.administrator.email,
          firstName: request.administrator.firstName,
          lastName: request.administrator.lastName,
        },
      });
    } catch (error) {
      if (error instanceof UserAlreadyExistException) {
        throw new ConflictException('User already exists, please use another email');
      }
      throw new InternalServerErrorException(error);
    }
  }
}
