import { PrismaService } from '@common/database/prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '@user/domain/dtos/CreateUserDto';
import { UserEntity } from '@user/domain/entities/User.entity';
import { UserRole } from '@user/domain/enums/UserRole.enum';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { PrismaUserRepository } from 'src/modules/user/infrastructure/repositories/prisma.user.repository';
import { UserFactory } from 'test/utils/factories/user.factory';
import { PrismaUtils } from 'test/utils/PrismaUtils';

describe('PrismaUserRepository', () => {
  let prismaService: PrismaService;
  let userRepository: PrismaUserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, PrismaUserRepository],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    userRepository = module.get<PrismaUserRepository>(PrismaUserRepository);
  });

  beforeEach(async () => {
    await PrismaUtils.clearDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('create method', () => {
    it('should create a user', async () => {
      const user = UserFactory.create();

      const result = await userRepository.create(
        new CreateUserDto(
          user.email,
          user.password,
          user.firstName,
          user.lastName,
          user.phone,
          user.role,
          user.createdAt,
          user.updatedAt,
        ),
      );

      expect(result.id).toBeGreaterThan(0);
      expect(result.firstName).toBe(user.firstName);
      expect(result.email).toBe(user.email);
      // Contraseña debe ser diferente a la original porque se encripta
      expect(result.password).not.toBe(user.password);
    });

    it('should throw an error if email is already in use', async () => {
      const user = UserFactory.create();
      await prismaService.user.create({
        data: {
          id: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role,
          password: user.password,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      await expect(
        userRepository.create(
          new CreateUserDto(
            user.email,
            user.password,
            user.firstName,
            user.lastName,
            user.phone,
            user.role,
            user.createdAt,
            user.updatedAt,
          ),
        ),
      ).rejects.toThrow(`User with email ${user.email} already exists`);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const user = UserFactory.create();
      await prismaService.user.create({
        data: {
          id: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role,
          password: user.password,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      });

      const result = await userRepository.findByEmail(user.email);

      expect(result).toEqual(user);
    });

    it('Should return null if user not found', async () => {
      const result = await userRepository.findByEmail('fakeemail');
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find a user by id', async () => {
      const now = new Date();

      const user = UserFactory.create();
      await prismaService.user.create({
        data: {
          id: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role,
          password: user.password,
          created_at: now,
          updated_at: now,
        },
      });

      const result = await userRepository.findById(user.id);

      expect(result).toEqual(user);
    });

    it('Should return null if user not found', async () => {
      const result = await userRepository.findById(0);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = UserFactory.create();

      await prismaService.user.create({
        data: {
          id: user.id,
          email: user.email,
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role,
          password: user.password,
          created_at: user.createdAt,
          updated_at: user.updatedAt,
        },
      });

      const updatedUser = new UserEntity(
        user.id,
        'newemail',
        'newpassword',
        'newfirstname',
        'newlastname',
        'newphone',
        UserRole.HouseOwner,
        user.createdAt,
        user.updatedAt,
      );

      const result = await userRepository.update(updatedUser);

      expect(result.firstName).toBe(updatedUser.firstName);
      expect(result.lastName).toBe(updatedUser.lastName);
      expect(result.phone).toBe(updatedUser.phone);
      expect(result.role).toBe(updatedUser.role);
    });

    it('should throw an error if user not found', async () => {
      const user = UserFactory.create();

      await expect(userRepository.update(user)).rejects.toThrow(
        new UserNotFoundException(`User with id ${user.id} not found`),
      );
    });
  });
});
