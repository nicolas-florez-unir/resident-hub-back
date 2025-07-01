import { IsString } from 'class-validator';

export class CreateCondominiumRequest {
  @IsString()
  name: string;

  @IsString()
  address: string;
}
