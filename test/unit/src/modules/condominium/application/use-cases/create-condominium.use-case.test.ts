import { CreateCondominiumUseCase } from '@condominium/application/use-cases/create-condominium.use-case';
import { CreateCondominiumDto } from '@condominium/domain/dtos/CreateCondominium.dto';
import { CondominiumEntity } from '@condominium/domain/entities/condominium.entity';
import { CondominiumRepository } from '@condominium/domain/repositories/condominium.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';

describe('CreateCondominiumUseCase', () => {
  let useCase: CreateCondominiumUseCase;
  let repository: CondominiumRepository;

  const mockCondominiumRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCondominiumUseCase,
        {
          provide: CondominiumRepository,
          useValue: mockCondominiumRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateCondominiumUseCase>(CreateCondominiumUseCase);
    repository = module.get<CondominiumRepository>(CondominiumRepository);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should call repository.create with correct parameters', async () => {
    const dto: CreateCondominiumDto = {
      name: 'Test Condo',
      address: '123 Test St',
    };

    const condominium: CondominiumEntity = CondominiumFactory.create();
    condominium.setName(dto.name);
    condominium.setAddress(dto.address);

    mockCondominiumRepository.create.mockResolvedValue(condominium);

    const result = await useCase.execute(dto);

    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(condominium);
  });

  it('should throw an error if repository.create fails', async () => {
    const dto: CreateCondominiumDto = {
      name: 'Test Condo',
      address: '123 Test St',
    };

    mockCondominiumRepository.create.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(useCase.execute(dto)).rejects.toThrow('Database error');
    expect(repository.create).toHaveBeenCalledWith(dto);
  });
});
