import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, QueryReviewDto } from './dto';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create review for completed booking' })
  createReview(@Req() req, @Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(req.user.id, dto);
  }

  @Get('my-reviews')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my reviews' })
  getMyReviews(@Req() req, @Query() dto: QueryReviewDto) {
    return this.reviewsService.getMyReviews(req.user.id, dto);
  }

  @Get('tutor/:tutorId')
  @ApiOperation({ summary: 'Get reviews for a tutor (public)' })
  getTutorReviews(@Param('tutorId') tutorId: string, @Query() dto: QueryReviewDto) {
    return this.reviewsService.getTutorReviews(tutorId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID (public)' })
  getReviewById(@Param('id') id: string) {
    return this.reviewsService.getReviewById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update review' })
  updateReview(@Req() req, @Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.updateReview(req.user.id, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete review' })
  deleteReview(@Req() req, @Param('id') id: string) {
    return this.reviewsService.deleteReview(req.user.id, id);
  }
}
