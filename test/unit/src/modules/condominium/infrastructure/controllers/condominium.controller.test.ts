import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserNotFoundException } from '@user/domain/exceptions/user-not-found.exception';
import { CondominiumController } from '@condominium/infrastructure/controllers/condominium.controller';
import { CreateCondominiumUseCase } from '@condominium/application/use-cases/create-condominium.use-case';
import { AssignAdministratorUseCase } from '@condominium/application/use-cases/assign-administrator.use-case';
import { CreateCondominiumRequest } from '@condominium/infrastructure/requests/CreateCondominium.request';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';
import { CondominiumPresenter } from '@condominium/infrastructure/presenters/Condominium.presenter';
import { CondominiumNotFoundException } from '@condominium/domain/exceptions/condominiun-not-found.exception';
import { JwtModule } from '@nestjs/jwt';
import { GetCondominiumByIdUseCase } from '@condominium/application/use-cases/get-condominium-by-id.use-case';
import { UpdateCondominiumLogoUseCase } from '@condominium/application/use-cases/update-condominium-logo.use-case';
import { UserFactory } from 'test/utils/factories/user.factory';
import { UserRole } from '@user/domain/enums/UserRole.enum';
import { UserFromRequestInterface } from '@common/interfaces/user-from-request.interface';

describe('CondominiumController', () => {
  let controller: CondominiumController;
  let createCondominiumUseCase: CreateCondominiumUseCase;
  let assignAdministratorUseCase: AssignAdministratorUseCase;
  let getCondominiumByIdUseCase: GetCondominiumByIdUseCase;
  let updateCondominiumLogoUseCase: UpdateCondominiumLogoUseCase;

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
        {
          provide: GetCondominiumByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: UpdateCondominiumLogoUseCase,
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
    getCondominiumByIdUseCase = module.get<GetCondominiumByIdUseCase>(
      GetCondominiumByIdUseCase,
    );
    updateCondominiumLogoUseCase = module.get<UpdateCondominiumLogoUseCase>(
      UpdateCondominiumLogoUseCase,
    );
  });

  describe('createCondominium', () => {
    it('should create a condominium and return its presenter', async () => {
      const request: CreateCondominiumRequest = {
        name: 'Test Condo',
        address: '123 Test St',
      };
      const condominium = CondominiumFactory.create();
      jest.spyOn(createCondominiumUseCase, 'execute').mockResolvedValue(condominium);

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
      const condominium = CondominiumFactory.create();
      const administrator = UserFactory.create({
        role: UserRole.Administrator,
      });

      condominium.setAdministrator(administrator);

      jest.spyOn(assignAdministratorUseCase, 'execute').mockResolvedValue(condominium);

      const result = await controller.assignAdministrator(
        condominium.getId(),
        administrator.id,
      );

      expect(assignAdministratorUseCase.execute).toHaveBeenCalledWith(
        condominium.getId(),
        administrator.id,
      );
      expect(result).toEqual(CondominiumPresenter.toObject(condominium));
    });

    it('should throw NotFoundException if condominium is not found', async () => {
      const condominiumId = 1;
      const userId = 2;
      jest
        .spyOn(assignAdministratorUseCase, 'execute')
        .mockRejectedValue(new CondominiumNotFoundException('Condominium not found'));

      await expect(controller.assignAdministrator(condominiumId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if user is not found', async () => {
      const condominiumId = 1;
      const userId = 2;
      jest
        .spyOn(assignAdministratorUseCase, 'execute')
        .mockRejectedValue(new UserNotFoundException('User not found'));

      await expect(controller.assignAdministrator(condominiumId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const condominiumId = 1;
      const userId = 2;
      jest
        .spyOn(assignAdministratorUseCase, 'execute')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.assignAdministrator(condominiumId, userId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getCondominiumInfo', () => {
    it('should return the condominium info', async () => {
      const condominium = CondominiumFactory.create();
      const userFromRequest: UserFromRequestInterface = {
        id: 1,
        condominium_id: condominium.getId(),
        role: UserRole.Administrator,
      };

      jest.spyOn(getCondominiumByIdUseCase, 'execute').mockResolvedValue(condominium);

      const result = await controller.getCondominiumInfo(userFromRequest);

      expect(getCondominiumByIdUseCase.execute).toHaveBeenCalledWith(condominium.getId());
      expect(result).toEqual(CondominiumPresenter.toObject(condominium));
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const condominium = CondominiumFactory.create();
      const userFromRequest: UserFromRequestInterface = {
        id: 1,
        condominium_id: condominium.getId(),
        role: UserRole.Administrator,
      };

      jest
        .spyOn(getCondominiumByIdUseCase, 'execute')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.getCondominiumInfo(userFromRequest)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should return NotFoundException if condominium is not found', async () => {
      const condominium = CondominiumFactory.create();
      const userFromRequest: UserFromRequestInterface = {
        id: 1,
        condominium_id: condominium.getId(),
        role: UserRole.Administrator,
      };

      jest
        .spyOn(getCondominiumByIdUseCase, 'execute')
        .mockRejectedValue(new CondominiumNotFoundException('Condominium not found'));

      await expect(controller.getCondominiumInfo(userFromRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateCondominiumLogo', () => {
    const dummyFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('dummy image content'),
      size: 50000,
      stream: null as any,
      destination: '',
      filename: 'test.jpg',
      path: '',
    };

    const userFromRequest: UserFromRequestInterface = {
      id: 1,
      condominium_id: 1,
      role: UserRole.Administrator,
    };

    it('should upload logo successfully', async () => {
      const condominium = CondominiumFactory.create();
      jest.spyOn(getCondominiumByIdUseCase, 'execute').mockResolvedValue(condominium);
      jest.spyOn(updateCondominiumLogoUseCase, 'execute').mockResolvedValue(undefined);

      const result = await controller.uploadLogo(dummyFile, userFromRequest);

      expect(getCondominiumByIdUseCase.execute).toHaveBeenCalledWith(
        userFromRequest.condominium_id,
      );
      expect(updateCondominiumLogoUseCase.execute).toHaveBeenCalledWith(
        dummyFile,
        condominium,
      );
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if condominium is not found', async () => {
      jest
        .spyOn(getCondominiumByIdUseCase, 'execute')
        .mockRejectedValue(new CondominiumNotFoundException('Condominium not found'));

      await expect(controller.uploadLogo(dummyFile, userFromRequest)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      const condominium = CondominiumFactory.create();
      jest.spyOn(getCondominiumByIdUseCase, 'execute').mockResolvedValue(condominium);
      jest
        .spyOn(updateCondominiumLogoUseCase, 'execute')
        .mockRejectedValue(new Error('Unexpected error'));

      await expect(controller.uploadLogo(dummyFile, userFromRequest)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
