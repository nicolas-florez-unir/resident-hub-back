import { IsString } from 'class-validator';

export class UpdateCondominiumRequest {
  @IsString()
  name: string;

  @IsString()
  address: string;
}
