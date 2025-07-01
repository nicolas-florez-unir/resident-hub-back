import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new UserNotFoundException(`User with id ${id} not found`);

    return user;
  }
}
