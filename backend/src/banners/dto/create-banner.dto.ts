import { IsString, IsOptional, IsEnum, IsBoolean, IsInt, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum BannerType {
  INFO = 'info',
  WARNING = 'warning',
  SUCCESS = 'success',
  PROMOTION = 'promotion',
}

export enum BannerTarget {
  ALL = 'all',
  STUDENT = 'student',
  TUTOR = 'tutor',
}

export class CreateBannerDto {
  @ApiProperty({ example: 'Promo Spesial Akhir Tahun!' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Dapatkan diskon hingga 50% untuk semua paket belajar', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://example.com/banner.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'https://example.com/promo', required: false })
  @IsString()
  @IsOptional()
  linkUrl?: string;

  @ApiProperty({ enum: BannerType, default: BannerType.INFO })
  @IsEnum(BannerType)
  @IsOptional()
  type?: BannerType;

  @ApiProperty({ enum: BannerTarget, default: BannerTarget.ALL })
  @IsEnum(BannerTarget)
  @IsOptional()
  target?: BannerTarget;

  @ApiProperty({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 0, default: 0 })
  @IsInt()
  @IsOptional()
  order?: number;

  @ApiProperty({ example: '2025-01-01T00:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: '2025-12-31T23:59:59Z', required: false })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}
