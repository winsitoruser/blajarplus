import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MidtransNotificationDto {
  @ApiProperty()
  @IsString()
  transaction_status: string;

  @ApiProperty()
  @IsString()
  order_id: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  payment_type?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fraud_status?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  signature_key?: string;
}
