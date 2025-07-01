import { Injectable } from '@nestjs/common';
import { UserEntity } from '@user/domain/entities/user.entity';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { UserRepository } from '@user/domain/repositories/user.repository';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: UserEntity): Promise<UserEntity> {
    const updatedUser = await this.userRepository.update(user);

    if (!updatedUser) {
      throw new UserNotFoundException(`User with id ${user.id} not found`);
    }

    return updatedUser;
  }
}
