import { Injectable } from '@nestjs/common';
import { FineRepository } from '../../domain/repositories/fine.repository';
import { FineEntity } from '../../domain/entities/fine.entity';
import { CreateFineDto } from '../../domain/dtos/create-fine.dto';

@Injectable()
export class CreateFineUseCase {
  constructor(private readonly fineRepository: FineRepository) {}

  async execute(createFineDto: CreateFineDto): Promise<FineEntity> {
    return this.fineRepository.createFine(createFineDto);
  }
}
