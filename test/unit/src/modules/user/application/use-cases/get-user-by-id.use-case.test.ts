import { Test, TestingModule } from '@nestjs/testing';
import { GetUserByIdUseCase } from '@user/application/use-cases/get-user-by-id.use-case';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { UserFactory } from 'test/utils/factories/user.factory';

describe('GetUserByIdUseCase', () => {
  let getUserByIdUseCase: GetUserByIdUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserByIdUseCase,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    getUserByIdUseCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(getUserByIdUseCase).toBeDefined();
  });

  it('should call userRepository.findById with the correct id', async () => {
    const id = 1;
    const user = UserFactory.create({ id });
    userRepository.findById.mockResolvedValue(user);

    const result = await getUserByIdUseCase.execute(id);

    expect(userRepository.findById).toHaveBeenCalledWith(id);
    expect(result).toEqual(user);
  });

  it('should throw UserNotFoundException if user is not found', async () => {
    const id = 1;
    userRepository.findById.mockResolvedValue(null);

    await expect(getUserByIdUseCase.execute(id)).rejects.toThrow(
      new UserNotFoundException('User with id 1 not found'),
    );
  });

  it('should throw an error if userRepository.findById throws', async () => {
    const id = 1;
    userRepository.findById.mockRejectedValue(new Error('Database error'));

    await expect(getUserByIdUseCase.execute(id)).rejects.toThrow('Database error');
  });
});
