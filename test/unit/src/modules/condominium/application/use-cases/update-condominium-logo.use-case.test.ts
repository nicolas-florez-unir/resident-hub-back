import { DeleteCondominiumLogoUseCase } from '@condominium/application/use-cases/delete-condominium-logo.use-case';
import { UpdateCondominiumLogoUseCase } from '@condominium/application/use-cases/update-condominium-logo.use-case';
import { CondominiumRepository } from '@condominium/domain/repositories/condominium.repository';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageStrategy } from 'src/modules/files/domain/strategies/storage.strategy';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';

describe('UpdateCondominiumLogoUseCase', () => {
  let updateCondominiumLogoUseCase: UpdateCondominiumLogoUseCase;
  let deleteCondominiumLogoUseCase: DeleteCondominiumLogoUseCase;
  let condominiumRepository: jest.Mocked<CondominiumRepository>;
  let storageStrategy: jest.Mocked<StorageStrategy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCondominiumLogoUseCase,
        {
          provide: DeleteCondominiumLogoUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: CondominiumRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: StorageStrategy,
          useValue: {
            saveFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
        {
          provide: Logger,
          useValue: {
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    updateCondominiumLogoUseCase = module.get<UpdateCondominiumLogoUseCase>(
      UpdateCondominiumLogoUseCase,
    );
    deleteCondominiumLogoUseCase = module.get(DeleteCondominiumLogoUseCase);
    condominiumRepository = module.get(CondominiumRepository);
    storageStrategy = module.get(StorageStrategy);
  });

  it('should update the condominium logo', async () => {
    const file = {
      originalname: 'sample.name',
      mimetype: 'sample.type',
      path: 'sample.url',
      buffer: Buffer.from('whatever'), // this is required since `formData` needs access to the buffer
    } as Express.Multer.File;

    const existingCondominium = CondominiumFactory.create();
    existingCondominium.setLogo('old-logo.png');

    condominiumRepository.findById.mockResolvedValue(existingCondominium);
    storageStrategy.saveFile.mockResolvedValue('new-logo.png');

    const deleteUseCaseSpy = jest
      .spyOn(deleteCondominiumLogoUseCase, 'execute')
      .mockResolvedValue(undefined);

    await updateCondominiumLogoUseCase.execute(file, existingCondominium);

    expect(deleteUseCaseSpy).toHaveBeenCalledWith(existingCondominium);
    expect(storageStrategy.saveFile).toHaveBeenCalledWith(file);
    expect(condominiumRepository.update).toHaveBeenCalledWith(existingCondominium);
  });

  it('should log warn if deleteCondominiumLogoUseCase fails', async () => {
    const file = {
      originalname: 'sample.name',
      mimetype: 'sample.type',
      path: 'sample.url',
      buffer: Buffer.from('whatever'), // this is required since `formData` needs access to the buffer
    } as Express.Multer.File;

    const existingCondominium = CondominiumFactory.create();
    existingCondominium.setLogo('old-logo.png');

    condominiumRepository.findById.mockResolvedValue(existingCondominium);
    storageStrategy.saveFile.mockResolvedValue('new-logo.png');

    const deleteUseCaseSpyError = new Error('Delete failed');

    const deleteUseCaseSpy = jest
      .spyOn(deleteCondominiumLogoUseCase, 'execute')
      .mockRejectedValue(deleteUseCaseSpyError);

    const loggerSpyWarn = jest.spyOn(Logger.prototype, 'warn');

    await updateCondominiumLogoUseCase.execute(file, existingCondominium);

    expect(loggerSpyWarn).toHaveBeenCalledWith(
      `Error deleting old logo: old-logo.png for condominium ${existingCondominium.getId()}: ${deleteUseCaseSpyError.message}`,
    );
    expect(deleteUseCaseSpy).toHaveBeenCalledWith(existingCondominium);
    expect(storageStrategy.saveFile).toHaveBeenCalledWith(file);
    expect(condominiumRepository.update).toHaveBeenCalledWith(existingCondominium);
  });
});
