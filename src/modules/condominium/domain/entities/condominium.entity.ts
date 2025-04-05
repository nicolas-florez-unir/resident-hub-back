import { UserEntity } from '@user/domain/entities/User.entity';

export class CondominiumEntity {
  constructor(
    private id: number,
    private name: string,
    private address: string,
    private administratorId: number,
    private createdAt: Date,
    private updatedAt: Date,
    private administrator?: UserEntity,
  ) {}

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getAddress(): string {
    return this.address;
  }

  public setAddress(address: string): void {
    this.address = address;
  }

  public getAdministratorId(): number {
    return this.administratorId;
  }

  public setAdministratorId(administratorId: number): void {
    this.administratorId = administratorId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }

  public getAdministrator(): UserEntity | undefined {
    return this.administrator;
  }

  public setAdministrator(administrator: UserEntity | undefined): void {
    this.administrator = administrator;
  }
}
