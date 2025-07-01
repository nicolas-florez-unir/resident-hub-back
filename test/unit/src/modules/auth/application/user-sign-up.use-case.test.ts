import { UserSignUpUseCase } from '@auth/application/use-cases/user-sign-up.use-case';
import { UserEntity } from '@user/domain/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { CreateUserDto } from '@user/domain/dtos/create-user.dto';
import { CreateUserUseCase } from '@user/application/use-cases/create-user.use-case';
import { GetCondominiumByIdUseCase } from '@condominium/application/use-cases/get-condominium-by-id.use-case';
import { CondominiumRepository } from '@condominium/domain/repositories/condominium.repository';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';
import { UserFactory } from 'test/utils/factories/user.factory';

describe('UserSignUpUseCase', () => {
  let useCase: UserSignUpUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let condominiumRepository: jest.Mocked<CondominiumRepository>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCondominiumByIdUseCase,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: CondominiumRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        CreateUserUseCase,
        UserSignUpUseCase,
      ],
    }).compile();

    useCase = module.get<UserSignUpUseCase>(UserSignUpUseCase);
    userRepository = module.get<jest.Mocked<UserRepository>>(UserRepository);
    condominiumRepository =
      module.get<jest.Mocked<CondominiumRepository>>(CondominiumRepository);
  });

  it('should return true', async () => {
    const condominium = CondominiumFactory.create();
    condominiumRepository.findById.mockResolvedValue(condominium);

    const user = UserFactory.create({
      condominiumId: condominium.getId(),
    });

    userRepository.create.mockResolvedValue(user);

    const dto = new CreateUserDto(
      1,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.phone,
      user.role as any,
    );

    const useCaseResult = await useCase.execute(dto);

    expect(userRepository.create).toHaveBeenCalledTimes(1);
    expect(userRepository.create).toHaveBeenCalledWith(dto);

    expect(useCaseResult).toBeInstanceOf(UserEntity);
    expect(useCaseResult.email).toBe(user.email);
    expect(useCaseResult.firstName).toBe(user.firstName);
    expect(useCaseResult.lastName).toBe(user.lastName);
    expect(useCaseResult.phone).toBe(user.phone);
    expect(useCaseResult.role).toBe(user.role);
    expect(useCaseResult.password).toBe(user.password);

    jest.clearAllMocks();
  });
});
