import { Test, TestingModule } from '@nestjs/testing';
import { GetUserByEmailUseCase } from '@user/application/use-cases/get-user-by-email.use-case';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { UserEntity } from '@user/domain/entities/User.entity';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { UserFactory } from 'test/utils/factories/user.factory';

describe('GetUserByEmailUseCase', () => {
  let getUserByEmailUseCase: GetUserByEmailUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserByEmailUseCase,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    getUserByEmailUseCase = module.get<GetUserByEmailUseCase>(
      GetUserByEmailUseCase,
    );
    userRepository = module.get(UserRepository);
  });

  it('should return a user when found by email', async () => {
    const mockUser = UserFactory.create();

    userRepository.findByEmail.mockResolvedValue(mockUser);

    const result = await getUserByEmailUseCase.execute('test@example.com');

    expect(result).toBeInstanceOf(UserEntity);
    expect(result.email).toBe(mockUser.email);
    expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should throw UserNotFoundException when user is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      getUserByEmailUseCase.execute('notfound@example.com'),
    ).rejects.toThrow(UserNotFoundException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      'notfound@example.com',
    );
  });
});
