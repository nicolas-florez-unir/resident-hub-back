import { Injectable } from '@nestjs/common';
import { CreateCondominiumUseCase } from '@condominium/application/use-cases/create-condominium.use-case';
import { CreateUserUseCase } from '@user/application/use-cases/create-user.use-case';
import { AssignAdministratorUseCase } from '@condominium/application/use-cases/assign-administrator.use-case';
import { CreateCondominiumDto } from '@condominium/domain/dtos/create-condominium.dto';
import { CreateUserDto } from '@user/domain/dtos/create-user.dto';
import { UserRole } from '@user/domain/enums/user-role.enum';
import { envs } from '@common/env/env.validation';

interface CreateNewClientInterface {
  condominium: {
    name: string;
  };
  administrator: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

@Injectable()
export class CreateNewClientUseCase {
  constructor(
    private readonly createCondominiumUseCase: CreateCondominiumUseCase,
    private readonly assignAdministratorUseCase: AssignAdministratorUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async execute({ condominium, administrator }: CreateNewClientInterface) {
    const newCondominium = await this.createCondominiumUseCase.execute(
      new CreateCondominiumDto(condominium.name, ''),
    );

    const newAdministrator = await this.createUserUseCase.execute(
      new CreateUserDto(
        newCondominium.getId(),
        administrator.email,
        envs.defaultUserPassword,
        administrator.firstName,
        administrator.lastName,
        '',
        UserRole.Administrator,
      ),
    );

    await this.assignAdministratorUseCase.execute(
      newCondominium.getId(),
      newAdministrator.id,
    );
  }
}
