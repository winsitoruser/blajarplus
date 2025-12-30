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

  @Post('complete-activity')
  @ApiOperation({ summary: 'Mark activity as complete and update progress' })
  async completeActivity(
    @Req() req,
    @Body() body: { duration: number; activityType: string; description: string }
  ) {
    return this.gamificationService.updateProgress(
      req.user.id,
      body.duration,
      body.activityType,
      body.description
    );
  }
}
