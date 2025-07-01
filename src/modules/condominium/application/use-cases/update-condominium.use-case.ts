import { Injectable } from '@nestjs/common';
import { CondominiumRepository } from '../../domain/repositories/condominium.repository';
import { CondominiumEntity } from '@condominium/domain/entities/condominium.entity';
import { CondominiumNotFoundException } from '@condominium/domain/exceptions/condominiun-not-found.exception';

interface UpdateCondominiumDto {
  name?: string;
  address?: string;
}

@Injectable()
export class UpdateCondominiumUseCase {
  constructor(private readonly condominiumRepository: CondominiumRepository) {}

  async execute(
    condominiumId: number,
    dto: UpdateCondominiumDto,
  ): Promise<CondominiumEntity> {
    const condominium = await this.condominiumRepository.findById(condominiumId);

    if (!condominium) {
      throw new CondominiumNotFoundException('Condominium not found');
    }

    condominium.setAddress(dto.address);
    condominium.setName(dto.name);

    const updated = await this.condominiumRepository.update(condominium);
    return updated;
  }
}
