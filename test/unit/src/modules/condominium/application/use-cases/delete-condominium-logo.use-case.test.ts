import { DeleteCondominiumLogoUseCase } from '@condominium/application/use-cases/delete-condominium-logo.use-case';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageStrategy } from 'src/modules/files/domain/strategies/storage.strategy';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';

describe('UpdateCondominiumLogoUseCase', () => {
  let deleteCondominiumLogoUseCase: DeleteCondominiumLogoUseCase;
  let storageStrategy: jest.Mocked<StorageStrategy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCondominiumLogoUseCase,
        {
          provide: StorageStrategy,
          useValue: {
            saveFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteCondominiumLogoUseCase = module.get(DeleteCondominiumLogoUseCase);
    storageStrategy = module.get(StorageStrategy);
  });

  it('should update the condominium logo', async () => {
    const existingCondominium = CondominiumFactory.create();
    existingCondominium.setLogo('logo.png');

    deleteCondominiumLogoUseCase.execute(existingCondominium);

    expect(storageStrategy.deleteFile).toHaveBeenCalledWith(
      existingCondominium.getLogo(),
    );
  });
});
