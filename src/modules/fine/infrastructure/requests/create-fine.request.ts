import { IsDateString, IsIn, IsNumber, IsPositive, IsString } from 'class-validator';
import { FineType } from '../../domain/enums/fine-type.enum';
import { Currency } from '../../domain/enums/currency.enum';
import { FineStatus } from '../../domain/enums/fine-status.enum';

export class CreateFineRequest {
  @IsString()
  @IsIn([FineType.LATE_PAYMENT, FineType.NON_COMPLIANCE])
  type: FineType;

  @IsNumber()
  @IsPositive()
  houseId: number;

  @IsDateString()
  issuedDate: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @IsIn([Currency.USD, Currency.EUR, Currency.COP])
  currency: Currency;

  @IsString()
  @IsIn([FineStatus.APPEALED, FineStatus.PAID, FineStatus.PENDING])
  status: FineStatus;

  @IsString()
  reason: string;
}
