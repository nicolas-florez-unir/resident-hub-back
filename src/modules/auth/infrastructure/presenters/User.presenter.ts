import { UserEntity } from '@user/domain/entities/User.entity';

export class UserPresenter {
  public static toObject(userEntity: UserEntity) {
    return {
      id: userEntity.id,
      email: userEntity.email,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      phone: userEntity.phone,
      role: userEntity.role,
      createdAt: userEntity.createdAt,
      updatedAt: userEntity.updatedAt,
    };
  }
}
