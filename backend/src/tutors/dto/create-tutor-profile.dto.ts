import { IsString, IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTutorProfileDto {
  @ApiProperty({ example: 'Saya adalah guru matematika berpengalaman 5 tahun' })
  @IsString()
  bio: string;

  @ApiProperty({ example: 'S1 Pendidikan Matematika, Universitas Indonesia' })
  @IsString()
  education: string;

  @ApiProperty({ example: '5 tahun mengajar di sekolah swasta' })
  @IsString()
  @IsOptional()
  experience?: string;

  @ApiProperty({ example: ['Matematika', 'Fisika'] })
  @IsArray()
  @IsString({ each: true })
  subjects: string[];

  @ApiProperty({ example: ['SD', 'SMP', 'SMA'] })
  @IsArray()
  @IsString({ each: true })
  educationLevels: string[];

  @ApiProperty({ example: 100000, description: 'Hourly rate in IDR' })
  @IsNumber()
  @Min(10000)
  hourlyRate: number;

  @ApiProperty({ example: 'Jakarta Selatan' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'DKI Jakarta' })
  @IsString()
  province: string;

  @ApiProperty({ example: ['online', 'offline'] })
  @IsArray()
  @IsString({ each: true })
  teachingMethods: string[];

  @ApiProperty({ example: 'Saya bisa mengajar di rumah siswa atau di tempat umum' })
  @IsString()
  @IsOptional()
  teachingPreferences?: string;
}
