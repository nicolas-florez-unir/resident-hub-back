import { AssignAdministratorUseCase } from '@condominium/application/use-cases/assign-administrator.use-case';
import { CondominiumNotFoundException } from '@condominium/domain/exceptions/condominiun-not-found.exception';
import { CondominiumRepository } from '@condominium/domain/repositories/condominium.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { GetAdministratorByIdUseCase } from '@user/application/use-cases/get-administrator-by-id.use-case';
import { UserRole } from '@user/domain/enums/UserRole.enum';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';
import { UserFactory } from 'test/utils/factories/user.factory';

describe('AssignAdministratorUseCase', () => {
  let assignAdministratorUseCase: AssignAdministratorUseCase;
  let condominiumRepository: jest.Mocked<CondominiumRepository>;
  let getUserByIdUseCase: jest.Mocked<GetAdministratorByIdUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignAdministratorUseCase,
        {
          provide: CondominiumRepository,
          useValue: {
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: GetAdministratorByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    assignAdministratorUseCase = module.get<AssignAdministratorUseCase>(
      AssignAdministratorUseCase,
    );
    condominiumRepository = module.get(CondominiumRepository);
    getUserByIdUseCase = module.get(GetAdministratorByIdUseCase);
  });

  it('should assign an administrator to a condominium successfully', async () => {
    const condominium = CondominiumFactory.create();
    const user = UserFactory.create({ role: UserRole.Administrator });

    condominiumRepository.findById.mockResolvedValue(condominium);
    getUserByIdUseCase.execute.mockResolvedValue(user);
    condominiumRepository.update.mockResolvedValue(condominium);

    const result = await assignAdministratorUseCase.execute(
      condominium.getId(),
      user.id,
    );

    expect(condominiumRepository.findById).toHaveBeenCalledWith(
      condominium.getId(),
    );
    expect(getUserByIdUseCase.execute).toHaveBeenCalledWith(user.id);
    expect(condominiumRepository.update).toHaveBeenCalledWith(condominium);
    expect(result).toEqual(condominium);
  });

  it('should throw CondominiumNotFoundException if condominium does not exist', async () => {
    condominiumRepository.findById.mockResolvedValue(null);

    await expect(assignAdministratorUseCase.execute(1, 1)).rejects.toThrow(
      CondominiumNotFoundException,
    );

    expect(condominiumRepository.findById).toHaveBeenCalledWith(1);
    expect(getUserByIdUseCase.execute).not.toHaveBeenCalled();
    expect(condominiumRepository.update).not.toHaveBeenCalled();
  });

  it('should throw UserNotFoundException if user is not an administrator', async () => {
    const exception = new UserNotFoundException(`User with ID 1 not found`);
    const condominium = CondominiumFactory.create();

    condominiumRepository.findById.mockResolvedValue(condominium);
    getUserByIdUseCase.execute.mockRejectedValue(exception);

    await expect(
      assignAdministratorUseCase.execute(condominium.getId(), 1),
    ).rejects.toThrow(UserNotFoundException);

    expect(condominiumRepository.findById).toHaveBeenCalledWith(
      condominium.getId(),
    );
    expect(getUserByIdUseCase.execute).toHaveBeenCalledWith(1);
    expect(condominiumRepository.update).not.toHaveBeenCalled();
  });

  it('should throw UserNotFoundException if user does not exist', async () => {
    const condominium = CondominiumFactory.create();
    const exception = new UserNotFoundException(`User with ID 1 not found`);

    condominiumRepository.findById.mockResolvedValue(condominium);
    getUserByIdUseCase.execute.mockRejectedValue(exception);

    await expect(
      assignAdministratorUseCase.execute(condominium.getId(), 1),
    ).rejects.toThrow(exception);

    expect(condominiumRepository.findById).toHaveBeenCalledWith(
      condominium.getId(),
    );
    expect(getUserByIdUseCase.execute).toHaveBeenCalledWith(1);
    expect(condominiumRepository.update).not.toHaveBeenCalled();
  });
});
