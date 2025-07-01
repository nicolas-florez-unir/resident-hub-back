import { CondominiumEntity } from '@condominium/domain/entities/condominium.entity';
import { UserEntity } from '@user/domain/entities/user.entity';

export class HouseEntity {
  constructor(
    private id: number,
    private houseNumber: string,
    private owner: UserEntity,
    private condominium: CondominiumEntity,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  getId(): number {
    return this.id;
  }

  getHouseNumber(): string {
    return this.houseNumber;
  }

  getOwner(): UserEntity {
    return this.owner;
  }

  getCondominium(): CondominiumEntity {
    return this.condominium;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
