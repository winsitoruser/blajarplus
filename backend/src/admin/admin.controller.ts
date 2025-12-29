import { Controller, Get, Put, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { VerifyTutorDto } from './dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('tutors/pending')
  @ApiOperation({ summary: 'Get pending tutor verifications' })
  getPendingTutors(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getPendingTutors(page, limit);
  }

  @Get('tutors/:id')
  @ApiOperation({ summary: 'Get tutor details for verification' })
  getTutorForVerification(@Param('id') id: string) {
    return this.adminService.getTutorForVerification(id);
  }

  @Put('tutors/:id/verify')
  @ApiOperation({ summary: 'Verify or reject tutor' })
  verifyTutor(@Param('id') id: string, @Body() dto: VerifyTutorDto) {
    return this.adminService.verifyTutor(id, dto);
  }

  @Get('withdrawals/pending')
  @ApiOperation({ summary: 'Get pending withdrawal requests' })
  getPendingWithdrawals(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getPendingWithdrawals(page, limit);
  }

  @Put('withdrawals/:id/approve')
  @ApiOperation({ summary: 'Approve withdrawal request' })
  approveWithdrawal(@Param('id') id: string) {
    return this.adminService.approveWithdrawal(id);
  }

  @Put('withdrawals/:id/reject')
  @ApiOperation({ summary: 'Reject withdrawal request' })
  rejectWithdrawal(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.rejectWithdrawal(id, reason);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  getAdminStats() {
    return this.adminService.getAdminStats();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  getTransactions(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getTransactions(page, limit, { status, startDate, endDate });
  }

  @Get('students')
  @ApiOperation({ summary: 'Get all students' })
  getStudents(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.adminService.getStudents(page, limit, search);
  }

  @Get('tutors')
  @ApiOperation({ summary: 'Get all tutors with filters' })
  getTutors(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getTutors(page, limit, { status, search });
  }

  @Get('subjects')
  @ApiOperation({ summary: 'Get all subjects/courses with stats' })
  getSubjects() {
    return this.adminService.getSubjects();
  }

  @Get('activities')
  @ApiOperation({ summary: 'Get business activities' })
  getBusinessActivities(@Query('days') days?: number) {
    return this.adminService.getBusinessActivities(days || 30);
  }

  @Get('recent-activities')
  @ApiOperation({ summary: 'Get recent activities' })
  getRecentActivities(@Query('limit') limit?: number) {
    return this.adminService.getRecentActivities(limit || 20);
  }
}
