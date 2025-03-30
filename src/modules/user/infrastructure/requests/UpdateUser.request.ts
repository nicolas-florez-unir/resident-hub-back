import { UserRole } from '@user/domain/enums/UserRole.enum';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserRequest {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsIn(['Admin', 'HouseOwner'])
  role: UserRole;
}
