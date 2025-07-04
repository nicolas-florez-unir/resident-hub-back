import { UserRole } from '@user/domain/enums/user-role.enum';
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
  @IsIn([UserRole.Administrator, UserRole.HouseOwner])
  role: UserRole;
}
