import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserUseCase } from '@user/application/use-cases/update-user.use-case';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { UserEntity } from '@user/domain/entities/User.entity';
import { UserFactory } from 'test/utils/factories/user.factory';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let userRepository: UserRepository;

  const mockUserRepository = {
    update: jest.fn(),
  };

  const mockUser: UserEntity = UserFactory.create();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserUseCase,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(updateUserUseCase).toBeDefined();
  });

  it('should call userRepository.update with the correct user', async () => {
    mockUserRepository.update.mockResolvedValue(mockUser);

    const result = await updateUserUseCase.execute(mockUser);

    expect(userRepository.update).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should throw an error if userRepository.update fails', async () => {
    mockUserRepository.update.mockRejectedValue(new Error('Update failed'));

    await expect(updateUserUseCase.execute(mockUser)).rejects.toThrow('Update failed');
  });

  it("should throw an UserNotFoundException if user doesn't exist", async () => {
    // Simula que el repositorio devuelve null (usuario no encontrado)
    mockUserRepository.update.mockResolvedValue(null);

    await expect(updateUserUseCase.execute(mockUser)).rejects.toThrow(
      new UserNotFoundException(`User with id ${mockUser.id} not found`),
    );
    expect(mockUserRepository.update).toHaveBeenCalledWith(mockUser);
  });
});
