import { FineType } from '../enums/fine-type.enum';
import { FineStatus } from '../enums/fine-status.enum';
import { HouseEntity } from 'src/modules/house/domain/entities/house.entity';
import { Currency } from '../enums/currency.enum';

export class FineEntity {
  constructor(
    public readonly id: number,
    public readonly type: FineType,
    public readonly house: HouseEntity,
    public readonly issuedDate: Date,
    public readonly amount: number,
    public readonly currency: Currency,
    public readonly status: FineStatus,
    public readonly reason: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  // Additional methods can be added here for business logic
}
