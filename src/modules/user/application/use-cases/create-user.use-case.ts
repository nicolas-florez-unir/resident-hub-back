import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@user/domain/dtos/CreateUserDto';
import { UserEntity } from '@user/domain/entities/User.entity';
import { UserRepository } from '@user/domain/repositories/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.create(dto);
  }
}
