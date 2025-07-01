import { AuthGuard } from '@common/guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GetFinesByCondominiumIdUseCase } from '../../application/use-cases/get-fines-by-condominium.use-case';
import { CreateFineUseCase } from '../../application/use-cases/create-fine.use-case';
import { RequiresRoles } from '@common/decorators/requires-role.decorator';
import { UserRole } from '@user/domain/enums/user-role.enum';
import { UserFromRequest } from '@common/decorators/user-from-request.decorator';
import { UserFromRequestInterface } from '@common/interfaces/user-from-request.interface';
import { FinePresenter } from '../presenters/fine.presenter';
import { CreateFineRequest } from '../requests/create-fine.request';
import { UpdateFineUseCase } from '../../application/use-cases/update-fine.use-case';
import { DeleteFineUseCase } from '../../application/use-cases/delete-fine.use-case';

@UseGuards(AuthGuard)
@Controller('fine')
export class FineController {
  constructor(
    private readonly createFineUseCase: CreateFineUseCase,
    private readonly updateFineUseCase: UpdateFineUseCase,
    private readonly deleteFineUseCase: DeleteFineUseCase,
    private readonly getFinesByCondominiumIdUseCase: GetFinesByCondominiumIdUseCase,
  ) {}

  @RequiresRoles([UserRole.Administrator])
  @Get('/all')
  async getFinesByCondominiumId(@UserFromRequest() user: UserFromRequestInterface) {
    try {
      const fines = await this.getFinesByCondominiumIdUseCase.execute(
        user.condominium_id,
      );

      return fines.map(FinePresenter.present);
    } catch (error) {
      console.error('Error fetching fines:', error);
      throw error; // Re-throw the error to be handled by the global exception filter
    }
  }

  @RequiresRoles([UserRole.Administrator])
  @Post()
  async createFine(@Body() request: CreateFineRequest) {
    try {
      const fine = await this.createFineUseCase.execute({
        type: request.type,
        houseId: request.houseId,
        reason: request.reason,
        issuedDate: new Date(request.issuedDate),
        amount: request.amount,
        currency: request.currency,
        status: request.status,
      });

      return FinePresenter.present(fine);
    } catch (error) {
      console.error('Error creating fine:', error);
      throw error; // Re-throw the error to be handled by the global exception filter
    }
  }

  @RequiresRoles([UserRole.Administrator])
  @Put('/:id')
  async updateFine(
    @Body() request: CreateFineRequest,
    @Param('id', ParseIntPipe) fineId: number,
  ) {
    try {
      const fine = await this.updateFineUseCase.execute({
        id: fineId,
        type: request.type,
        houseId: request.houseId,
        reason: request.reason,
        issuedDate: new Date(request.issuedDate),
        amount: request.amount,
        currency: request.currency,
        status: request.status,
      });

      return FinePresenter.present(fine);
    } catch (error) {
      console.error('Error updating fine:', error);
      throw error; // Re-throw the error to be handled by the global exception filter
    }
  }

  @RequiresRoles([UserRole.Administrator])
  @Delete('/:id')
  async deleteFine(@Param('id', ParseIntPipe) fineId: number) {
    try {
      await this.deleteFineUseCase.execute(fineId);
      return { message: 'Fine deleted successfully' };
    } catch (error) {
      console.error('Error deleting fine:', error);
      throw error; // Re-throw the error to be handled by the global exception filter
    }
  }
}
