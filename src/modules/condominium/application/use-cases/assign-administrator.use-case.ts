import { Injectable } from '@nestjs/common';
import { CondominiumRepository } from '../../domain/repositories/condominium.repository';
import { CondominiumNotFoundException } from '../../domain/exceptions/condominiun-not-found.exception';
import { CondominiumEntity } from '../../domain/entities/condominium.entity';
import { GetAdministratorByIdUseCase } from '@user/application/use-cases';

@Injectable()
export class AssignAdministratorUseCase {
  constructor(
    private readonly condominiumRepository: CondominiumRepository,
    private readonly getAdministratorByIdUseCase: GetAdministratorByIdUseCase,
  ) {}

  async execute(condominiumId: number, userId: number): Promise<CondominiumEntity> {
    const condominium = await this.condominiumRepository.findById(condominiumId);

    if (!condominium) {
      throw new CondominiumNotFoundException(
        `Condominium with ID ${condominiumId} not found`,
      );
    }

    const administrator = await this.getAdministratorByIdUseCase.execute(userId);

    condominium.setAdministrator(administrator);

    const condominiumUpdated = await this.condominiumRepository.update(condominium);

    return condominiumUpdated;
  }
}
