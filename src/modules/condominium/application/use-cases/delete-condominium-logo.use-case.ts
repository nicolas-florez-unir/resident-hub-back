import { Injectable } from '@nestjs/common';
import { CondominiumRepository } from '@condominium/domain/repositories/condominium.repository';
import { StorageStrategy } from 'src/modules/files/domain/strategies/storage.strategy';
import { CondominiumEntity } from '@condominium/domain/entities/condominium.entity';

@Injectable()
export class DeleteCondominiumLogoUseCase {
  constructor(
    private readonly condominiumRepository: CondominiumRepository,
    private readonly storageStrategy: StorageStrategy,
  ) {}

  async execute(condominium: CondominiumEntity): Promise<void> {
    await this.storageStrategy.deleteFile(condominium.getLogo());
  }
}
