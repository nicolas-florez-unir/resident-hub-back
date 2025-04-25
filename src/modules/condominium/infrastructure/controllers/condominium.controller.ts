import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  InternalServerErrorException,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { CreateCondominiumRequest } from '../requests/CreateCondominium.request';
import { CreateCondominiumDto } from '../../domain/dtos/CreateCondominium.dto';
import { CondominiumPresenter } from '../presenters/Condominium.presenter';
import { CreateCondominiumUseCase } from '../../application/use-cases/create-condominium.use-case';
import { AssignAdministratorUseCase } from '../../application/use-cases/assign-administrator.use-case';
import { CondominiumNotFoundException } from '../../domain/exceptions/condominiun-not-found.exception';
import { UserFromRequest } from '@common/decorators/user-from-request.decorator';
import { UserFromRequestInterface } from '@common/interfaces/user-from-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequiresRoles } from '@common/decorators/requires-role.decorator';
import { UserRole } from '@user/domain/enums/UserRole.enum';
import { UpdateCondominiumLogoUseCase } from '@condominium/application/use-cases/update-condominium-logo.use-case';
import { GetCondominiumByIdUseCase } from '../../application/use-cases/get-condominium-by-id.use-case';
import { AuthGuard } from '@common/guards/auth.guard';

@Controller('condominium')
export class CondominiumController {
  constructor(
    private readonly createCondominiumUseCase: CreateCondominiumUseCase,
    private readonly assignAdministratorUseCase: AssignAdministratorUseCase,
    private readonly getCondominiumByIdUseCase: GetCondominiumByIdUseCase,
    private readonly updateCondominiumLogoUseCase: UpdateCondominiumLogoUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/info')
  async getCondominiumInfo(@UserFromRequest() userFromRequest: UserFromRequestInterface) {
    try {
      const condominium = await this.getCondominiumByIdUseCase.execute(
        userFromRequest.condominium_id,
      );

      return CondominiumPresenter.toObject(condominium);
    } catch (error) {
      if (error instanceof CondominiumNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new InternalServerErrorException(error.message);
    }
  }

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
      const condominium = await this.assignAdministratorUseCase.execute(id, userId);

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

  @RequiresRoles([UserRole.Administrator])
  @UseInterceptors(FileInterceptor('file'))
  @Put('/logo')
  async uploadLogo(
    @UploadedFile(
      'file',
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }), // 100KB
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @UserFromRequest() userFromRequest: UserFromRequestInterface,
  ) {
    try {
      const condominium = await this.getCondominiumByIdUseCase.execute(
        userFromRequest.condominium_id,
      );

      await this.updateCondominiumLogoUseCase.execute(file, condominium);
    } catch (error) {
      if (error instanceof CondominiumNotFoundException) {
        throw new NotFoundException(error.message);
      }

      throw new InternalServerErrorException(error.message);
    }
  }
}
