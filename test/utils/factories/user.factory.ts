import { faker } from '@faker-js/faker';
import { UserRole } from '@user/domain/enums/user-role.enum';

import { UserEntity } from '@user/domain/entities/user.entity';

export class UserFactory {
  public static create(overrides?: Partial<UserEntity>): UserEntity {
    const now = new Date();
    return new UserEntity(
      overrides?.id ?? 1,
      overrides?.condominiumId ?? 1,
      overrides?.email ?? faker.internet.email(),
      overrides?.password ?? faker.string.alphanumeric(),
      overrides?.firstName ?? faker.person.firstName(),
      overrides?.lastName ?? faker.person.lastName(),
      overrides?.phone ?? faker.phone.number(),
      overrides?.role ?? UserRole.Administrator,
      overrides?.createdAt ?? now,
      overrides?.updatedAt ?? now,
    );
  }
}
