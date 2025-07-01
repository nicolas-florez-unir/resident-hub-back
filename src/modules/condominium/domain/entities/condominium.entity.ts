import { UserEntity } from '@user/domain/entities/user.entity';

export class CondominiumEntity {
  constructor(
    private id: number,
    private name: string,
    private address: string,
    private logo: string | null,
    private administrator: UserEntity | null,
    private createdAt: Date,
    private updatedAt: Date,
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

  public getLogo(): string {
    return this.logo;
  }

  public setLogo(logo: string): void {
    this.logo = logo;
  }
}
