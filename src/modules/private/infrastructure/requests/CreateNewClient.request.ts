import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class Condominium {
  @IsString()
  name: string;
}

export class Administrator {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;
}

export class CreateNewClientRequest {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Condominium)
  condominium: Condominium;

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Administrator)
  administrator: Administrator;
}
