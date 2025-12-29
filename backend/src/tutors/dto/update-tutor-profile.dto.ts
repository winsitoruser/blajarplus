import { IsString, IsOptional, IsArray, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTutorProfileDto {
  @ApiProperty({ example: 'Guru Matematika Berpengalaman' })
  @IsString()
  @IsOptional()
  headline?: string;

  @ApiProperty({ example: 'Saya adalah guru matematika berpengalaman 5 tahun' })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 'S1 Pendidikan Matematika, Universitas Indonesia' })
  @IsString()
  @IsOptional()
  education?: string;

  @ApiProperty({ example: 5, description: 'Years of teaching experience' })
  @IsNumber()
  @IsOptional()
  experienceYears?: number;

  @ApiProperty({ example: ['Matematika', 'Fisika'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  subjects?: string[];

  @ApiProperty({ example: 100000, description: 'Hourly rate in IDR' })
  @IsNumber()
  @Min(10000)
  @IsOptional()
  hourlyRate?: number;

  @ApiProperty({ example: 'Jakarta Selatan' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ example: ['online', 'offline'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  teachingMethods?: string[];
}
