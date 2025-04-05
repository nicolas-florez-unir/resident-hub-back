import {
  Body,
  Controller,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateCondominiumRequest } from '../requests/CreateCondominium.request';
import { CreateCondominiumDto } from '../../domain/dtos/CreateCondominium.dto';
import { CondominiumPresenter } from '../presenters/Condominium.presenter';
import { CreateCondominiumUseCase } from '../../application/use-cases/create-condominium.use-case';
import { AssignAdministratorUseCase } from '../../application/use-cases/assign-administrator.use-case';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { CondominiumNotFoundException } from '../../domain/exceptions/condominiun-not-found.exception';

@Controller('condominium')
export class CondominiumController {
  constructor(
    private readonly createCondominiumUseCase: CreateCondominiumUseCase,
    private readonly assignAdministratorUseCase: AssignAdministratorUseCase,
  ) {}

  @Post()
  async createCondominium(@Body() request: CreateCondominiumRequest) {
    try {
      const condominium = await this.createCondominiumUseCase.execute(
        new CreateCondominiumDto(request.name, request.address),
      );

      return CondominiumPresenter.toObject(condominium);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Patch('/:condominiumId/administrator/:userId')
  async assignAdministrator(
    @Param('condominiumId', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    try {
      const condominium = await this.assignAdministratorUseCase.execute(
        id,
        userId,
      );

      return CondominiumPresenter.toObject(condominium);
    } catch (error) {
      if (error instanceof CondominiumNotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof UserNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
