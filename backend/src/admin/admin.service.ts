import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VerifyTutorDto } from './dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getPendingTutors(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [tutors, total] = await Promise.all([
      this.prisma.tutorProfile.findMany({
        where: {
          verificationStatus: 'pending',
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              avatarUrl: true,
              createdAt: true,
            },
          },
          subjects: {
            include: {
              subject: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.tutorProfile.count({
        where: {
          verificationStatus: 'pending',
        },
      }),
    ]);

    return {
      data: tutors.map(tutor => ({
        ...tutor,
        subjects: tutor.subjects.map(ts => ts.subject),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTutorForVerification(tutorId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,
            createdAt: true,
          },
        },
        subjects: {
          include: {
            subject: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    return {
      ...tutor,
      subjects: tutor.subjects.map(ts => ts.subject),
    };
  }

  async verifyTutor(tutorId: string, dto: VerifyTutorDto) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: { user: true },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    if (tutor.verificationStatus !== 'pending') {
      throw new BadRequestException('Tutor is not pending verification');
    }

    const updated = await this.prisma.tutorProfile.update({
      where: { id: tutorId },
      data: {
        verificationStatus: dto.status as any,
        verificationNote: dto.notes,
        isVerified: dto.status === 'verified',
      },
      include: {
        user: true,
      },
    });

    // TODO: Send email notification to tutor
    // await this.emailService.sendVerificationResult(tutor.user.email, dto.status, dto.notes);

    return updated;
  }

  async getPendingWithdrawals(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [withdrawals, total] = await Promise.all([
      this.prisma.withdrawal.findMany({
        where: {
          status: 'pending',
        },
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip,
        take: limit,
      }),
      this.prisma.withdrawal.count({
        where: {
          status: 'pending',
        },
      }),
    ]);

    return {
      data: withdrawals,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async approveWithdrawal(withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    if (withdrawal.status !== 'pending') {
      throw new BadRequestException('Withdrawal is not pending');
    }

    const updated = await this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: 'approved',
        processedAt: new Date(),
      },
    });

    // TODO: Process actual bank transfer
    // await this.paymentService.transferToBank(withdrawal);

    // TODO: Send email notification
    // await this.emailService.sendWithdrawalApproved(withdrawal.tutor.user.email, withdrawal.amount);

    return updated;
  }

  async rejectWithdrawal(withdrawalId: string, reason: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    if (withdrawal.status !== 'pending') {
      throw new BadRequestException('Withdrawal is not pending');
    }

    const updated = await this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: 'rejected',
        rejectionReason: reason,
        processedAt: new Date(),
      },
    });

    // TODO: Send email notification
    // await this.emailService.sendWithdrawalRejected(withdrawal.tutor.user.email, reason);

    return updated;
  }

  async getAdminStats() {
    const [
      totalUsers,
      totalTutors,
      verifiedTutors,
      pendingTutors,
      totalBookings,
      completedBookings,
      totalRevenue,
      pendingWithdrawals,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.tutorProfile.count(),
      this.prisma.tutorProfile.count({ where: { verificationStatus: 'approved' } }),
      this.prisma.tutorProfile.count({ where: { verificationStatus: 'pending' } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: 'completed' } }),
      this.prisma.booking.aggregate({
        where: { status: 'completed' },
        _sum: { totalAmount: true },
      }),
      this.prisma.withdrawal.count({ where: { status: 'pending' } }),
    ]);

    const platformRevenue = Number(totalRevenue._sum.totalAmount || 0) * 0.15;

    return {
      users: {
        total: totalUsers,
        students: totalUsers - totalTutors,
        tutors: totalTutors,
      },
      tutors: {
        total: totalTutors,
        verified: verifiedTutors,
        pending: pendingTutors,
        rejected: totalTutors - verifiedTutors - pendingTutors,
      },
      bookings: {
        total: totalBookings,
        completed: completedBookings,
        active: totalBookings - completedBookings,
      },
      revenue: {
        total: Number(totalRevenue._sum.totalAmount || 0),
        platform: Math.round(platformRevenue),
        tutors: Math.round(Number(totalRevenue._sum.totalAmount || 0) * 0.85),
      },
      withdrawals: {
        pending: pendingWithdrawals,
      },
    };
  }

  // Transaction Monitoring
  async getTransactions(page = 1, limit = 20, filters?: any) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.startDate) {
      where.createdAt = { gte: new Date(filters.startDate) };
    }
    if (filters?.endDate) {
      where.createdAt = { ...where.createdAt, lte: new Date(filters.endDate) };
    }

    const [transactions, total] = await Promise.all([
      this.prisma.paymentTransaction.findMany({
        where,
        include: {
          booking: {
            include: {
              student: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                },
              },
              tutor: {
                include: {
                  user: {
                    select: {
                      id: true,
                      fullName: true,
                      email: true,
                    },
                  },
                },
              },
              tutorSubject: {
                include: {
                  subject: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.paymentTransaction.count({ where }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Student Monitoring
  async getStudents(page = 1, limit = 20, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = { role: 'student' };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [students, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          avatarUrl: true,
          createdAt: true,
          lastLoginAt: true,
          studentBookings: {
            select: {
              id: true,
              status: true,
              totalAmount: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    const studentsWithStats = students.map(student => ({
      ...student,
      stats: {
        totalBookings: student.studentBookings.length,
        completedBookings: student.studentBookings.filter(b => b.status === 'completed').length,
        totalSpent: student.studentBookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + Number(b.totalAmount), 0),
      },
      studentBookings: undefined,
    }));

    return {
      data: studentsWithStats,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Tutor Monitoring
  async getTutors(page = 1, limit = 20, filters?: any) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.status) {
      where.verificationStatus = filters.status;
    }
    if (filters?.search) {
      where.user = {
        OR: [
          { fullName: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
        ],
      };
    }

    const [tutors, total] = await Promise.all([
      this.prisma.tutorProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phone: true,
              avatarUrl: true,
              createdAt: true,
              lastLoginAt: true,
            },
          },
          subjects: {
            include: {
              subject: true,
            },
          },
          bookings: {
            select: {
              id: true,
              status: true,
              totalAmount: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.tutorProfile.count({ where }),
    ]);

    const tutorsWithStats = tutors.map(tutor => ({
      ...tutor,
      subjects: tutor.subjects.map(ts => ts.subject),
      stats: {
        totalBookings: tutor.bookings.length,
        completedBookings: tutor.bookings.filter(b => b.status === 'completed').length,
        totalEarnings: tutor.bookings
          .filter(b => b.status === 'completed')
          .reduce((sum, b) => sum + Number(b.totalAmount), 0),
      },
      bookings: undefined,
    }));

    return {
      data: tutorsWithStats,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Course/Subject Monitoring
  async getSubjects() {
    const subjects = await this.prisma.subject.findMany({
      include: {
        category: true,
        tutorSubjects: {
          include: {
            tutor: {
              include: {
                bookings: {
                  select: {
                    id: true,
                    status: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return subjects.map(subject => ({
      ...subject,
      stats: {
        totalTutors: subject.tutorSubjects.length,
        activeTutors: subject.tutorSubjects.filter(ts => ts.tutor.status === 'active').length,
        totalBookings: subject.tutorSubjects.reduce(
          (sum, ts) => sum + ts.tutor.bookings.length,
          0,
        ),
        completedBookings: subject.tutorSubjects.reduce(
          (sum, ts) => sum + ts.tutor.bookings.filter(b => b.status === 'completed').length,
          0,
        ),
      },
      tutorSubjects: undefined,
    }));
  }

  // Business Activity Monitoring
  async getBusinessActivities(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [bookings, payments, newUsers, newTutors] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          createdAt: true,
          status: true,
          totalAmount: true,
        },
      }),
      this.prisma.paymentTransaction.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          createdAt: true,
          status: true,
          amount: true,
        },
      }),
      this.prisma.user.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          createdAt: true,
          role: true,
        },
      }),
      this.prisma.tutorProfile.findMany({
        where: {
          createdAt: { gte: startDate },
        },
        select: {
          createdAt: true,
          verificationStatus: true,
        },
      }),
    ]);

    // Group by date
    const dailyStats = new Map();
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      dailyStats.set(dateKey, {
        date: dateKey,
        bookings: 0,
        revenue: 0,
        newUsers: 0,
        newTutors: 0,
      });
    }

    bookings.forEach(booking => {
      const dateKey = booking.createdAt.toISOString().split('T')[0];
      if (dailyStats.has(dateKey)) {
        const stats = dailyStats.get(dateKey);
        stats.bookings++;
        if (booking.status === 'completed') {
          stats.revenue += Number(booking.totalAmount);
        }
      }
    });

    newUsers.forEach(user => {
      const dateKey = user.createdAt.toISOString().split('T')[0];
      if (dailyStats.has(dateKey)) {
        dailyStats.get(dateKey).newUsers++;
      }
    });

    newTutors.forEach(tutor => {
      const dateKey = tutor.createdAt.toISOString().split('T')[0];
      if (dailyStats.has(dateKey)) {
        dailyStats.get(dateKey).newTutors++;
      }
    });

    return Array.from(dailyStats.values()).reverse();
  }

  // Recent Activities
  async getRecentActivities(limit = 20) {
    const [recentBookings, recentPayments, recentUsers] = await Promise.all([
      this.prisma.booking.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          student: {
            select: { fullName: true, email: true },
          },
          tutor: {
            include: {
              user: {
                select: { fullName: true },
              },
            },
          },
        },
      }),
      this.prisma.paymentTransaction.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          booking: {
            include: {
              student: {
                select: { fullName: true },
              },
            },
          },
        },
      }),
      this.prisma.user.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    const activities = [
      ...recentBookings.map(b => ({
        type: 'booking',
        action: `New booking created`,
        user: b.student.fullName,
        tutor: b.tutor.user.fullName,
        amount: Number(b.totalAmount),
        status: b.status,
        createdAt: b.createdAt,
      })),
      ...recentPayments.map(p => ({
        type: 'payment',
        action: `Payment ${p.status}`,
        user: p.booking.student.fullName,
        amount: Number(p.amount),
        status: p.status,
        createdAt: p.createdAt,
      })),
      ...recentUsers.map(u => ({
        type: 'user',
        action: `New ${u.role} registered`,
        user: u.fullName,
        email: u.email,
        createdAt: u.createdAt,
      })),
    ];

    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}
