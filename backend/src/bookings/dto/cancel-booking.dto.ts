import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelBookingDto {
  @ApiProperty({ example: 'Saya ada keperluan mendadak', required: false })
  @IsString()
  @IsOptional()
  cancellationReason?: string;
}
