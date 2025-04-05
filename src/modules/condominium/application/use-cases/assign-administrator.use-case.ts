import { Injectable } from '@nestjs/common';
import { CondominiumRepository } from '../../domain/repositories/condominium.repository';
import { GetUserByIdUseCase } from '../../../user/application/use-cases/get-user-by-id.use-case';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { CondominiumNotFoundException } from '../../domain/exceptions/condominiun-not-found.exception';
import { CondominiumEntity } from '../../domain/entities/condominium.entity';

@Injectable()
export class AssignAdministratorUseCase {
  constructor(
    private readonly condominiumRepository: CondominiumRepository,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  async execute(
    condominiumId: number,
    userId: number,
  ): Promise<CondominiumEntity> {
    const condominium =
      await this.condominiumRepository.findById(condominiumId);

    if (!condominium) {
      throw new CondominiumNotFoundException(
        `Condominium with ID ${condominiumId} not found`,
      );
    }

    const user = await this.getUserByIdUseCase.execute(userId);

    if (!user) {
      throw new UserNotFoundException(`User with ID ${userId} not found`);
    }

    if (!user.isAdministrator()) {
      throw new UserNotFoundException(
        `User Administrator with ID ${userId} not found`,
      );
    }

    condominium.setAdministratorId(user.id);

    const condominiumUpdated =
      await this.condominiumRepository.update(condominium);

    return condominiumUpdated;
  }
}
