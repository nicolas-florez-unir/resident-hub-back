import { Controller, Get, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { UserPresenter } from '@auth/infrastructure/presenters';
import { RequiresRoles } from '@common/decorators/requires-role.decorator';
import { UserFromRequest } from '@common/decorators/user-from-request.decorator';
import { UserFromRequestInterface } from '@common/interfaces/user-from-request.interface';
import { GetHouseOwnersByCondominiumUseCase } from '@condominium/application/use-cases/get-house-owners.use-case';
import { UserRole } from '@user/domain/enums/user-role.enum';
import { AuthGuard } from '@common/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('house-owner')
export class HouseOwnerController {
  constructor(
    private readonly getHouseOwnersByCondominiumUseCase: GetHouseOwnersByCondominiumUseCase,
  ) {}

  @RequiresRoles([UserRole.Administrator])
  @Get('/many-by-condominium')
  async getHouseOwners(@UserFromRequest() userFromRequest: UserFromRequestInterface) {
    try {
      const houseOwners = await this.getHouseOwnersByCondominiumUseCase.execute(
        userFromRequest.condominium_id,
      );

      return houseOwners.map((owner) => UserPresenter.present(owner));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
