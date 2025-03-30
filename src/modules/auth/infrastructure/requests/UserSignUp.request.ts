import { UserRole } from '@user/domain/enums/UserRole.enum';
import { IsEmail, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UserSignUpRequest {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

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
