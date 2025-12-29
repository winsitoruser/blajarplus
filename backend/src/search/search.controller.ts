import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Post('history')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Save search history' })
  saveSearchHistory(@Req() req, @Body() searchData: any) {
    return this.searchService.saveSearchHistory(req.user.id, searchData);
  }

  @Get('history')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user search history' })
  getSearchHistory(@Req() req, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    return this.searchService.getSearchHistory(req.user.id, limitNum);
  }

  @Delete('history/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete specific search history' })
  deleteSearchHistory(@Req() req, @Param('id') id: string) {
    return this.searchService.deleteSearchHistory(req.user.id, id);
  }

  @Delete('history')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Clear all search history' })
  clearAllSearchHistory(@Req() req) {
    return this.searchService.clearAllSearchHistory(req.user.id);
  }

  @Get('recommendations')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get personalized tutor recommendations' })
  getRecommendations(@Req() req) {
    return this.searchService.getRecommendations(req.user.id);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular search queries' })
  getPopularSearches(@Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 5;
    return this.searchService.getPopularSearches(limitNum);
  }
}
