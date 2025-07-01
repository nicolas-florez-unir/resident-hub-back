import { UserPresenter } from '@auth/infrastructure/presenters';
import { HouseEntity } from '../../domain/entities/house.entity';
import { CondominiumPresenter } from '@condominium/infrastructure/presenters/condominium.presenter';

export class HousePresenter {
  static present(house: HouseEntity): any {
    return {
      id: house.getId(),
      houseNumber: house.getHouseNumber(),
      owner: UserPresenter.present(house.getOwner()),
      condominium: CondominiumPresenter.present(house.getCondominium()),
      createdAt: house.getCreatedAt(),
      updatedAt: house.getUpdatedAt(),
    };
  }
}
