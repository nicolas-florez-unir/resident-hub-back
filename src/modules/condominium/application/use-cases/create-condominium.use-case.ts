import { Injectable } from '@nestjs/common';
import { CondominiumRepository } from '../../domain/repositories/condominium.repository';
import { CondominiumEntity } from '../../domain/entities/condominium.entity';
import { CreateCondominiumDto } from '../../domain/dtos/create-condominium.dto';

@Injectable()
export class CreateCondominiumUseCase {
  constructor(private readonly condominiumRepository: CondominiumRepository) {}

  async execute(dto: CreateCondominiumDto): Promise<CondominiumEntity> {
    return this.condominiumRepository.create(dto);
  }
}
