import { FineEntity } from '../../domain/entities/fine.entity';
import { HousePresenter } from 'src/modules/house/infrastructure/presenters/house.presenter';

export class FinePresenter {
  static present(fineEntity: FineEntity) {
    return {
      id: fineEntity.id,
      type: fineEntity.type,
      houseId: fineEntity.house.getId(),
      issuedDate: fineEntity.issuedDate,
      amount: fineEntity.amount,
      currency: fineEntity.currency,
      status: fineEntity.status,
      reason: fineEntity.reason,
      house: HousePresenter.present(fineEntity.house),
    };
  }
}
