import { UserRole } from '../enums/UserRole.enum';

export class CreateUserDto {
  constructor(
    readonly email: string,
    readonly password: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly phone: string,
    readonly role: UserRole,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ) {}
}
