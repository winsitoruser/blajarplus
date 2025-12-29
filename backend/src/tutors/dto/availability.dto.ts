import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateAvailabilityDto {
  @ApiProperty({ description: 'Day of week (0=Sunday, 6=Saturday)', example: 1 })
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ description: 'Start time (HH:mm format)', example: '09:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ description: 'End time (HH:mm format)', example: '17:00' })
  @IsString()
  endTime: string;

  @ApiProperty({ description: 'Slot duration in minutes', example: 60, required: false })
  @IsOptional()
  @IsInt()
  slotDurationMinutes?: number;
}

export class UpdateAvailabilityDto {
  @ApiProperty({ description: 'Start time (HH:mm format)', example: '09:00', required: false })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiProperty({ description: 'End time (HH:mm format)', example: '17:00', required: false })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiProperty({ description: 'Slot duration in minutes', example: 60, required: false })
  @IsOptional()
  @IsInt()
  slotDurationMinutes?: number;

  @ApiProperty({ description: 'Is active', example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateTimeOffDto {
  @ApiProperty({ description: 'Start date and time', example: '2024-12-30T09:00:00Z' })
  @IsString()
  startAt: string;

  @ApiProperty({ description: 'End date and time', example: '2024-12-31T17:00:00Z' })
  @IsString()
  endAt: string;

  @ApiProperty({ description: 'Reason for time off', example: 'Liburan', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}
