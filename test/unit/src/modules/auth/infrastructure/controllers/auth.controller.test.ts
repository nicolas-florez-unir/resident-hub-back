import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@auth/infrastructure/controllers/auth.controller';
import { UserSignUpUseCase } from '@auth/application/use-cases/user-sign-up.use-case';
import { UserSignUpRequest } from '@auth/infrastructure/requests/user-sign-up.request';
import { UserEntity } from '@user/domain/entities/user.entity';
import { UserLogInUseCase } from '@auth/application/use-cases/user-log-in.use-case';
import { UserPresenter } from '@auth/infrastructure/presenters/user.presenter';
import { UserLogInRequest } from '@auth/infrastructure/requests/user-log-in.request';
import { ConflictException, HttpException, HttpStatus } from '@nestjs/common';
import { ApplicationJwtService } from '@auth/infrastructure/jwt/application-jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { CreateUserDto } from '@user/domain/dtos/create-user.dto';
import { GetUserByIdUseCase } from '@user/application/use-cases/get-user-by-id.use-case';
import { UserFactory } from 'test/utils/factories/user.factory';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';
import { UserRole } from '@user/domain/enums/user-role.enum';
import { UserAlreadyExistException } from '@user/domain/exceptions/user-already-exist.exception';
import { EntityNotFoundException } from '@common/exceptions/entity-not-found.exception';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let userSignUpUseCase: UserSignUpUseCase;
  let userLogInUseCase: UserLogInUseCase;

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
        ApplicationJwtService,
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
  });

  describe('signUp method', () => {
    it('should call UserSignUpUseCase with correct parameters', async () => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now);

      const condominium = CondominiumFactory.create();

      const request: UserSignUpRequest = {
        email: 'nflorez@gmail.com',
        condominiumId: condominium.getId(),
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: 'Admin' as any,
      };

      const userEntity = new UserEntity(
        1,
        request.condominiumId,
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
          request.condominiumId,
          request.email,
          request.password,
          request.firstName,
          request.lastName,
          request.phone,
          request.role,
        ),
      );

      jest.useRealTimers();
    });

    it('should return the result from UserSignUpUseCase', async () => {
      const condominium = CondominiumFactory.create();
      const request: UserSignUpRequest = {
        condominiumId: condominium.getId(),
        email: 'nflorez@gmail.com',
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: 'Admin' as any,
      };

      const userEntity = new UserEntity(
        1,
        request.condominiumId,
        request.email,
        request.password,
        request.firstName,
        request.lastName,
        request.phone,
        request.role,
        new Date(),
        new Date(),
      );

      jest.spyOn(userSignUpUseCase, 'execute').mockResolvedValueOnce(userEntity);

      const response = await authController.signUp(request);

      expect(response).toEqual(UserPresenter.present(userEntity));
    });

    it('should throw an HttpException if UserSignUpUseCase throws an unknown error', async () => {
      const condominium = CondominiumFactory.create();
      const request: UserSignUpRequest = {
        condominiumId: condominium.getId(),
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
      const condominium = CondominiumFactory.create();
      const request: UserSignUpRequest = {
        condominiumId: condominium.getId(),
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
        .mockRejectedValueOnce(new UserAlreadyExistException(errorMessage));

      await expect(authController.signUp(request)).rejects.toThrow(
        new ConflictException(errorMessage),
      );
    });

    it('Should throw NotFoundException if use case throws EntityNotFoundException', async () => {
      const condominium = CondominiumFactory.create();
      const request: UserSignUpRequest = {
        condominiumId: condominium.getId(),
        email: 'already_used_email@gmail.com',
        password: 'random_password',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: UserRole.Administrator,
      };

      const errorMessage = `User with email ${request.email} not found`;
      jest
        .spyOn(userSignUpUseCase, 'execute')
        .mockRejectedValueOnce(new EntityNotFoundException(errorMessage));

      await expect(authController.signUp(request)).rejects.toThrow(
        new ConflictException(errorMessage),
      );
    });
  });

  describe('login method', () => {
    it('should call UserLogInUseCase with correct parameters', async () => {
      const condominium = CondominiumFactory.create();
      const request: UserLogInRequest = {
        email: 'test@example.com',
        password: 'password123',
      };
      const response = {
        cookie: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      const userEntity = UserFactory.create({
        condominiumId: condominium.getId(),
      });

      const executeSpy = jest
        .spyOn(userLogInUseCase, 'execute')
        .mockResolvedValueOnce(userEntity);

      await authController.login(request, response);

      expect(executeSpy).toHaveBeenCalledWith(request.email, request.password);
    });
  });
});
