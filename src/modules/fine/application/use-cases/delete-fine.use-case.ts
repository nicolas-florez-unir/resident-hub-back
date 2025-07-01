import { Injectable } from '@nestjs/common';
import { FineRepository } from '../../domain/repositories/fine.repository';

@Injectable()
export class DeleteFineUseCase {
  constructor(private readonly fineRepository: FineRepository) {}

  async execute(id: number): Promise<void> {
    return this.fineRepository.deleteFine(id);
  }
}
