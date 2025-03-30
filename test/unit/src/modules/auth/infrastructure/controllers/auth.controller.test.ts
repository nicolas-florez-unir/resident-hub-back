import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@auth/infrastructure/controllers/auth.controller';
import { UserSignUpUseCase } from '@auth/application/use-cases/user-sign-up.use-case';
import { UserSignUpRequest } from '@auth/infrastructure/requests/UserSignUp.request';
import { UserEntity } from '@user/domain/entities/User.entity';
import { UserLogInUseCase } from '@auth/application/use-cases/user-log-in.use-case';
import { UserPresenter } from '@auth/infrastructure/presenters/User.presenter';
import { UserLogInRequest } from '@auth/infrastructure/requests/UserLogIn.request';
import { InvalidCredentialsException } from '@auth/domain/exceptions/invalid-credentials.exception';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@auth/infrastructure/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { UserLoggedPresenter } from '@auth/infrastructure/presenters/user-logged.presenter';
import { DuplicatedEmailException } from '@user/domain/exceptions/duplicated-email.exception';
import { CreateUserDto } from '@user/domain/dtos/CreateUserDto';
import { GetUserByIdUseCase } from '@user/application/use-cases/get-user-by-id.use-case';
import { UserFactory } from 'test/utils/factories/user.factory';
import { TokenError } from '@auth/domain/error/token.error';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';

