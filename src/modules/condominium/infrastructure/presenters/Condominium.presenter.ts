import { CondominiumEntity } from '../../domain/entities/condominium.entity';

export class CondominiumPresenter {
  public static toObject(condominiumEntity: CondominiumEntity) {
    return {
      id: condominiumEntity.getId(),
      name: condominiumEntity.getName(),
      logo: condominiumEntity.getLogo(),
      address: condominiumEntity.getAddress(),
      administratorId: condominiumEntity.getAdministrator(),
      createdAt: condominiumEntity.getCreatedAt().toString(),
      updatedAt: condominiumEntity.getUpdatedAt().toString(),
    };
  }
}
