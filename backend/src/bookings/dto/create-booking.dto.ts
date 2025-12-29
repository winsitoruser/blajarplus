import { IsString, IsDateString, IsNumber, Min, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BookingType {
  SINGLE = 'single',
  PACKAGE = 'package',
}

export class CreateBookingDto {
  @ApiProperty({ example: 'tutor-uuid' })
  @IsString()
  tutorId: string;

  @ApiProperty({ example: 'subject-uuid' })
  @IsString()
  subjectId: string;

  @ApiProperty({ example: '2024-12-30T10:00:00.000Z' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ example: 2, description: 'Duration in hours' })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({ enum: BookingType, example: BookingType.SINGLE })
  @IsEnum(BookingType)
  bookingType: BookingType;

  @ApiProperty({ example: 1, required: false, description: 'Number of sessions for package' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  numberOfSessions?: number;

  @ApiProperty({ example: 'Tolong fokus ke materi trigonometri', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'Jl. Sudirman No. 123, Jakarta', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'online', description: 'online or offline' })
  @IsString()
  teachingMethod: string;
}
