import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TutorsService } from './tutors.service';
import { CreateTutorProfileDto, UpdateTutorProfileDto, SearchTutorDto } from './dto';

@ApiTags('tutors')
@Controller('tutors')
export class TutorsController {
  constructor(private tutorsService: TutorsService) {}

  @Post('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create tutor profile' })
  createProfile(@Req() req, @Body() dto: CreateTutorProfileDto) {
    return this.tutorsService.createProfile(req.user.id, dto);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tutor profile' })
  updateProfile(@Req() req, @Body() dto: UpdateTutorProfileDto) {
    return this.tutorsService.updateProfile(req.user.id, dto);
  }

  @Get('profile/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my tutor profile' })
  getMyProfile(@Req() req) {
    return this.tutorsService.getMyProfile(req.user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search tutors with filters' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiQuery({ name: 'subject', required: false, description: 'Subject name' })
  @ApiQuery({ name: 'educationLevel', required: false, description: 'Education level' })
  @ApiQuery({ name: 'city', required: false, description: 'City' })
  @ApiQuery({ name: 'teachingMethod', required: false, description: 'Teaching method' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum hourly rate' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum hourly rate' })
  @ApiQuery({ name: 'minRating', required: false, description: 'Minimum rating' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  searchTutors(@Query() dto: SearchTutorDto) {
    return this.tutorsService.searchTutors(dto);
  }

  @Get('subjects')
  @ApiOperation({ summary: 'Get all subjects' })
  getAllSubjects() {
    return this.tutorsService.getAllSubjects();
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all subject categories' })
  getSubjectCategories() {
    return this.tutorsService.getSubjectCategories();
  }

  @Get('earnings/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tutor earnings' })
  getMyEarnings(@Req() req) {
    return this.tutorsService.getMyEarnings(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tutor by ID' })
  getTutorById(@Param('id') id: string) {
    return this.tutorsService.getTutorById(id);
  }
}
