import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TutorsService } from './tutors.service';
import { CreateTutorProfileDto, UpdateTutorProfileDto, SearchTutorDto, CreateAvailabilityDto, UpdateAvailabilityDto, CreateTimeOffDto } from './dto';
import { CreateSyllabusDto, CreateMaterialDto, UpdateProgressDto } from './dto/syllabus.dto';

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

  // Availability Management
  @Post('availability')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create availability slot' })
  createAvailability(@Req() req, @Body() dto: CreateAvailabilityDto) {
    return this.tutorsService.createAvailability(req.user.id, dto);
  }

  @Get('availability/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my availability slots' })
  getMyAvailability(@Req() req) {
    return this.tutorsService.getMyAvailability(req.user.id);
  }

  @Put('availability/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update availability slot' })
  updateAvailability(@Req() req, @Param('id') id: string, @Body() dto: UpdateAvailabilityDto) {
    return this.tutorsService.updateAvailability(req.user.id, id, dto);
  }

  @Delete('availability/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete availability slot' })
  deleteAvailability(@Req() req, @Param('id') id: string) {
    return this.tutorsService.deleteAvailability(req.user.id, id);
  }

  // Time Off Management
  @Post('time-off')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create time off' })
  createTimeOff(@Req() req, @Body() dto: CreateTimeOffDto) {
    return this.tutorsService.createTimeOff(req.user.id, dto);
  }

  @Get('time-off/me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my time offs' })
  getMyTimeOffs(@Req() req) {
    return this.tutorsService.getMyTimeOffs(req.user.id);
  }

  @Delete('time-off/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete time off' })
  deleteTimeOff(@Req() req, @Param('id') id: string) {
    return this.tutorsService.deleteTimeOff(req.user.id, id);
  }

  // Get available slots for booking
  @Get(':id/available-slots')
  @ApiOperation({ summary: 'Get available time slots for a tutor' })
  @ApiQuery({ name: 'date', required: true, description: 'Date (YYYY-MM-DD)' })
  getAvailableSlots(@Param('id') tutorId: string, @Query('date') date: string) {
    return this.tutorsService.getAvailableSlots(tutorId, date);
  }

  // Student Management
  // @Get('students/me')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get my students list' })
  // getMyStudents(@Req() req) {
  //   return this.tutorsService.getMyStudents(req.user.id);
  // }

  // @Get('students/:studentId/progress')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get student progress' })
  // getStudentProgress(@Req() req, @Param('studentId') studentId: string) {
  //   return this.tutorsService.getStudentProgress(req.user.id, studentId);
  // }

  // Syllabus Management
  // @Post('syllabus')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Create syllabus' })
  // createSyllabus(@Req() req, @Body() dto: CreateSyllabusDto) {
  //   return this.tutorsService.createSyllabus(req.user.id, dto);
  // }

  // @Get('syllabus/me')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get my syllabi' })
  // getMySyllabi(@Req() req) {
  //   return this.tutorsService.getMySyllabi(req.user.id);
  // }

  // @Get('syllabus/:id')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get syllabus by ID' })
  // getSyllabusById(@Req() req, @Param('id') id: string) {
  //   return this.tutorsService.getSyllabusById(req.user.id, id);
  // }

  // @Delete('syllabus/:id')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Delete syllabus' })
  // deleteSyllabus(@Req() req, @Param('id') id: string) {
  //   return this.tutorsService.deleteSyllabus(req.user.id, id);
  // }

  // Material Management
  // @Post('material')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Create material' })
  // createMaterial(@Req() req, @Body() dto: CreateMaterialDto) {
  //   return this.tutorsService.createMaterial(req.user.id, dto);
  // }

  // @Delete('material/:id')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Delete material' })
  // deleteMaterial(@Req() req, @Param('id') id: string) {
  //   return this.tutorsService.deleteMaterial(req.user.id, id);
  // }

  // Progress Tracking
  // @Post('progress')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Create/Update progress log' })
  // updateProgress(@Req() req, @Body() dto: UpdateProgressDto) {
  //   return this.tutorsService.updateProgress(req.user.id, dto);
  // }

  // @Get('progress/:bookingId')
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Get progress by booking' })
  // getProgressByBooking(@Req() req, @Param('bookingId') bookingId: string) {
  //   return this.tutorsService.getProgressByBooking(req.user.id, bookingId);
  // }
}
