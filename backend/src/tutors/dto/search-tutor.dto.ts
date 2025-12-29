import { IsString, IsOptional, IsNumber, Min, Max, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum SortBy {
  RATING = 'rating',
  PRICE_LOW = 'price_low',
  PRICE_HIGH = 'price_high',
  EXPERIENCE = 'experience',
  NEWEST = 'newest',
}

export class SearchTutorDto {
  @ApiProperty({ required: false, example: 'matematika' })
  @IsString()
  @IsOptional()
  q?: string;

  @ApiProperty({ required: false, example: 'Matematika' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({ required: false, example: 'SMA' })
  @IsString()
  @IsOptional()
  educationLevel?: string;

  @ApiProperty({ required: false, example: 'Jakarta' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false, example: 'online' })
  @IsString()
  @IsOptional()
  teachingMethod?: string;

  @ApiProperty({ required: false, example: 50000, description: 'Minimum hourly rate' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({ required: false, example: 200000, description: 'Maximum hourly rate' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({ required: false, example: 4, description: 'Minimum rating' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  minRating?: number;

  @ApiProperty({ required: false, enum: SortBy, default: SortBy.RATING })
  @IsEnum(SortBy)
  @IsOptional()
  sortBy?: SortBy;

  @ApiProperty({ required: false, example: 1, default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({ required: false, example: 20, default: 20 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}
