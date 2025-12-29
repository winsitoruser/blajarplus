import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateSyllabusDto {
  @ApiProperty({ description: 'Tutor subject ID', example: 'uuid' })
  @IsString()
  tutorSubjectId: string;

  @ApiProperty({ description: 'Syllabus title', example: 'Matematika Dasar SMA' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description', example: 'Silabus lengkap matematika...', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Topics array', example: ['Aljabar', 'Geometri'], required: false })
  @IsOptional()
  @IsArray()
  topics?: string[];
}

export class CreateMaterialDto {
  @ApiProperty({ description: 'Syllabus ID', example: 'uuid' })
  @IsString()
  syllabusId: string;

  @ApiProperty({ description: 'Material title', example: 'Persamaan Linear' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Material content', example: 'Materi lengkap...', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ description: 'Order/sequence', example: 1, required: false })
  @IsOptional()
  order?: number;

  @ApiProperty({ description: 'Attachment URL', example: 'https://...', required: false })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}

export class UpdateProgressDto {
  @ApiProperty({ description: 'Booking ID', example: 'uuid' })
  @IsString()
  bookingId: string;

  @ApiProperty({ description: 'Summary of the lesson', example: 'Siswa memahami...', required: false })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ description: 'Homework assigned', example: 'Latihan soal hal 20-25', required: false })
  @IsOptional()
  @IsString()
  homework?: string;

  @ApiProperty({ description: 'Next lesson plan', example: 'Lanjut ke bab 3', required: false })
  @IsOptional()
  @IsString()
  nextPlan?: string;

  @ApiProperty({ description: 'Attachment URL', example: 'https://...', required: false })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;
}
