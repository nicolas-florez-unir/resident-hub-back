import { PrismaService } from '@common/database/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaCondominiumRepository } from 'src/modules/condominium/infrastructure/repositories/prisma-condominium.repository';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';
import { PrismaUtils } from 'test/utils/PrismaUtils';
import { CreateCondominiumDto } from 'src/modules/condominium/domain/dtos/CreateCondominium.dto';
import { CondominiumEntity } from 'src/modules/condominium/domain/entities/condominium.entity';

describe('PrismaCondominiumRepository', () => {
  let prismaService: PrismaService;
  let condominiumRepository: PrismaCondominiumRepository;
  let loggerErrorSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, PrismaCondominiumRepository],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    condominiumRepository = module.get<PrismaCondominiumRepository>(
      PrismaCondominiumRepository,
    );
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  beforeEach(async () => {
    await PrismaUtils.clearDatabase(prismaService);
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  describe('create method', () => {
    it('should create a condominium', async () => {
      const condominium = CondominiumFactory.create();
      const dto = new CreateCondominiumDto(
        condominium.getName(),
        condominium.getAddress(),
      );

      const result = await condominiumRepository.create(dto);

      expect(result.getId()).toBeGreaterThan(0);
      expect(result.getName()).toBe(dto.name);
      expect(result.getAddress()).toBe(dto.address);
    });
  });

  describe('findById method', () => {
    it('should find a condominium by id', async () => {
      const condominium = CondominiumFactory.create();

      const condominiumCreated = await prismaService.condominium.create({
        data: {
          name: condominium.getName(),
          address: condominium.getAddress(),
          created_at: condominium.getCreatedAt(),
          updated_at: condominium.getUpdatedAt(),
        },
      });

      const result = await condominiumRepository.findById(condominiumCreated.id);

      expect(result).toBeInstanceOf(CondominiumEntity);
      expect(result.getId()).toBe(condominium.getId());
      expect(result.getName()).toBe(condominium.getName());
      expect(result.getAddress()).toBe(condominium.getAddress());
    });

    it('should return null if condominium not found', async () => {
      const result = await condominiumRepository.findById(0);
      expect(result).toBeNull();
    });
  });

  describe('update method', () => {
    it('should update a condominium', async () => {
      const condominium = CondominiumFactory.create();

      await prismaService.condominium.create({
        data: {
          id: condominium.getId(),
          name: condominium.getName(),
          address: condominium.getAddress(),
          created_at: condominium.getCreatedAt(),
          updated_at: condominium.getUpdatedAt(),
        },
      });

      const updatedCondominium = new CondominiumEntity(
        condominium.getId(),
        'Updated Name',
        'Updated Address',
        condominium.getAdministratorId(),
        condominium.getCreatedAt(),
        new Date(),
      );

      const result = await condominiumRepository.update(updatedCondominium);

      expect(result).toBeInstanceOf(CondominiumEntity);
      expect(result.getName()).toBe(updatedCondominium.getName());
      expect(result.getAddress()).toBe(updatedCondominium.getAddress());
    });

    it('should return null if condominium does not exist', async () => {
      const condominium = CondominiumFactory.create();

      const result = await condominiumRepository.update(condominium);

      expect(result).toBeNull();
    });

    it('should throw an error if Prisma throws an unexpected error', async () => {
      const condominium = CondominiumFactory.create();

      jest.spyOn(prismaService.condominium, 'update').mockRejectedValueOnce(new Error());

      await expect(condominiumRepository.update(condominium)).rejects.toThrow();

      expect(loggerErrorSpy).toHaveBeenCalled();
    });
  });
});