describe('AuthController', () => {
  let authController: AuthController;
  let userSignUpUseCase: UserSignUpUseCase;
  let userLogInUseCase: UserLogInUseCase;
  let getUserByIdUseCase: GetUserByIdUseCase;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      imports: [
        JwtModule.register({
          global: true,
          secret: 'random_secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        JwtService,
        {
          provide: UserSignUpUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UserLogInUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetUserByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    userSignUpUseCase = module.get<UserSignUpUseCase>(UserSignUpUseCase);
    userLogInUseCase = module.get<UserLogInUseCase>(UserLogInUseCase);
    getUserByIdUseCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp method', () => {
    it('should call UserSignUpUseCase with correct parameters', async () => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now);

      const request: UserSignUpRequest = {
        email: 'nflorez@gmail.com',
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: 'Admin' as any,
      };

      const userEntity = new UserEntity(
        1,
        request.email,
        request.password,
        request.firstName,
        request.lastName,
        request.phone,
        request.role,
        new Date(),
        new Date(),
      );

      const executeSpy = jest
        .spyOn(userSignUpUseCase, 'execute')
        .mockResolvedValueOnce(userEntity);

      await authController.signUp(request);

      expect(executeSpy).toHaveBeenCalledWith(
        new CreateUserDto(
          request.email,
          request.password,
          request.firstName,
          request.lastName,
          request.phone,
          request.role,
          now,
          now,
        ),
      );

      jest.useRealTimers();
    });

    it('should return the result from UserSignUpUseCase', async () => {
      const request: UserSignUpRequest = {
        email: 'nflorez@gmail.com',
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: 'Admin' as any,
      };

      const userEntity = new UserEntity(
        1,
        request.email,
        request.password,
        request.firstName,
        request.lastName,
        request.phone,
        request.role,
        new Date(),
        new Date(),
      );

      jest
        .spyOn(userSignUpUseCase, 'execute')
        .mockResolvedValueOnce(userEntity);

      const response = await authController.signUp(request);

      expect(response).toEqual(UserPresenter.toObject(userEntity));
    });

    it('should throw an HttpException if UserSignUpUseCase throws an unknown error', async () => {
      const request: UserSignUpRequest = {
        email: 'nflorez@gmail.com',
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: 'Admin' as any,
      };

      const errorMessage = 'Error occurred';
      jest
        .spyOn(userSignUpUseCase, 'execute')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(authController.signUp(request)).rejects.toThrow(
        new HttpException(errorMessage, HttpStatus.BAD_REQUEST),
      );
    });

    it('Should throw a ConflictException if use case throws DuplicatedEmailException', async () => {
      const request: UserSignUpRequest = {
        email: 'already_used_email@gmail.com',
        password: 'random_password',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: 'Admin' as any,
      };

      const errorMessage = 'Email is already in use';
      jest
        .spyOn(userSignUpUseCase, 'execute')
        .mockRejectedValueOnce(new DuplicatedEmailException(errorMessage));

      await expect(authController.signUp(request)).rejects.toThrow(
        new ConflictException(errorMessage),
      );
    });
  });

  describe('login method', () => {
    it('should call UserLogInUseCase with correct parameters', async () => {
      const request: UserLogInRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const userEntity = new UserEntity(
        1,
        request.email,
        request.password,
        'Test',
        'User',
        '3058668807',
        'Admin' as any,
        new Date(),
        new Date(),
      );

      const executeSpy = jest
        .spyOn(userLogInUseCase, 'execute')
        .mockResolvedValueOnce(userEntity);

      await authController.login(request);

      expect(executeSpy).toHaveBeenCalledWith(request.email, request.password);
    });

    it('should return the result from UserLogInUseCase', async () => {
      const now = new Date();

      const request: UserLogInRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const userEntity = new UserEntity(
        1,
        request.email,
        request.password,
        'Test',
        'User',
        '3058668807',
        'Admin' as any,
        now,
        now,
      );

      const userToken = await jwtService.generateToken({
        id: userEntity.id,
      });

      jest.spyOn(userLogInUseCase, 'execute').mockResolvedValueOnce(userEntity);
      jest.spyOn(jwtService, 'generateToken').mockResolvedValueOnce(userToken);

      const response = await authController.login(request);

      expect(response).toEqual(
        UserLoggedPresenter.present(userEntity, userToken),
      );
    });

    it('should throw an error if UserLogInUseCase throws an error', async () => {
      const request: UserLogInRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const errorMessage = 'Error occurred';
      jest
        .spyOn(userLogInUseCase, 'execute')
        .mockRejectedValueOnce(new Error(errorMessage));

      await expect(authController.login(request)).rejects.toThrow(errorMessage);
    });

    it('should throw UnauthorizedException if use case throws InvalidCredentialsException', async () => {
      const request: UserLogInRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const errorMessage = 'Credentials are invalid';
      jest
        .spyOn(userLogInUseCase, 'execute')
        .mockRejectedValueOnce(new InvalidCredentialsException(errorMessage));

      await expect(authController.login(request)).rejects.toThrow(
        new UnauthorizedException(errorMessage),
      );
    });
  });

  describe('validateToken method', () => {
    it('should return the user if the token is valid', async () => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now);
      const token = 'fake_token';
      const request = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const fakeUser = UserFactory.create();

      jest.spyOn(jwtService, 'validateToken').mockReturnValue(true);

      jest
        .spyOn(jwtService, 'decodeToken')
        .mockResolvedValue(new Promise((resolve) => resolve({ id: 1 })));

      jest
        .spyOn(getUserByIdUseCase, 'execute')
        .mockReturnValue(new Promise((resolve) => resolve(fakeUser)));

      const result = await authController.validateToken(request);

      expect(result).toEqual(UserLoggedPresenter.present(fakeUser, token));
      jest.useRealTimers();
    });

    it('should throw an UnauthorizedException if the token is invalid', async () => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now);

      const request = {
        headers: {
          authorization: `invalid_token`,
        },
      };

      jest.spyOn(jwtService, 'validateToken').mockReturnValue(false);

      await expect(authController.validateToken(request)).rejects.toThrow(
        new UnauthorizedException(TokenError.INVALID),
      );

      jest.clearAllMocks();
      jest.useRealTimers();
    });

    it('should throw an UnauthorizedException if the user does not exist', async () => {
      const token = await jwtService.generateToken({
        id: 1,
      });

      const request = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      jest.spyOn(jwtService, 'validateToken').mockReturnValue(true);

      jest
        .spyOn(jwtService, 'decodeToken')
        .mockResolvedValue(new Promise((resolve) => resolve({ id: 1 })));

      jest
        .spyOn(getUserByIdUseCase, 'execute')
        .mockRejectedValue(new UserNotFoundException('User not found'));

      await expect(authController.validateToken(request)).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
    });

    it('should throw an InternalServerErrorException if an unknown error occurs', async () => {
      const token = await jwtService.generateToken({
        id: 1,
      });

      const request = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      jest.spyOn(jwtService, 'validateToken').mockReturnValue(true);

      jest
        .spyOn(jwtService, 'decodeToken')
        .mockResolvedValue(new Promise((resolve) => resolve({ id: 1 })));

      jest
        .spyOn(getUserByIdUseCase, 'execute')
        .mockRejectedValue(new Error('Unknown error'));

      await expect(authController.validateToken(request)).rejects.toThrow(
        new InternalServerErrorException('Unknown error'),
      );
    });
  });
});
