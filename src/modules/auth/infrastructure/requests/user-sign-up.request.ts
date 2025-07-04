import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { UserRole } from '@user/domain/enums/user-role.enum';

export class UserSignUpRequest {
  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  @IsPositive()
  condominiumId: number;

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
  @IsIn([UserRole.Administrator, UserRole.HouseOwner])
  role: UserRole;
}
