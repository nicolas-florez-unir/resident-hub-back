import { Injectable } from '@nestjs/common';
import { FineRepository } from '../../domain/repositories/fine.repository';
import { FineEntity } from '../../domain/entities/fine.entity';

@Injectable()
export class GetFinesByCondominiumIdUseCase {
  constructor(private readonly fineRepository: FineRepository) {}

  async execute(condominiumId: number): Promise<FineEntity[]> {
    return await this.fineRepository.findByCondominiumId(condominiumId);
  }
}
