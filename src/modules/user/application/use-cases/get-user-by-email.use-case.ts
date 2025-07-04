import { Injectable } from '@nestjs/common';

import { UserEntity } from '@user/domain/entities/user.entity';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { UserRepository } from '@user/domain/repositories/user.repository';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  public async execute(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new UserNotFoundException(`User with email ${email} not found`);

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
