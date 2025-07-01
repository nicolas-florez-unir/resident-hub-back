import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserFromRequest } from '@common/decorators/user-from-request.decorator';
import { AuthGuard } from '@common/guards/auth.guard';
import { UserFromRequestInterface } from '@common/interfaces/user-from-request.interface';
import { HouseRepository } from '../../domain/repositories/house.repository';
import { RequiresRoles } from '@common/decorators/requires-role.decorator';
import { UserRole } from '@user/domain/enums/user-role.enum';
import { CreateHouseRequest } from '../requests/create-house.request';
import { HousePresenter } from '../presenters/house.presenter';

@UseGuards(AuthGuard)
@Controller('house')
export class HousesController {
  constructor(private readonly houseRepository: HouseRepository) {}

  @Get('by-condominium')
  async getHousesByCondominium(@UserFromRequest() user: UserFromRequestInterface) {
    const houses = await this.houseRepository.getByCondominiumId(user.condominium_id);
    return houses.map(HousePresenter.present);
  }

  @RequiresRoles([UserRole.Administrator])
  @Post()
  async createHouse(
    @UserFromRequest() user: UserFromRequestInterface,
    @Body() body: CreateHouseRequest,
  ) {
    const house = await this.houseRepository.create({
      condominiumId: user.condominium_id,
      houseNumber: body.houseNumber,
      ownerId: body.ownerId,
    });
    return HousePresenter.present(house);
  }

  @RequiresRoles([UserRole.Administrator])
  @Delete(':id')
  async deleteHouse(@Param('id', ParseIntPipe) houseId: number) {
    await this.houseRepository.delete(houseId);
  }

  @Patch(':id')
  async updateHouse(
    @Param('id', ParseIntPipe) houseId: number,
    @Body() body: CreateHouseRequest,
  ) {
    const house = await this.houseRepository.patch(
      houseId,
      body.houseNumber,
      body.ownerId,
    );
    return HousePresenter.present(house);
  }
}
