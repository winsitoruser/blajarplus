import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum VerificationStatus {
  VERIFIED = 'verified',
  REJECTED = 'rejected',
}

export class VerifyTutorDto {
  @ApiProperty({ enum: VerificationStatus })
  @IsEnum(VerificationStatus)
  status: VerificationStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
