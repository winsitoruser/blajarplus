import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';

@ApiTags('gamification')
@Controller('gamification')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  @Get('progress')
  @ApiOperation({ summary: 'Get user progress (XP, level, streak, etc.)' })
  async getProgress(@Req() req) {
    return this.gamificationService.getUserProgress(req.user.id);
  }

  @Get('achievements')
  @ApiOperation({ summary: 'Get user achievements' })
  async getAchievements(@Req() req) {
    return this.gamificationService.getUserAchievements(req.user.id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get learning history' })
  async getHistory(@Req() req, @Query('limit') limit?: number) {
    return this.gamificationService.getLearningHistory(
      req.user.id,
      limit ? parseInt(limit.toString()) : 10
    );
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get leaderboard' })
  async getLeaderboard(@Query('limit') limit?: number) {
    return this.gamificationService.getLeaderboard(
      limit ? parseInt(limit.toString()) : 10
    );
  }

  @Post('complete-lesson')
  @ApiOperation({ summary: 'Mark lesson as complete and update progress' })
  async completeLesson(
    @Req() req,
    @Body() body: { bookingId: string; duration: number; rating?: number }
  ) {
    return this.gamificationService.updateProgress(
      req.user.id,
      body.bookingId,
      body.duration,
      body.rating
    );
  }
}
