import { FineType } from '../enums/fine-type.enum';
import { FineStatus } from '../enums/fine-status.enum';
import { Currency } from '../enums/currency.enum';

export interface CreateFineDto {
  type: FineType;
  houseId: number;
  issuedDate: Date;
  amount: number;
  currency: Currency;
  status: FineStatus;
  reason: string;
}
