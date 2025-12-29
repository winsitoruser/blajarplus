import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({ example: 'user-uuid', description: 'ID of the other participant' })
  @IsString()
  participantId: string;
}
