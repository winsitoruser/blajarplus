import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AdminRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export class CreateAdminDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: AdminRole, default: AdminRole.ADMIN })
  @IsEnum(AdminRole)
  adminRole: AdminRole;
}

export class UpdateAdminDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: AdminRole, required: false })
  @IsOptional()
  @IsEnum(AdminRole)
  adminRole?: AdminRole;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
