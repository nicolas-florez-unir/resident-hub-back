import { UserSignUpUseCase } from '@auth/application/use-cases/user-sign-up.use-case';
import { UserEntity } from 'src/modules/user/domain/entities/User.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { CreateUserDto } from '@user/domain/dtos/CreateUserDto';
import { CreateUserUseCase } from '@user/application/use-cases/create-user.use-case';

describe('UserSignUpUseCase', () => {
  let useCase: UserSignUpUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        CreateUserUseCase,
        UserSignUpUseCase,
      ],
    }).compile();

    useCase = module.get<UserSignUpUseCase>(UserSignUpUseCase);
    userRepository = module.get<jest.Mocked<UserRepository>>(UserRepository);
  });

  it('should return true', async () => {
    const userData = {
      email: 'user@email.com',
      password: '123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '3058668807',
      role: 'Admin',
    };

    userRepository.create.mockResolvedValue(
      new UserEntity(
        1,
        userData.email,
        userData.password,
        userData.firstName,
        userData.lastName,
        userData.phone,
        userData.role as any,
        new Date(),
        new Date(),
      ),
    );

    const dto = new CreateUserDto(
      userData.email,
      userData.password,
      userData.firstName,
      userData.lastName,
      userData.phone,
      userData.role as any,
      new Date(),
      new Date(),
    );

    const useCaseResult = await useCase.execute(dto);

    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(userRepository.create).toHaveBeenCalledWith(dto);

    expect(useCaseResult).toBeInstanceOf(UserEntity);
    expect(useCaseResult.email).toBe(userData.email);
    expect(useCaseResult.firstName).toBe(userData.firstName);
    expect(useCaseResult.lastName).toBe(userData.lastName);
    expect(useCaseResult.phone).toBe(userData.phone);
    expect(useCaseResult.role).toBe(userData.role);
    expect(useCaseResult.password).toBe(userData.password);
  });
});
