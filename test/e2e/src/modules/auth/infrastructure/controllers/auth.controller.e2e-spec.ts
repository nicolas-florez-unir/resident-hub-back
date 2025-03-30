import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '@auth/infrastructure/controllers/auth.controller';
import { UserSignUpUseCase } from '@auth/application/use-cases/user-sign-up.use-case';
import { UserSignUpRequest } from '@auth/infrastructure/requests/UserSignUp.request';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { PrismaUserRepository } from '@user/infrastructure/repositories/prisma.user.repository';
import { UserEntity } from '@user/domain/entities/User.entity';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { CreateUserDto } from '@user/domain/dtos/CreateUserDto';
import { PrismaUtils } from 'test/utils/PrismaUtils';
import { UserLogInUseCase } from '@auth/application/use-cases/user-log-in.use-case';
import { UserLogInRequest } from '@auth/infrastructure/requests/UserLogIn.request';
import { UserFactory } from 'test/utils/factories/user.factory';
import { JwtService } from '@auth/infrastructure/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { UserRole } from '@user/domain/enums/UserRole.enum';
import { GetUserByIdUseCase } from '@user/application/use-cases/get-user-by-id.use-case';
import { CreateUserUseCase } from '@user/application/use-cases/create-user.use-case';
import { GetUserByEmailUseCase } from '@user/application/use-cases/get-user-by-email.use-case';

