import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AuthRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  name: string;
}
