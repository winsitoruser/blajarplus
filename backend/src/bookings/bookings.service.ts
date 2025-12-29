import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto, CancelBookingDto, QueryBookingDto } from './dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  private generateBookingNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `BKG-${year}-${random}`;
  }

  async createBooking(studentId: string, dto: CreateBookingDto) {
    // Verify tutor exists and is verified
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: dto.tutorId },
      include: { user: true },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    if (tutor.verificationStatus !== 'approved') {
      throw new BadRequestException('Tutor is not verified yet');
    }

    // Verify subject exists
    const subject = await this.prisma.subject.findUnique({
      where: { id: dto.subjectId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    // Check if tutor teaches this subject
    const tutorSubject = await this.prisma.tutorSubject.findFirst({
      where: {
        tutorId: dto.tutorId,
        subjectId: dto.subjectId,
      },
    });

    if (!tutorSubject) {
      throw new BadRequestException('Tutor does not teach this subject');
    }

    // Check if scheduled time is in the future
    const startAt = new Date(dto.scheduledAt);
    if (startAt <= new Date()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    // Calculate end time
    const endAt = new Date(startAt.getTime() + dto.duration * 60 * 60 * 1000);

    // Check for conflicting bookings
    const conflictingBooking = await this.checkConflictingBookings(
      dto.tutorId,
      startAt,
      dto.duration,
    );

    if (conflictingBooking) {
      throw new BadRequestException('Tutor already has a booking at this time');
    }

    // Calculate total amount
    const numberOfSessions = dto.numberOfSessions || 1;
    const durationMinutes = dto.duration * 60;
    const totalAmount = Number(tutor.hourlyRate) * dto.duration * numberOfSessions;

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        student: { connect: { id: studentId } },
        tutor: { connect: { id: dto.tutorId } },
        tutorSubject: tutorSubject ? { connect: { id: tutorSubject.id } } : undefined,
        startAt,
        endAt,
        durationMinutes,
        price: tutor.hourlyRate,
        platformFee: totalAmount * 0.1,
        totalAmount,
        status: 'pending_payment',
        notes: dto.notes,
        locationAddress: dto.location,
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        tutor: {
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
        },
      },
    });

    return booking;
  }

  async updateBooking(userId: string, bookingId: string, dto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only student who created the booking can update it
    if (booking.studentId !== userId) {
      throw new ForbiddenException('You can only update your own bookings');
    }

    // Can only update pending bookings
    if (booking.status !== 'pending_payment') {
      throw new BadRequestException('Can only update pending bookings');
    }

    // If updating scheduled time, check for conflicts
    if (dto.scheduledAt) {
      const newStartAt = new Date(dto.scheduledAt);
      
      if (newStartAt <= new Date()) {
        throw new BadRequestException('Scheduled time must be in the future');
      }

      const conflictingBooking = await this.checkConflictingBookings(
        booking.tutorId,
        newStartAt,
        booking.durationMinutes / 60,
        bookingId,
      );

      if (conflictingBooking) {
        throw new BadRequestException('Tutor already has a booking at this time');
      }
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        startAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        endAt: dto.scheduledAt ? new Date(new Date(dto.scheduledAt).getTime() + booking.durationMinutes * 60 * 1000) : undefined,
        notes: dto.notes,
        locationAddress: dto.location,
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        tutor: {
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
        },
      },
    });

    return updated;
  }

  async cancelBooking(userId: string, bookingId: string, dto: CancelBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        tutor: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Both student and tutor can cancel
    if (booking.studentId !== userId && booking.tutor.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }

    // Can only cancel pending or confirmed bookings
    if (!['pending_payment', 'confirmed'].includes(booking.status)) {
      throw new BadRequestException('Cannot cancel this booking');
    }

    // Check cancellation policy (24 hours before)
    const hoursUntilBooking = (booking.startAt.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    const isLateCancel = hoursUntilBooking < 24;

    // Determine who cancelled
    const cancelledBy = booking.studentId === userId ? 'student' : 'tutor';

    const cancelled = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'cancelled',
        cancelReason: dto.cancellationReason,
        cancelledBy: cancelledBy as any,
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        tutor: {
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
        },
      },
    });

    return {
      ...cancelled,
      isLateCancel,
      refundEligible: !isLateCancel,
    };
  }

  async confirmBooking(tutorUserId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        tutor: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only tutor can confirm
    if (booking.tutor.userId !== tutorUserId) {
      throw new ForbiddenException('Only the tutor can confirm this booking');
    }

    if (booking.status !== 'pending_payment') {
      throw new BadRequestException('Can only confirm pending bookings');
    }

    const confirmed = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'confirmed',
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        tutor: {
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
        },
      },
    });

    return confirmed;
  }

  async completeBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        tutor: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Both student and tutor can mark as completed
    if (booking.studentId !== userId && booking.tutor.userId !== userId) {
      throw new ForbiddenException('Only student or tutor can complete this booking');
    }

    if (booking.status !== 'confirmed') {
      throw new BadRequestException('Can only complete confirmed bookings');
    }

    const completed = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        tutor: {
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
        },
      },
    });

    // Update tutor stats
    await this.prisma.tutorProfile.update({
      where: { id: booking.tutorId },
      data: {
        completedLessonsCount: { increment: 1 },
      },
    });

    return completed;
  }

  async getBookingById(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
          },
        },
        tutor: {
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
        },
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check access rights - need to fetch tutor relation
    const bookingWithTutor = booking as any;
    if (booking.studentId !== userId && bookingWithTutor.tutor?.userId !== userId) {
      throw new ForbiddenException('You can only view your own bookings');
    }

    return booking;
  }

  async getMyBookings(userId: string, dto: QueryBookingDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      OR: [
        { studentId: userId },
        { tutor: { userId } },
      ],
    };

    if (dto.status) {
      where.status = dto.status;
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        orderBy: { startAt: 'desc' },
        skip,
        take: limit,
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
          tutor: {
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
          },
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async checkConflictingBookings(
    tutorId: string,
    scheduledAt: Date,
    duration: number,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const endTime = new Date(scheduledAt.getTime() + duration * 60 * 60 * 1000);

    const conflicting = await this.prisma.booking.findFirst({
      where: {
        tutorId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: {
          in: ['pending_payment', 'confirmed'],
        },
        OR: [
          {
            AND: [
              { startAt: { lte: scheduledAt } },
              {
                startAt: {
                  gte: new Date(scheduledAt.getTime() - duration * 60 * 60 * 1000),
                },
              },
            ],
          },
          {
            AND: [
              { startAt: { gte: scheduledAt } },
              { startAt: { lt: endTime } },
            ],
          },
        ],
      },
    });

    return !!conflicting;
  }
}
