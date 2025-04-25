import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@user/infrastructure/controllers/user.controller';
import { UserRepository } from '@user/domain/repositories/user.repository';
import { AuthGuard } from '@common/guards/auth.guard';
import { UserFromRequestInterface } from '@common/interfaces/user-from-request.interface';
import { UserPresenter } from '@auth/infrastructure/presenters/User.presenter';
import { GetUserByIdUseCase } from '@user/application/use-cases/get-user-by-id.use-case';
import { UpdateUserUseCase } from '@user/application/use-cases/update-user.use-case';
import { UserFactory } from 'test/utils/factories/user.factory';
import { UpdateUserRequest } from '@user/infrastructure/requests/UpdateUser.request';
import { UserEntity } from '@user/domain/entities/User.entity';
import { CondominiumFactory } from 'test/utils/factories/condominium.factory';
import { UserRole } from '@user/domain/enums/UserRole.enum';

describe('UserController', () => {
  let userController: UserController;
  let userRepository: jest.Mocked<UserRepository>;
  let getUserByIdUseCase: GetUserByIdUseCase;
  let updateUserUseCase: UpdateUserUseCase;

  beforeEach(async () => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        GetUserByIdUseCase,
        UpdateUserUseCase,
        { provide: UserRepository, useValue: userRepository },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    userController = module.get<UserController>(UserController);
    updateUserUseCase = module.get<UpdateUserUseCase>(UpdateUserUseCase);
    getUserByIdUseCase = module.get<GetUserByIdUseCase>(GetUserByIdUseCase);
  });

  describe('getUserInfo', () => {
    it('should return user info when user exists', async () => {
      const mockUser = UserFactory.create();
      const mockUserFromRequest: UserFromRequestInterface = {
        id: mockUser.id,
        condominium_id: mockUser.condominiumId,
        role: mockUser.role,
      };

      userRepository.findById.mockResolvedValue(mockUser);

      const result = await userController.getUserInfo(mockUserFromRequest);

      expect(userRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(UserPresenter.toObject(mockUser));
    });

    it('should throw an error when user does not exist', async () => {
      const mockUserFromRequest: UserFromRequestInterface = {
        id: 1,
        condominium_id: 1,
        role: UserRole.Administrator,
      };

      userRepository.findById.mockResolvedValue(null);

      await expect(userController.getUserInfo(mockUserFromRequest)).rejects.toThrow();
      expect(userRepository.findById).toHaveBeenCalledWith(1);
    });
  });

  describe('updateUser', () => {
    it('should return updated user info when user exists', async () => {
      const mockCondominium = CondominiumFactory.create();
      const mockUser = UserFactory.create({ id: 1, email: 'old@email.com' });
      const mockUserFromRequest: UserFromRequestInterface = {
        id: mockUser.id,
        condominium_id: mockUser.condominiumId,
        role: mockUser.role,
      };
      const updateUserRequest: UpdateUserRequest = {
        email: 'new@email.com',
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        phone: mockUser.phone,
        role: mockUser.role,
      };

      const userUpdated = new UserEntity(
        mockUser.id,
        mockCondominium.getId(),
        updateUserRequest.email,
        mockUser.password,
        updateUserRequest.firstName,
        updateUserRequest.lastName,
        updateUserRequest.phone,
        updateUserRequest.role,
        mockUser.createdAt,
        mockUser.updatedAt,
      );

      jest.spyOn(getUserByIdUseCase, 'execute').mockResolvedValue(mockUser);
      jest.spyOn(updateUserUseCase, 'execute').mockResolvedValue(userUpdated);

      const result = await userController.updateUser(
        mockUserFromRequest,
        updateUserRequest,
      );

      expect(result).toEqual(UserPresenter.toObject(userUpdated));
    });

    it('should throw an error when user does not exist', async () => {
      const mockUser = UserFactory.create();
      const mockUserFromRequest: UserFromRequestInterface = {
        id: mockUser.id,
        condominium_id: 0,
        role: UserRole.Administrator,
      };

      userRepository.findById.mockResolvedValue(null);

      await expect(
        userController.updateUser(mockUserFromRequest, mockUser),
      ).rejects.toThrow();
      expect(userRepository.findById).toHaveBeenCalledWith(1);
    });
  });
});
