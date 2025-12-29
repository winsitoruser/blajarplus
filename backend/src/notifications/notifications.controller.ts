import { Controller, Get, Put, Param, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get my notifications' })
  getMyNotifications(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('unreadOnly') unreadOnly?: boolean,
  ) {
    return this.notificationsService.getMyNotifications(req.user.id, page, limit, unreadOnly);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@Req() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Req() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.id, id);
  }

  @Put('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}
