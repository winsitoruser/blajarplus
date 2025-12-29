import { IsString, IsNumber, Min, Max, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty({ example: 4, minimum: 1, maximum: 5, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ example: 'Updated comment', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}