describe('AuthController', () => {
  let app: INestApplication;
  let userSignUpUseCase: UserSignUpUseCase;
  let userRepository: UserRepository;
  let userLogInUseCase: UserLogInUseCase;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          global: true,
          secret: 'random_secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      controllers: [AuthController],
      providers: [
        JwtService,
        PrismaService,
        UserSignUpUseCase,
        UserLogInUseCase,
        CreateUserUseCase,
        GetUserByEmailUseCase,
        {
          provide: UserRepository,
          useClass: PrismaUserRepository,
        },
        GetUserByIdUseCase,
      ],
    }).compile();

    app = module.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        forbidUnknownValues: true,
      }),
    );

    await app.init();

    userSignUpUseCase = module.get<UserSignUpUseCase>(UserSignUpUseCase);
    userRepository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
    userLogInUseCase = module.get<UserLogInUseCase>(UserLogInUseCase);
    jwtService = module.get<JwtService>(JwtService);
  });

  beforeEach(async () => {
    await PrismaUtils.clearDatabase(prismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/sign-up', () => {
    describe('Should validate request', () => {
      const dataSet: Array<{ case: string; body: Partial<UserSignUpRequest> }> =
        [
          { case: 'empty body', body: {} },
          {
            case: 'invalid email',
            body: {
              email: 'invalid_email',
              password: '123',
              firstName: 'Nicolás',
              lastName: 'Flórez',
              phone: '3058668807',
              role: UserRole.Admin,
            },
          },
          {
            case: 'missing firstName',
            body: {
              email: 'nflorez@gmail.com',
              password: '123',
              lastName: 'Flórez',
              phone: '3058668807',
              role: UserRole.Admin,
            },
          },
          {
            case: 'missing lastName',
            body: {
              email: 'nflorez@gmail.com',
              password: '123',
              firstName: 'Nicolás',
              phone: '3058668807',
              role: UserRole.Admin,
            },
          },
          {
            case: 'missing password',
            body: {
              email: 'nflorez@gmail.com',
              firstName: 'Nicolás',
              phone: '3058668807',
              role: UserRole.Admin,
            },
          },
        ];

      it.each(dataSet)('Validate $case', async (data) => {
        await request(app.getHttpServer())
          .post('/auth/sign-up')
          .send(data.body)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    it('should return BAD REQUEST if use case throws error', async () => {
      const useCaseSpy = jest
        .spyOn(userRepository, 'create')
        .mockRejectedValue(new Error('Error'));

      const userSignUpRequest: UserSignUpRequest = {
        email: 'nflorez@gmail.com',
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: UserRole.Admin,
      };

      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(userSignUpRequest)
        .expect(400);

      useCaseSpy.mockRestore();
    });

    it('should call UserSignUpUseCase with correct parameters', async () => {
      const now = new Date();
      jest.useFakeTimers().setSystemTime(now);

      const useCaseSpy = jest.spyOn(userSignUpUseCase, 'execute');
      const userRepositorySpy = jest.spyOn(userRepository, 'create');

      const userSignUpRequest: UserSignUpRequest = {
        email: 'nflorez@gmail.com',
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: UserRole.Admin,
      };

      const dto = new CreateUserDto(
        userSignUpRequest.email,
        userSignUpRequest.password,
        userSignUpRequest.firstName,
        userSignUpRequest.lastName,
        userSignUpRequest.phone,
        userSignUpRequest.role,
        now,
        now,
      );

      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(userSignUpRequest)
        .expect(201);

      const existingUser = await userRepository.findByEmail(
        userSignUpRequest.email,
      );

      expect(useCaseSpy).toHaveBeenCalledWith(dto);

      expect(userRepositorySpy).toHaveBeenCalledWith(dto);
      expect(existingUser).toBeDefined();
      expect(existingUser).toBeInstanceOf(UserEntity);
      expect(existingUser.id).toBeGreaterThan(0);
      expect(existingUser.email).toBe(userSignUpRequest.email);
      expect(existingUser.firstName).toBe(userSignUpRequest.firstName);

      // La contraseña en base de datos debe estar encriptada
      expect(existingUser.password).not.toBe(userSignUpRequest.password);

      jest.useRealTimers();
    });

    it('should return CONFLICT if user already exists', async () => {
      const fakeUser = UserFactory.create();
      await userRepository.create(fakeUser);

      const userSignUpRequest: UserSignUpRequest = {
        email: fakeUser.email,
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: UserRole.Admin,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(userSignUpRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toBe(
        `User with email ${fakeUser.email} already exists`,
      );
    });
  });

  describe('POST /auth/login', () => {
    describe('Should validate request', () => {
      const dataSet: Array<{ case: string; body: Partial<UserLogInRequest> }> =
        [
          { case: 'empty body', body: {} },
          {
            case: 'invalid email',
            body: {
              email: 'not_valid-email',
              password: 'password123',
            },
          },
          {
            case: 'missing password',
            body: {
              email: 'johndoe@gmail.com',
              password: '',
            },
          },
        ];

      it.each(dataSet)('Validate $case', async (data) => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send(data.body)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    it('should return BAD REQUEST if use case throws error', async () => {
      const useCaseSpy = jest
        .spyOn(userRepository, 'findByEmail')
        .mockRejectedValue(new Error('Error'));

      const userSignUpRequest: UserSignUpRequest = {
        email: 'nflorez@gmail.com',
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: UserRole.Admin,
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(userSignUpRequest)
        .expect(400);

      useCaseSpy.mockRestore();
    });

    it('Should return UNAUTHORIZED when user is not found', async () => {
      const userLogInRequest: UserLogInRequest = {
        email: 'notexistinguser@gmail.com',
        password: '1234',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(userLogInRequest)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe(`Invalid email`);
    });

    it('Should return UNAUTHORIZED when password is invalid', async () => {
      const fakeUser = UserFactory.create();

      await userRepository.create(fakeUser);

      const userLogInRequest: UserLogInRequest = {
        email: fakeUser.email,
        password: 'invalidpassword',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(userLogInRequest)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe('Invalid password');
    });

    it('should call UserLogInUseCase with correct parameters', async () => {
      const fakeUser = UserFactory.create();
      userRepository.create(fakeUser);

      const useCaseSpy = jest.spyOn(userLogInUseCase, 'execute');

      const userLogInRequest: UserLogInRequest = {
        email: fakeUser.email,
        password: fakeUser.password,
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(userLogInRequest)
        .expect(HttpStatus.OK);

      expect(useCaseSpy).toHaveBeenCalledWith(
        userLogInRequest.email,
        userLogInRequest.password,
      );
    });
  });

  describe('POST /auth/validate-token', () => {
    it('should return BAD REQUEST if token is not provided', async () => {
      await request(app.getHttpServer())
        .post('/auth/validate-token')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return UNAUTHORIZED if token is invalid', async () => {
      const token = 'tu-token-valido'; // Asegúrate de usar un token válido o simulado

      await request(app.getHttpServer())
        .post('/auth/validate-token')
        .set('Authorization', `Bearer ${token}`) // Agrega el encabezado Authorization
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return UNAUTHORIZED if token is expired', async () => {
      const user = UserFactory.create();
      const token = await jwtService.generateToken({
        id: user.id,
      });

      jest
        .useFakeTimers()
        .setSystemTime(new Date(Date.now() + 2 * 60 * 60 * 1000));

      await request(app.getHttpServer())
        .post('/auth/validate-token')
        .set('Authorization', `Bearer ${token}`) // Agrega el encabezado Authorization
        .expect(HttpStatus.UNAUTHORIZED);

      jest.useRealTimers();
    });

    it('should validate token and return user data', async () => {
      const user = UserFactory.create();

      await prismaService.user.create({
        data: {
          id: user.id,
          email: user.email,
          password: user.password,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role,
        },
      });

      const token = await jwtService.generateToken({
        id: user.id,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/validate-token') // Ruta a la que estás enviando la solicitud
        .set('Authorization', `Bearer ${token}`) // Agrega el encabezado Authorization
        .expect(200); // Espera un código de estado 200

      // Aquí puedes hacer aserciones sobre la respuesta
      expect(response.body).toHaveProperty('user'); // Asegúrate de que la respuesta tenga el campo 'user'
      expect(response.body).toHaveProperty('token'); // Asegúrate de que la respuesta también tenga el token
    });

    it('should return UNAUTHORIZED if user is not found', async () => {
      const token = await jwtService.generateToken({
        id: 1,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/validate-token')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe('User with id 1 not found');
    });
  });
});
