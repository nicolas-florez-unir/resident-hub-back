import { Injectable } from '@nestjs/common';
import { UserRepository } from '@user/domain/repositories/user.repository';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<void> {
    this.userRepository.delete(id);
  }
}
