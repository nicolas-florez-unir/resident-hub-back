import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '@auth/infrastructure/controllers/auth.controller';
import { UserSignUpUseCase } from '@auth/application/use-cases/user-sign-up.use-case';
import { UserSignUpRequest } from '@auth/infrastructure/requests/UserSignUp.request';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { PrismaUserRepository } from '@user/infrastructure/repositories/prisma.user.repository';
import { PrismaService } from '@common/database/prisma/prisma.service';
import { PrismaUtils } from 'test/utils/PrismaUtils';
import { UserLogInUseCase } from '@auth/application/use-cases/user-log-in.use-case';
import { UserLogInRequest } from '@auth/infrastructure/requests/UserLogIn.request';
import { UserFactory } from 'test/utils/factories/user.factory';
import { ApplicationJwtService } from '@auth/infrastructure/jwt/application-jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { UserRole } from '@user/domain/enums/UserRole.enum';
import { GetUserByIdUseCase } from '@user/application/use-cases/get-user-by-id.use-case';
import { CreateUserUseCase } from '@user/application/use-cases/create-user.use-case';
import { GetUserByEmailUseCase } from '@user/application/use-cases/get-user-by-email.use-case';
import { GetCondominiumByIdUseCase } from '@condominium/application/use-cases/get-condominium-by-id.use-case';
import { CondominiumRepository } from '@condominium/domain/repositories/condominium.repository';
import { PrismaCondominiumRepository } from '@condominium/infrastructure/repositories/prisma-condominium.repository';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';
import { UserEntity } from '@user/domain/entities/User.entity';
import { CreateUserDto } from '@user/domain/dtos/CreateUserDto';

