import { IsString, IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({ example: 'booking-uuid' })
  @IsString()
  bookingId: string;

  @ApiProperty({ example: 'credit_card', description: 'Payment method from Midtrans' })
  @IsString()
  paymentMethod: string;

  @ApiProperty({ example: 'https://myapp.com/payment/callback', required: false })
  @IsString()
  @IsOptional()
  callbackUrl?: string;
}
