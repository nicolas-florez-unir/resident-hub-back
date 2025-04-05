import { UserLogInUseCase } from '@auth/application/use-cases/user-log-in.use-case';
import { InvalidCredentialsException } from '@auth/domain/exceptions/invalid-credentials.exception';
import { Test, TestingModule } from '@nestjs/testing';
import { GetUserByEmailUseCase } from '@user/application/use-cases/get-user-by-email.use-case';
import { UserEntity } from '@user/domain/entities/User.entity';
import { UserRole } from '@user/domain/enums/UserRole.enum';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { UserRepository } from '@user/domain/repositories/user.repository';
import * as bcrypt from 'bcrypt';

describe('UserLogInUseCase', () => {
  let userLogInUseCase: UserLogInUseCase;
  let getUserByEmailUseCase: GetUserByEmailUseCase;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserLogInUseCase,
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
    userLogInUseCase = module.get<UserLogInUseCase>(UserLogInUseCase);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should return user entity if credentials are valid', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const user = new UserEntity(
      1,
      1,
      email,
      password,
      'User',
      'Test',
      '123',
      UserRole.Administrator,
      new Date(),
      new Date(),
    );

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

    const result = await userLogInUseCase.execute(email, password);

    expect(result).toEqual(user);
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const email = 'test@example.com';
    const password = 'password';

    jest
      .spyOn(getUserByEmailUseCase, 'execute')
      .mockRejectedValue(new UserNotFoundException('User not found'));

    await expect(userLogInUseCase.execute(email, password)).rejects.toThrow(
      new InvalidCredentialsException('Invalid email'),
    );
  });

  it('should throw InvalidCredentialsException if password is invalid', async () => {
    const email = 'test@example.com';
    const password = 'password';
    const user = new UserEntity(
      1,
      1,
      email,
      bcrypt.hashSync('wrongpassword', 10),
      'User',
      'Test',
      '123',
      UserRole.Administrator,
      new Date(),
      new Date(),
    );

    jest.spyOn(getUserByEmailUseCase, 'execute').mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false);

    await expect(userLogInUseCase.execute(email, password)).rejects.toThrow(
      new InvalidCredentialsException('Invalid password'),
    );
  });
});
