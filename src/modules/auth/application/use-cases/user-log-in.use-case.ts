import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { InvalidCredentialsException } from '@auth/domain/exceptions/invalid-credentials.exception';
import { UserEntity } from '@user/domain/entities/user.entity';
import { GetUserByEmailUseCase } from '@user/application/use-cases/get-user-by-email.use-case';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';

@Injectable()
export class UserLogInUseCase {
  constructor(private readonly getUserByEmailUseCase: GetUserByEmailUseCase) {}

  public async execute(email: string, password: string): Promise<UserEntity> {
    let user: UserEntity | null = null;

    try {
      user = await this.getUserByEmailUseCase.execute(email);
    } catch (error) {
      if (error instanceof UserNotFoundException)
        throw new InvalidCredentialsException('Invalid email');
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) throw new InvalidCredentialsException('Invalid password');

    return new UserEntity(
      user.id,
      user.condominiumId,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.phone,
      user.role,
      user.createdAt,
      user.updatedAt,
    );
  }
}
