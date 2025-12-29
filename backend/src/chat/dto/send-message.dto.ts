import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ example: 'conversation-uuid' })
  @IsString()
  conversationId: string;

  @ApiProperty({ example: 'Halo, saya ingin bertanya tentang materi trigonometri' })
  @IsString()
  message: string;

  @ApiProperty({ example: 'https://example.com/file.pdf', required: false })
  @IsString()
  @IsOptional()
  attachmentUrl?: string;
}
