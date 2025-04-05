import { Test, TestingModule } from '@nestjs/testing';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { CondominiumController } from '@condominium/infrastructure/controllers/condominium.controller';
import { CreateCondominiumUseCase } from '@condominium/application/use-cases/create-condominium.use-case';
import { AssignAdministratorUseCase } from '@condominium/application/use-cases/assign-administrator.use-case';
import { CreateCondominiumRequest } from '@condominium/infrastructure/requests/CreateCondominium.request';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';
import { CondominiumPresenter } from '@condominium/infrastructure/presenters/Condominium.presenter';
import { CondominiumNotFoundException } from '@condominium/domain/exceptions/condominiun-not-found.exception';
import { JwtModule } from '@nestjs/jwt';

describe('CondominiumController', () => {
  let controller: CondominiumController;
  let createCondominiumUseCase: CreateCondominiumUseCase;
  let assignAdministratorUseCase: AssignAdministratorUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CondominiumController],
      imports: [
        JwtModule.register({
          global: true,
          secret: 'random_secret',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        {
          provide: CreateCondominiumUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: AssignAdministratorUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CondominiumController>(CondominiumController);
    createCondominiumUseCase = module.get<CreateCondominiumUseCase>(
      CreateCondominiumUseCase,
    );
    assignAdministratorUseCase = module.get<AssignAdministratorUseCase>(
      AssignAdministratorUseCase,
    );
  });

  describe('createCondominium', () => {
    it('should create a condominium and return its presenter', async () => {
      const request: CreateCondominiumRequest = {
        name: 'Test Condo',
        address: '123 Test St',
      };
      const condominium = CondominiumFactory.create();
      jest
        .spyOn(createCondominiumUseCase, 'execute')
        .mockResolvedValue(condominium);

      const result = await controller.createCondominium(request);

      expect(createCondominiumUseCase.execute).toHaveBeenCalledWith({
        name: request.name,
        address: request.address,
      });
      expect(result).toEqual(CondominiumPresenter.toObject(condominium));
    });

    it('should throw InternalServerErrorException on error', async () => {
      const request: CreateCondominiumRequest = {
        name: 'Test Condo',
        address: '123 Test St',
      };
      jest
        .spyOn(createCondominiumUseCase, 'execute')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.createCondominium(request)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('assignAdministrator', () => {
    it('should assign an administrator to a condominium and return its presenter', async () => {
      const condominiumId = 1;
      const userId = 2;
      const condominium = CondominiumFactory.create();
      jest
        .spyOn(assignAdministratorUseCase, 'execute')
        .mockResolvedValue(condominium);

      const result = await controller.assignAdministrator(
        condominiumId,
        userId,
      );

      expect(assignAdministratorUseCase.execute).toHaveBeenCalledWith(
        condominiumId,
        userId,
      );
      expect(result).toEqual(CondominiumPresenter.toObject(condominium));
    });

    it('should throw NotFoundException if condominium is not found', async () => {
      const condominiumId = 1;
      const userId = 2;
      jest
        .spyOn(assignAdministratorUseCase, 'execute')
        .mockRejectedValue(
          new CondominiumNotFoundException('Condominium not found'),
        );

      await expect(
        controller.assignAdministrator(condominiumId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const condominiumId = 1;
      const userId = 2;
      jest
        .spyOn(assignAdministratorUseCase, 'execute')
        .mockRejectedValue(new UserNotFoundException('User not found'));

      await expect(
        controller.assignAdministrator(condominiumId, userId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const condominiumId = 1;
      const userId = 2;
      jest
        .spyOn(assignAdministratorUseCase, 'execute')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(
        controller.assignAdministrator(condominiumId, userId),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
