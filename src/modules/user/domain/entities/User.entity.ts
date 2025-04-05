import { UserRole } from '../enums/UserRole.enum';

export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly condominiumId: number,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public role: UserRole,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  public getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  public update(
    email: string,
    firstName: string,
    lastName: string,
    phone: string,
  ): void {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
  }

  public isAdministrator() {
    return this.role === UserRole.Administrator;
  }
}
