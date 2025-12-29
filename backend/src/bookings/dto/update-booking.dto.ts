import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookingDto {
  @ApiProperty({ example: '2024-12-30T14:00:00.000Z', required: false })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @ApiProperty({ example: 'Updated notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'Updated location', required: false })
  @IsString()
  @IsOptional()
  location?: string;
}
