import { Injectable } from '@nestjs/common';
import { UserEntity } from '@user/domain/entities/user.entity';
import { UserRepository } from '@user/domain/repositories/user.repository';

@Injectable()
export class GetHouseOwnersByCondominiumUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(condominiumId: number): Promise<UserEntity[]> {
    return this.userRepository.findOwnersByCondominiumId(condominiumId);
  }
}
