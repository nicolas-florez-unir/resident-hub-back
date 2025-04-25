import { CondominiumEntity } from '@condominium/domain/entities/condominium.entity';
import { faker } from '@faker-js/faker';

export class CondominiumFactory {
  public static create(overrides?: Partial<CondominiumEntity>): CondominiumEntity {
    const now = new Date();
    return new CondominiumEntity(
      overrides?.getId() ?? 1,
      overrides?.getName() ?? faker.company.name(),
      overrides?.getAddress() ?? faker.location.streetAddress(),
      null,
      null,
      overrides?.getCreatedAt() ?? now,
      overrides?.getUpdatedAt() ?? now,
    );
  }
}
