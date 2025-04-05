import { UserRole } from '../enums/UserRole.enum';

export class CreateUserDto {
  constructor(
    readonly condominiumId: number,
    readonly email: string,
    readonly password: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly phone: string,
    readonly role: UserRole,
  ) {}
}
