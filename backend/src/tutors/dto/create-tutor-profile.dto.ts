import { IsString, IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTutorProfileDto {
  @ApiProperty({ example: 'Guru Matematika Berpengalaman' })
  @IsString()
  @IsOptional()
  headline?: string;

  @ApiProperty({ example: 'Saya adalah guru matematika berpengalaman 5 tahun' })
  @IsString()
  bio: string;

  @ApiProperty({ example: 'S1 Pendidikan Matematika, Universitas Indonesia' })
  @IsString()
  education: string;

  @ApiProperty({ example: 5, description: 'Years of teaching experience' })
  @IsNumber()
  @IsOptional()
  experienceYears?: number;

  @ApiProperty({ example: ['Matematika', 'Fisika'] })
  @IsArray()
  @IsString({ each: true })
  subjects: string[];

  @ApiProperty({ example: 100000, description: 'Hourly rate in IDR' })
  @IsNumber()
  @Min(10000)
  hourlyRate: number;

  @ApiProperty({ example: 'Jakarta Selatan' })
  @IsString()
  city: string;

  @ApiProperty({ example: ['online', 'offline'] })
  @IsArray()
  @IsString({ each: true })
  teachingMethods: string[];
}
