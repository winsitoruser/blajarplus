import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto, CreateConversationDto } from './dto';

@ApiTags('chat')
@Controller('chat')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create or get existing conversation' })
  createConversation(@Req() req, @Body() dto: CreateConversationDto) {
    return this.chatService.createConversation(req.user.id, dto);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations' })
  getConversations(@Req() req) {
    return this.chatService.getConversations(req.user.id);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 50 })
  getMessages(
    @Req() req,
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.chatService.getMessages(req.user.id, id, page, limit);
  }

  @Post('messages')
  @ApiOperation({ summary: 'Send a message' })
  sendMessage(@Req() req, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(req.user.id, dto);
  }

  @Post('conversations/:id/read')
  @ApiOperation({ summary: 'Mark all messages as read' })
  markAsRead(@Req() req, @Param('id') id: string) {
    return this.chatService.markAsRead(req.user.id, id);
  }

  @Delete('messages/:id')
  @ApiOperation({ summary: 'Delete a message' })
  deleteMessage(@Req() req, @Param('id') id: string) {
    return this.chatService.deleteMessage(req.user.id, id);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get total unread message count' })
  getTotalUnreadCount(@Req() req) {
    return this.chatService.getTotalUnreadCount(req.user.id);
  }
}
