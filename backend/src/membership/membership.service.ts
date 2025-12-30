import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MembershipTier, MembershipStatus } from '@prisma/client';

@Injectable()
export class MembershipService {
  constructor(private prisma: PrismaService) {}

  // Get all membership plans
  async getAllPlans() {
    return this.prisma.membershipPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  // Get plan by tier
  async getPlanByTier(tier: MembershipTier) {
    const plan = await this.prisma.membershipPlan.findUnique({
      where: { tier },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with tier ${tier} not found`);
    }

    return plan;
  }

  // Get tutor's current subscription
  async getTutorSubscription(tutorId: string) {
    const subscription = await this.prisma.tutorSubscription.findFirst({
      where: {
        tutorId,
        status: MembershipStatus.active,
        endDate: { gte: new Date() },
      },
      include: {
        plan: true,
      },
      orderBy: { endDate: 'desc' },
    });

    // If no active subscription, return basic plan
    if (!subscription) {
      const basicPlan = await this.getPlanByTier(MembershipTier.BASIC);
      return {
        plan: basicPlan,
        status: MembershipStatus.active,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        isBasic: true,
      };
    }

    return subscription;
  }

  // Check if tutor can create more classes
  async canCreateClass(tutorId: string): Promise<{ allowed: boolean; currentCount: number; maxClasses: number; plan: string }> {
    const subscription = await this.getTutorSubscription(tutorId);
    const maxClasses = subscription.plan.maxClasses;

    // Count current active subjects for this tutor
    const currentCount = await this.prisma.tutorSubject.count({
      where: {
        tutorId,
        isActive: true,
      },
    });

    return {
      allowed: currentCount < maxClasses,
      currentCount,
      maxClasses,
      plan: subscription.plan.name,
    };
  }

  // Upgrade tutor subscription
  async upgradeMembership(tutorId: string, planId: string, paymentId?: string) {
    const plan = await this.prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    if (plan.tier === MembershipTier.BASIC) {
      throw new BadRequestException('Cannot upgrade to basic plan');
    }

    // Check if tutor exists
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    // Expire current active subscriptions
    await this.prisma.tutorSubscription.updateMany({
      where: {
        tutorId,
        status: MembershipStatus.active,
      },
      data: {
        status: MembershipStatus.expired,
      },
    });

    // Create new subscription
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);

    const subscription = await this.prisma.tutorSubscription.create({
      data: {
        tutorId,
        planId,
        status: MembershipStatus.active,
        startDate,
        endDate,
        paymentId,
        autoRenew: false,
      },
      include: {
        plan: true,
      },
    });

    return subscription;
  }

  // Cancel subscription
  async cancelSubscription(tutorId: string, subscriptionId: string) {
    const subscription = await this.prisma.tutorSubscription.findFirst({
      where: {
        id: subscriptionId,
        tutorId,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.prisma.tutorSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: MembershipStatus.cancelled,
        autoRenew: false,
      },
    });
  }

  // Admin: Get all subscriptions with filters
  async getAllSubscriptions(page = 1, limit = 20, status?: MembershipStatus, tier?: MembershipTier) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (tier) where.plan = { tier };

    const [subscriptions, total] = await Promise.all([
      this.prisma.tutorSubscription.findMany({
        where,
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  fullName: true,
                  email: true,
                },
              },
            },
          },
          plan: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.tutorSubscription.count({ where }),
    ]);

    return {
      data: subscriptions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Admin: Get membership statistics
  async getMembershipStats() {
    const [totalSubscriptions, activeSubscriptions, planCounts] = await Promise.all([
      this.prisma.tutorSubscription.count(),
      this.prisma.tutorSubscription.count({
        where: {
          status: MembershipStatus.active,
          endDate: { gte: new Date() },
        },
      }),
      this.prisma.tutorSubscription.groupBy({
        by: ['planId'],
        where: {
          status: MembershipStatus.active,
        },
        _count: true,
      }),
    ]);

    // Get plan details for counts
    const plans = await this.prisma.membershipPlan.findMany();
    const planStats = plans.map(plan => {
      const count = planCounts.find(pc => pc.planId === plan.id)?._count || 0;
      return {
        tier: plan.tier,
        name: plan.name,
        activeCount: count,
      };
    });

    // Count tutors with no paid subscription (basic)
    const totalTutors = await this.prisma.tutorProfile.count();
    const tutorsWithPaidSub = planCounts.reduce((sum, pc) => sum + pc._count, 0);
    const basicCount = totalTutors - tutorsWithPaidSub;

    planStats.unshift({
      tier: MembershipTier.BASIC,
      name: 'Basic (Free)',
      activeCount: basicCount,
    });

    return {
      totalSubscriptions,
      activeSubscriptions,
      totalTutors,
      planStats,
    };
  }

  // Admin: Update plan configuration
  async updatePlan(planId: string, data: any) {
    return this.prisma.membershipPlan.update({
      where: { id: planId },
      data,
    });
  }

  // Admin: Toggle plan active status
  async togglePlanStatus(planId: string) {
    const plan = await this.prisma.membershipPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return this.prisma.membershipPlan.update({
      where: { id: planId },
      data: { isActive: !plan.isActive },
    });
  }
}
