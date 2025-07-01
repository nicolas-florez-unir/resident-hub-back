import { UserPresenter } from '@auth/infrastructure/presenters/user.presenter';
import { CondominiumEntity } from '../../domain/entities/condominium.entity';

export class CondominiumPresenter {
  public static present(condominiumEntity: CondominiumEntity) {
    return {
      id: condominiumEntity.getId(),
      name: condominiumEntity.getName(),
      logo: condominiumEntity.getLogo(),
      address: condominiumEntity.getAddress(),
      administrator: condominiumEntity.getAdministrator()
        ? UserPresenter.present(condominiumEntity.getAdministrator())
        : null,
      createdAt: condominiumEntity.getCreatedAt().toString(),
      updatedAt: condominiumEntity.getUpdatedAt().toString(),
    };
  }
}