describe('AuthController', () => {
  let app: INestApplication;
  let userSignUpUseCase: UserSignUpUseCase;
  let userRepository: UserRepository;
  let userLogInUseCase: UserLogInUseCase;
  let prismaService: PrismaService;
  let applicationJwtService: ApplicationJwtService;

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
        ApplicationJwtService,
        PrismaService,
        UserSignUpUseCase,
        UserLogInUseCase,
        CreateUserUseCase,
        GetUserByEmailUseCase,
        GetCondominiumByIdUseCase,
        {
          provide: UserRepository,
          useClass: PrismaUserRepository,
        },
        {
          provide: CondominiumRepository,
          useClass: PrismaCondominiumRepository,
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
    applicationJwtService = module.get<ApplicationJwtService>(
      ApplicationJwtService,
    );
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
              role: UserRole.Administrator,
            },
          },
          {
            case: 'missing firstName',
            body: {
              email: 'nflorez@gmail.com',
              password: '123',
              lastName: 'Flórez',
              phone: '3058668807',
              role: UserRole.Administrator,
            },
          },
          {
            case: 'missing lastName',
            body: {
              email: 'nflorez@gmail.com',
              password: '123',
              firstName: 'Nicolás',
              phone: '3058668807',
              role: UserRole.Administrator,
            },
          },
          {
            case: 'missing password',
            body: {
              email: 'nflorez@gmail.com',
              firstName: 'Nicolás',
              phone: '3058668807',
              role: UserRole.Administrator,
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

    it('should return BAD REQUEST if use case throws unhandled error', async () => {
      const useCaseSpy = jest
        .spyOn(userSignUpUseCase, 'execute')
        .mockRejectedValue(new Error('Error'));

      const userSignUpRequest: UserSignUpRequest = {
        condominiumId: 1,
        email: 'nflorez@gmail.com',
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: UserRole.Administrator,
      };

      await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(userSignUpRequest)
        .expect(400);

      useCaseSpy.mockRestore();
    });

    it('should call UserSignUpUseCase with correct parameters', async () => {
      const useCaseSpy = jest.spyOn(userSignUpUseCase, 'execute');
      const userRepositorySpy = jest.spyOn(userRepository, 'create');

      const fakeCondominium = CondominiumFactory.create();
      await prismaService.condominium.create({
        data: {
          id: fakeCondominium.getId(),
          name: fakeCondominium.getName(),
          address: fakeCondominium.getAddress(),
        },
      });

      const userSignUpRequest: UserSignUpRequest = {
        condominiumId: fakeCondominium.getId(),
        email: 'nflorez@gmail.com',
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: UserRole.Administrator,
      };

      const dto = new CreateUserDto(
        userSignUpRequest.condominiumId,
        userSignUpRequest.email,
        userSignUpRequest.password,
        userSignUpRequest.firstName,
        userSignUpRequest.lastName,
        userSignUpRequest.phone,
        userSignUpRequest.role,
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
    });

    it('should return CONFLICT if user already exists', async () => {
      const fakeCondominium = CondominiumFactory.create();
      await prismaService.condominium.create({
        data: {
          id: fakeCondominium.getId(),
          name: fakeCondominium.getName(),
          address: fakeCondominium.getAddress(),
        },
      });

      const fakeUser = UserFactory.create({
        condominiumId: fakeCondominium.getId(),
      });
      await userRepository.create(fakeUser);

      const userSignUpRequest: UserSignUpRequest = {
        condominiumId: 1,
        email: fakeUser.email,
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: UserRole.Administrator,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(userSignUpRequest)
        .expect(HttpStatus.CONFLICT);

      expect(response.body.message).toBe(
        `User with email ${fakeUser.email} already exists`,
      );
    });

    it('should return NotFoundException if condominium does not exist', async () => {
      const fakeUser = UserFactory.create();

      const userSignUpRequest: UserSignUpRequest = {
        condominiumId: 1,
        email: fakeUser.email,
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: UserRole.Administrator,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(userSignUpRequest)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe(
        `Condominium with id ${userSignUpRequest.condominiumId} not found`,
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
        condominiumId: 1,
        email: 'nflorez@gmail.com',
        password: '123',
        firstName: 'Nicolás',
        lastName: 'Flórez',
        phone: '3058668807',
        role: UserRole.Administrator,
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
      const fakeCondominium = CondominiumFactory.create();
      await prismaService.condominium.create({
        data: {
          id: fakeCondominium.getId(),
          name: fakeCondominium.getName(),
          address: fakeCondominium.getAddress(),
        },
      });

      const fakeUser = UserFactory.create({
        condominiumId: fakeCondominium.getId(),
      });
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
      const fakeCondominium = CondominiumFactory.create();
      await prismaService.condominium.create({
        data: {
          id: fakeCondominium.getId(),
          name: fakeCondominium.getName(),
          address: fakeCondominium.getAddress(),
        },
      });

      const fakeUser = UserFactory.create({
        condominiumId: fakeCondominium.getId(),
      });
      await userRepository.create(fakeUser);

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
      const token = applicationJwtService.generateToken({
        id: user.id,
        condominium_id: user.condominiumId,
        role: user.role,
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
      const condominium = CondominiumFactory.create();

      await prismaService.condominium.create({
        data: {
          id: condominium.getId(),
          name: condominium.getName(),
          address: condominium.getAddress(),
        },
      });

      await prismaService.user.create({
        data: {
          condominium_id: condominium.getId(),
          id: user.id,
          email: user.email,
          password: user.password,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role,
        },
      });

      const token = applicationJwtService.generateToken({
        id: user.id,
        condominium_id: user.condominiumId,
        role: user.role,
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
      const token = await applicationJwtService.generateToken({
        id: 1,
        condominium_id: 1,
        role: UserRole.Administrator,
      });

      const response = await request(app.getHttpServer())
        .post('/auth/validate-token')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body.message).toBe('User with id 1 not found');
    });

    it('should return InternalServerErrorException if something strange happen', async () => {
      const token = await applicationJwtService.generateToken({
        id: 1,
        condominium_id: 1,
        role: UserRole.Administrator,
      });

      const useCaseSpy = jest
        .spyOn(userRepository, 'findById')
        .mockRejectedValue(new Error('Error'));

      await request(app.getHttpServer())
        .post('/auth/validate-token')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);

      useCaseSpy.mockRestore();
    });
  });
});
