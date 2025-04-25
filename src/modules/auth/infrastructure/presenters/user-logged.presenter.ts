import { UserEntity } from '@user/domain/entities/User.entity';

export class UserLoggedPresenter {
  public static present(user: UserEntity, accessToken: string) {
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
      },
      accessToken,
    };
  }
}
