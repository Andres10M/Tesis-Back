import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  locked?: boolean;

  @IsOptional()
  @IsString()
  personId?: string;
}
