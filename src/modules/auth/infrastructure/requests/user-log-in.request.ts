import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLogInRequest {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
