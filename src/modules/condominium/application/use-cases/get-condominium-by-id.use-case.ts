import { Injectable } from '@nestjs/common';
import { CondominiumRepository } from '../../domain/repositories/condominium.repository';
import { CondominiumNotFoundException } from '@condominium/domain/exceptions/condominiun-not-found.exception';

@Injectable()
export class GetCondominiumByIdUseCase {
  constructor(private readonly condominiumRepository: CondominiumRepository) {}

  async execute(condominiumId: number) {
    const condominium =
      await this.condominiumRepository.findById(condominiumId);

    if (!condominium)
      throw new CondominiumNotFoundException(
        `Condominium with id ${condominiumId} not found`,
      );

    return condominium;
  }
}
