import { PrismaService } from '@common/database/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '@user/domain/dtos/create-user.dto';
import { UserEntity } from '@user/domain/entities/user.entity';
import { UserRole } from '@user/domain/enums/user-role.enum';
import { UserAlreadyExistException } from '@user/domain/exceptions/user-already-exist.exception';
import { PrismaUserRepository } from '@user/infrastructure/repositories/prisma-user.repository';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';
import { UserFactory } from 'test/utils/factories/user.factory';
import { PrismaUtils } from 'test/utils/PrismaUtils';

describe('PrismaUserRepository', () => {
  let prismaService: PrismaService;
  let userRepository: PrismaUserRepository;
  let loggerErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, PrismaUserRepository],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    userRepository = module.get<PrismaUserRepository>(PrismaUserRepository);
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    await PrismaUtils.clearDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  function createCondominium() {
    const condominium = CondominiumFactory.create();
    return prismaService.condominium.create({
      data: {
        id: condominium.getId(),
        name: condominium.getName(),
        address: condominium.getAddress(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  describe('create method', () => {
    it('should create a user', async () => {
      const condominium = await createCondominium();
      const user = UserFactory.create({
        condominiumId: condominium.id,
      });

      const result = await userRepository.create(
        new CreateUserDto(
          user.condominiumId,
          user.email,
          user.password,
          user.firstName,
          user.lastName,
          user.phone,
          user.role,
        ),
      );

      expect(result.id).toBeGreaterThan(0);
      expect(result.firstName).toBe(user.firstName);
      expect(result.email).toBe(user.email);
      // Contraseña debe ser diferente a la original porque se encripta
      expect(result.password).not.toBe(user.password);
    });

    it('should throw an UserAlreadyExistException if email is already in use', async () => {
      const condominiumCreated = await createCondominium();
      const user = UserFactory.create({
        condominiumId: condominiumCreated.id,
      });

      await prismaService.user.create({
        data: {
          id: user.id,
          condominium_id: condominiumCreated.id,
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
            user.condominiumId,
            user.email,
            user.password,
            user.firstName,
            user.lastName,
            user.phone,
            user.role,
          ),
        ),
      ).rejects.toThrow(
        new UserAlreadyExistException(`User with email ${user.email} already exists`),
      );
    });

    it('should throw an error if Prisma throws an unexpected error', async () => {
      const user = UserFactory.create();

      jest.spyOn(prismaService.user, 'create').mockRejectedValueOnce(new Error());

      await expect(
        userRepository.create(
          new CreateUserDto(
            user.condominiumId,
            user.email,
            user.password,
            user.firstName,
            user.lastName,
            user.phone,
            user.role,
          ),
        ),
      ).rejects.toThrow();

      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const condominiumCreated = await createCondominium();

      const user = UserFactory.create({
        condominiumId: condominiumCreated.id,
      });

      await prismaService.user.create({
        data: {
          id: user.id,
          condominium_id: user.condominiumId,
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
      const condominiumCreated = await createCondominium();
      const user = UserFactory.create({
        condominiumId: condominiumCreated.id,
        createdAt: now,
        updatedAt: now,
      });

      await prismaService.user.create({
        data: {
          id: user.id,
          condominium_id: user.condominiumId,
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
      const condominiumCreated = await createCondominium();
      const user = UserFactory.create({
        condominiumId: condominiumCreated.id,
      });

      await prismaService.user.create({
        data: {
          id: user.id,
          condominium_id: user.condominiumId,
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
        user.condominiumId,
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

    it("should return null if user doesn't exist", async () => {
      const user = UserFactory.create();

      const result = await userRepository.update(user);

      expect(result).toBe(null);
    });

    it('should throw an error if Prisma throws an unexpected error', async () => {
      const user = UserFactory.create();

      jest.spyOn(prismaService.user, 'update').mockRejectedValueOnce(new Error());

      await expect(userRepository.update(user)).rejects.toThrow();

      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });
});
