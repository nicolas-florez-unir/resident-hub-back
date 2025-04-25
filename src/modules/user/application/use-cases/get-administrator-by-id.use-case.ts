import { Injectable } from '@nestjs/common';
import { UserEntity } from '@user/domain/entities/User.entity';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { UserRepository } from '@user/domain/repositories/user.repository';

@Injectable()
export class GetAdministratorByIdUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findAdministratorById(id);

    if (!user) {
      throw new UserNotFoundException(`User Administrator with id ${id} not found`);
    }

    return user;
  }
}
