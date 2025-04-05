import { Injectable } from '@nestjs/common';
import { UserEntity } from '@user/domain/entities/User.entity';
import { CreateUserDto } from '@user/domain/dtos/CreateUserDto';
import { CreateUserUseCase } from '@user/application/use-cases/create-user.use-case';
import { GetCondominiumByIdUseCase } from '@condominium/application/use-cases/get-condominium-by-id.use-case';

@Injectable()
export class UserSignUpUseCase {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getCondominiumByIdUseCase: GetCondominiumByIdUseCase,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserEntity> {
    // Validate if the condominium exists
    await this.getCondominiumByIdUseCase.execute(dto.condominiumId);
    return this.createUserUseCase.execute(dto);
  }
}
