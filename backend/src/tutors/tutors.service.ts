import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTutorProfileDto, UpdateTutorProfileDto, SearchTutorDto, SortBy } from './dto';

@Injectable()
export class TutorsService {
  constructor(private prisma: PrismaService) {}

  async createProfile(userId: string, dto: CreateTutorProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { tutorProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== 'tutor') {
      throw new BadRequestException('Only users with tutor role can create tutor profile');
    }

    if (user.tutorProfile) {
      throw new BadRequestException('Tutor profile already exists');
    }

    // Get subject IDs from subject names
    const subjects = await this.prisma.subject.findMany({
      where: {
        name: { in: dto.subjects },
      },
    });

    if (subjects.length !== dto.subjects.length) {
      throw new BadRequestException('Some subjects not found');
    }

    // Create tutor profile
    const tutorProfile = await this.prisma.tutorProfile.create({
      data: {
        userId,
        bio: dto.bio,
        education: dto.education,
        experienceYears: dto.experienceYears || 0,
        hourlyRate: dto.hourlyRate,
        baseCity: dto.city,
        teachingModes: dto.teachingMethods,
        headline: dto.headline,
        verificationStatus: 'pending',
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Create tutor-subject relationships
    await Promise.all(
      subjects.map((subject) =>
        this.prisma.tutorSubject.create({
          data: {
            tutor: { connect: { id: tutorProfile.id } },
            subject: { connect: { id: subject.id } },
            level: 'general',
          },
        }),
      ),
    );

    return this.getTutorById(tutorProfile.id);
  }

  async updateProfile(userId: string, dto: UpdateTutorProfileDto) {
    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found');
    }

    // Update subjects if provided
    if (dto.subjects) {
      const subjects = await this.prisma.subject.findMany({
        where: {
          name: { in: dto.subjects },
        },
      });

      if (subjects.length !== dto.subjects.length) {
        throw new BadRequestException('Some subjects not found');
      }

      // Delete existing tutor-subject relationships
      await this.prisma.tutorSubject.deleteMany({
        where: { tutorId: tutorProfile.id },
      });

      // Create new relationships
      await Promise.all(
        subjects.map((subject) =>
          this.prisma.tutorSubject.create({
            data: {
              tutor: { connect: { id: tutorProfile.id } },
              subject: { connect: { id: subject.id } },
              level: 'general',
            },
          }),
        ),
      );
    }

    // Update profile
    const updated = await this.prisma.tutorProfile.update({
      where: { id: tutorProfile.id },
      data: {
        bio: dto.bio,
        education: dto.education,
        experienceYears: dto.experienceYears,
        hourlyRate: dto.hourlyRate,
        baseCity: dto.city,
        teachingModes: dto.teachingMethods,
        headline: dto.headline,
      },
    });

    return this.getTutorById(updated.id);
  }

  async getTutorById(tutorId: string) {
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
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
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            author: {
              select: {
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    // Map subjects relation to subject objects
    const tutorWithSubjects = tutor as any;
    const subjects = tutorWithSubjects.subjects?.map((ts: any) => ts.subject) || [];

    return {
      ...tutor,
      subjects,
    };
  }

  async getMyProfile(userId: string) {
    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
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

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found');
    }

    // Map subjects relation to subject objects
    const profileWithSubjects = tutorProfile as any;
    const subjects = profileWithSubjects.subjects?.map((ts: any) => ts.subject) || [];

    return {
      ...tutorProfile,
      subjects,
    };
  }

  async searchTutors(dto: SearchTutorDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      verificationStatus: 'verified',
    };

    if (dto.subject) {
      where.subjects = {
        some: {
          subject: {
            name: { contains: dto.subject, mode: 'insensitive' },
          },
        },
      };
    }

    if (dto.educationLevel) {
      where.educationLevels = {
        has: dto.educationLevel,
      };
    }

    if (dto.city) {
      where.city = { contains: dto.city, mode: 'insensitive' };
    }

    if (dto.teachingMethod) {
      where.teachingMethods = {
        has: dto.teachingMethod,
      };
    }

    if (dto.minPrice || dto.maxPrice) {
      where.hourlyRate = {};
      if (dto.minPrice) where.hourlyRate.gte = dto.minPrice;
      if (dto.maxPrice) where.hourlyRate.lte = dto.maxPrice;
    }

    if (dto.minRating) {
      where.ratingAvg = { gte: dto.minRating };
    }

    // Full-text search
    if (dto.q) {
      where.OR = [
        { bio: { contains: dto.q, mode: 'insensitive' } },
        { education: { contains: dto.q, mode: 'insensitive' } },
        { experience: { contains: dto.q, mode: 'insensitive' } },
        {
          user: {
            fullName: { contains: dto.q, mode: 'insensitive' },
          },
        },
      ];
    }

    // Build orderBy
    let orderBy: any = { ratingAvg: 'desc' };

    switch (dto.sortBy) {
      case SortBy.PRICE_LOW:
        orderBy = { hourlyRate: 'asc' };
        break;
      case SortBy.PRICE_HIGH:
        orderBy = { hourlyRate: 'desc' };
        break;
      case SortBy.NEWEST:
        orderBy = { createdAt: 'desc' };
        break;
      case SortBy.EXPERIENCE:
        orderBy = { completedLessonsCount: 'desc' };
        break;
      default:
        orderBy = { ratingAvg: 'desc' };
    }

    // Execute query
    const [tutors, total] = await Promise.all([
      this.prisma.tutorProfile.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
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
      }),
      this.prisma.tutorProfile.count({ where }),
    ]);

    return {
      data: tutors.map((tutor) => ({
        ...tutor,
        subjects: tutor.subjects.map((ts) => ts.subject),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllSubjects() {
    return this.prisma.subject.findMany({
      include: {
        category: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getSubjectCategories() {
    return this.prisma.subjectCategory.findMany({
      include: {
        subjects: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async getMyEarnings(userId: string) {
    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found');
    }

    // Get all bookings for this tutor
    const bookings = await this.prisma.booking.findMany({
      where: {
        tutorId: tutorProfile.id,
      },
      include: {
        payment: true,
      },
    });

    // Calculate earnings
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
    
    const totalEarnings = completedBookings.reduce((sum, booking) => {
      return sum + Number(booking.totalAmount);
    }, 0);

    const pendingEarnings = confirmedBookings.reduce((sum, booking) => {
      return sum + Number(booking.totalAmount);
    }, 0);

    // Platform takes 15% commission
    const platformCommission = totalEarnings * 0.15;
    const netEarnings = totalEarnings * 0.85;
    const availableForWithdrawal = netEarnings;

    // Monthly earnings (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyBookings = await this.prisma.booking.findMany({
      where: {
        tutorId: tutorProfile.id,
        status: 'completed',
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group by month
    const monthlyEarningsMap = new Map<string, number>();
    monthlyBookings.forEach(booking => {
      const monthKey = booking.createdAt.toISOString().slice(0, 7); // YYYY-MM
      const current = monthlyEarningsMap.get(monthKey) || 0;
      monthlyEarningsMap.set(monthKey, current + Number(booking.totalAmount));
    });

    const monthlyEarnings = Array.from(monthlyEarningsMap.entries())
      .map(([month, amount]) => ({
        month: new Date(month + '-01').toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }),
        amount: Math.round(amount * 0.85), // After commission
      }))
      .slice(0, 6);

    // Recent payments (completed bookings)
    const recentPayments = completedBookings
      .slice(0, 10)
      .map(booking => ({
        id: booking.id,
        amount: Math.round(Number(booking.totalAmount) * 0.85),
        date: booking.createdAt,
        status: 'paid',
      }));

    return {
      totalEarnings: Math.round(totalEarnings),
      pendingEarnings: Math.round(pendingEarnings * 0.85),
      availableForWithdrawal: Math.round(availableForWithdrawal),
      platformCommission: Math.round(platformCommission),
      netEarnings: Math.round(netEarnings),
      completedBookings: completedBookings.length,
      totalStudents: tutorProfile.completedLessonsCount,
      monthlyEarnings,
      recentPayments,
    };
  }
}
