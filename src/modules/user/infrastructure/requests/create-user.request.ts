import { UserRole } from '@user/domain/enums/user-role.enum';
import { IsIn, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  @IsIn([UserRole.Administrator, UserRole.HouseOwner])
  role: UserRole;
}
