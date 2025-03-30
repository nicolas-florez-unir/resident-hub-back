import { Injectable } from '@nestjs/common';
import { UserEntity } from '@user/domain/entities/User.entity';
import { UserRepository } from '@user/domain/repositories/user.repository';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.update(user);
  }
}
