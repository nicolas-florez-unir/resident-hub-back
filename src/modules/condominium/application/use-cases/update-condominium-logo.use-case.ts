import { Injectable, Logger } from '@nestjs/common';
import { CondominiumRepository } from '@condominium/domain/repositories/condominium.repository';
import { StorageStrategy } from 'src/modules/files/domain/strategies/storage.strategy';
import { CondominiumEntity } from '@condominium/domain/entities/condominium.entity';
import { DeleteCondominiumLogoUseCase } from './delete-condominium-logo.use-case';

@Injectable()
export class UpdateCondominiumLogoUseCase {
  private readonly logger = new Logger(UpdateCondominiumLogoUseCase.name);

  constructor(
    private readonly deleteCondominiumLogoUseCase: DeleteCondominiumLogoUseCase,
    private readonly condominiumRepository: CondominiumRepository,
    private readonly storageStrategy: StorageStrategy,
  ) {}

  async execute(
    file: Express.Multer.File,
    condominium: CondominiumEntity,
  ): Promise<void> {
    try {
      await this.deleteCondominiumLogoUseCase.execute(condominium);
    } catch (error) {
      Logger.warn(
        `Error deleting old logo: ${condominium.getLogo()} for condominium ${condominium.getId()}`,
        error,
      );
    }

    const fileName = await this.storageStrategy.saveFile(file);

    condominium.setLogo(fileName);

    await this.condominiumRepository.update(condominium);
  }
}
