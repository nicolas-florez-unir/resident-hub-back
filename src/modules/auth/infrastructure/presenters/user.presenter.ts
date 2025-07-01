import { UserEntity } from '@user/domain/entities/user.entity';

export class UserPresenter {
  public static present(userEntity: UserEntity) {
    return {
      id: userEntity.id,
      email: userEntity.email,
      firstName: userEntity.firstName,
      lastName: userEntity.lastName,
      phone: userEntity.phone,
      role: userEntity.role,
      createdAt: userEntity.createdAt.toString(),
      updatedAt: userEntity.updatedAt.toString(),
    };
  }
}
