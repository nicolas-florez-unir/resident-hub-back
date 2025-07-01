import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateHouseRequest {
  @IsString()
  @IsNotEmpty()
  houseNumber: string;

  @IsNumber()
  @IsPositive()
  ownerId: number;
}
