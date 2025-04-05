import { Test, TestingModule } from '@nestjs/testing';
import { GetCondominiumByIdUseCase } from '@condominium/application/use-cases/get-condominium-by-id.use-case';
import { CondominiumRepository } from '@condominium/domain/repositories/condominium.repository';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';

describe('GetCondominiumByIdUseCase', () => {
  const mockCondominiumRepository = {
    findById: jest.fn(),
  };

  let getCondominiumByIdUseCase: GetCondominiumByIdUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCondominiumByIdUseCase,
        { provide: CondominiumRepository, useValue: mockCondominiumRepository },
      ],
    }).compile();
    getCondominiumByIdUseCase = module.get<GetCondominiumByIdUseCase>(
      GetCondominiumByIdUseCase,
    );
  });

  it('should be defined', () => {
    expect(getCondominiumByIdUseCase).toBeDefined();
  });

  it('Should CondominiumNotFoundException if repository returns null', async () => {
    const id = 123;
    mockCondominiumRepository.findById.mockResolvedValue(null);

    await expect(getCondominiumByIdUseCase.execute(id)).rejects.toThrowError(
      new Error(`Condominium with id ${id} not found`),
    );
  });

  it('Should return CondominiumEntity if repository returns a condominium', async () => {
    const mockCondominium = CondominiumFactory.create();
    mockCondominiumRepository.findById.mockResolvedValue(mockCondominium);

    const result = await getCondominiumByIdUseCase.execute(
      mockCondominium.getId(),
    );

    expect(result).toEqual(mockCondominium);
  });
});
