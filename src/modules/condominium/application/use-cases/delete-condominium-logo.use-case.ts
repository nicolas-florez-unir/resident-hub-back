import { Injectable } from '@nestjs/common';
import { StorageStrategy } from 'src/modules/files/domain/strategies/storage.strategy';
import { CondominiumEntity } from '@condominium/domain/entities/condominium.entity';

@Injectable()
export class DeleteCondominiumLogoUseCase {
  constructor(private readonly storageStrategy: StorageStrategy) {}

  async execute(condominium: CondominiumEntity): Promise<void> {
    await this.storageStrategy.deleteFile(condominium.getLogo());
  }
}
