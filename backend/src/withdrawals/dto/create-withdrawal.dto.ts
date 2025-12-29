import { IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWithdrawalDto {
  @ApiProperty({ example: 100000 })
  @IsNumber()
  @Min(50000)
  amount: number;

  @ApiProperty({ example: 'BCA' })
  @IsString()
  bankName: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  bankAccountNumber: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  bankAccountName: string;
}
