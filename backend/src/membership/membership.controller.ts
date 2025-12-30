import { Controller, Get, Post, Put, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MembershipService } from './membership.service';
import { MembershipTier, MembershipStatus } from '@prisma/client';

@ApiTags('membership')
@Controller('membership')
export class MembershipController {
  constructor(private membershipService: MembershipService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all membership plans' })
  getAllPlans() {
    return this.membershipService.getAllPlans();
  }

  @Get('plans/:tier')
  @ApiOperation({ summary: 'Get plan by tier' })
  getPlanByTier(@Param('tier') tier: MembershipTier) {
    return this.membershipService.getPlanByTier(tier);
  }

  @Get('my-subscription')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get tutor current subscription' })
  async getMySubscription(@Req() req) {
    // Get tutor profile
    const tutor = await this.membershipService['prisma'].tutorProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!tutor) {
      return { error: 'Tutor profile not found' };
    }

    return this.membershipService.getTutorSubscription(tutor.id);
  }

  @Get('can-create-class')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if tutor can create more classes' })
  async canCreateClass(@Req() req) {
    const tutor = await this.membershipService['prisma'].tutorProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!tutor) {
      return { error: 'Tutor profile not found' };
    }

    return this.membershipService.canCreateClass(tutor.id);
  }

  @Post('upgrade')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upgrade membership' })
  async upgradeMembership(
    @Req() req,
    @Body() body: { planId: string; paymentId?: string }
  ) {
    const tutor = await this.membershipService['prisma'].tutorProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!tutor) {
      return { error: 'Tutor profile not found' };
    }

    return this.membershipService.upgradeMembership(tutor.id, body.planId, body.paymentId);
  }

  @Post('cancel/:subscriptionId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel subscription' })
  async cancelSubscription(@Req() req, @Param('subscriptionId') subscriptionId: string) {
    const tutor = await this.membershipService['prisma'].tutorProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!tutor) {
      return { error: 'Tutor profile not found' };
    }

    return this.membershipService.cancelSubscription(tutor.id, subscriptionId);
  }

  // Admin endpoints
  @Get('admin/subscriptions')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Get all subscriptions' })
  getAllSubscriptions(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: MembershipStatus,
    @Query('tier') tier?: MembershipTier
  ) {
    return this.membershipService.getAllSubscriptions(page, limit, status, tier);
  }

  @Get('admin/stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Get membership statistics' })
  getMembershipStats() {
    return this.membershipService.getMembershipStats();
  }

  @Put('admin/plans/:planId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Update plan configuration' })
  updatePlan(@Param('planId') planId: string, @Body() data: any) {
    return this.membershipService.updatePlan(planId, data);
  }

  @Post('admin/plans/:planId/toggle')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin: Toggle plan active status' })
  togglePlanStatus(@Param('planId') planId: string) {
    return this.membershipService.togglePlanStatus(planId);
  }
}
