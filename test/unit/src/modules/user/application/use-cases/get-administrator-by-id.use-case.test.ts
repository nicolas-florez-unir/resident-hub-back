import { GetAdministratorByIdUseCase } from '@user/application/use-cases/get-administrator-by-id.use-case';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { UserEntity } from '@user/domain/entities/user.entity';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { UserFactory } from 'test/utils/factories/user.factory';
import { UserRole } from '@user/domain/enums/user-role.enum';
import { Test, TestingModule } from '@nestjs/testing';

describe('GetAdministratorByIdUseCase', () => {
  let useCase: GetAdministratorByIdUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAdministratorByIdUseCase,
        {
          provide: UserRepository,
          useValue: {
            findAdministratorById: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAdministratorByIdUseCase>(GetAdministratorByIdUseCase);
    userRepository = module.get(UserRepository);
  });

  it('should return the administrator entity when one is found', async () => {
    const admin: UserEntity = UserFactory.create({
      role: UserRole.Administrator,
    });
    userRepository.findAdministratorById.mockResolvedValue(admin);

    const result = await useCase.execute(1);

    expect(userRepository.findAdministratorById).toHaveBeenCalledWith(1);
    expect(result).toEqual(admin);
  });

  it('should throw a UserNotFoundException if no administrator is found', async () => {
    userRepository.findAdministratorById.mockResolvedValue(null);

    await expect(useCase.execute(2)).rejects.toThrow(
      new UserNotFoundException('User Administrator with id 2 not found'),
    );
    expect(userRepository.findAdministratorById).toHaveBeenCalledWith(2);
  });
});
