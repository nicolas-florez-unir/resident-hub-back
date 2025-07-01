import { Injectable } from '@nestjs/common';
import { FineRepository } from '../../domain/repositories/fine.repository';
import { FineEntity } from '../../domain/entities/fine.entity';
import { UpdateFineDto } from '../../domain/dtos/update-fine.dto';

@Injectable()
export class UpdateFineUseCase {
  constructor(private readonly fineRepository: FineRepository) {}

  async execute(updateFineDto: UpdateFineDto): Promise<FineEntity> {
    return this.fineRepository.update(updateFineDto);
  }
}
