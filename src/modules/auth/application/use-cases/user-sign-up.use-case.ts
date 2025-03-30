import { Injectable } from '@nestjs/common';
import { UserEntity } from '@user/domain/entities/User.entity';
import { CreateUserDto } from '@user/domain/dtos/CreateUserDto';
import { CreateUserUseCase } from '@user/application/use-cases/create-user.use-case';

@Injectable()
export class UserSignUpUseCase {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    return this.createUserUseCase.execute(dto);
  }
}
