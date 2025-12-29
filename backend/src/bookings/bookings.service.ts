import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto, CancelBookingDto, QueryBookingDto } from './dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createBooking(studentId: string, dto: CreateBookingDto) {
    // Verify tutor exists and is verified
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: dto.tutorId },
      include: { user: true },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    if (tutor.verificationStatus !== 'verified') {
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
    const scheduledAt = new Date(dto.scheduledAt);
    if (scheduledAt <= new Date()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    // Check for conflicting bookings
    const conflictingBooking = await this.checkConflictingBookings(
      dto.tutorId,
      scheduledAt,
      dto.duration,
    );

    if (conflictingBooking) {
      throw new BadRequestException('Tutor already has a booking at this time');
    }

    // Calculate total amount
    const numberOfSessions = dto.numberOfSessions || 1;
    const totalAmount = tutor.hourlyRate * dto.duration * numberOfSessions;

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        studentId,
        tutorId: dto.tutorId,
        subjectId: dto.subjectId,
        scheduledAt,
        duration: dto.duration,
        bookingType: dto.bookingType,
        numberOfSessions,
        completedSessions: 0,
        totalAmount,
        status: BookingStatus.pending,
        notes: dto.notes,
        location: dto.location,
        teachingMethod: dto.teachingMethod,
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
        subject: true,
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
    if (booking.status !== BookingStatus.pending) {
      throw new BadRequestException('Can only update pending bookings');
    }

    // If updating scheduled time, check for conflicts
    if (dto.scheduledAt) {
      const newScheduledAt = new Date(dto.scheduledAt);
      
      if (newScheduledAt <= new Date()) {
        throw new BadRequestException('Scheduled time must be in the future');
      }

      const conflictingBooking = await this.checkConflictingBookings(
        booking.tutorId,
        newScheduledAt,
        booking.duration,
        bookingId,
      );

      if (conflictingBooking) {
        throw new BadRequestException('Tutor already has a booking at this time');
      }
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
        notes: dto.notes,
        location: dto.location,
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
        subject: true,
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
    if (![BookingStatus.pending, BookingStatus.confirmed].includes(booking.status)) {
      throw new BadRequestException('Cannot cancel this booking');
    }

    // Check cancellation policy (24 hours before)
    const hoursUntilBooking = (booking.scheduledAt.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    const isLateCancel = hoursUntilBooking < 24;

    const cancelled = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.cancelled,
        cancellationReason: dto.cancellationReason,
        cancelledAt: new Date(),
        cancelledBy: userId,
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
        subject: true,
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

    if (booking.status !== BookingStatus.pending) {
      throw new BadRequestException('Can only confirm pending bookings');
    }

    const confirmed = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.confirmed,
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
        subject: true,
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

    if (booking.status !== BookingStatus.confirmed) {
      throw new BadRequestException('Can only complete confirmed bookings');
    }

    const completed = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.completed,
        completedSessions: booking.completedSessions + 1,
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
        subject: true,
      },
    });

    // Update tutor stats
    await this.prisma.tutorProfile.update({
      where: { id: booking.tutorId },
      data: {
        totalStudents: { increment: 1 },
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
        subject: true,
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check access rights
    if (booking.studentId !== userId && booking.tutor.userId !== userId) {
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
        orderBy: { scheduledAt: 'desc' },
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
          subject: true,
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
          in: [BookingStatus.pending, BookingStatus.confirmed],
        },
        OR: [
          {
            AND: [
              { scheduledAt: { lte: scheduledAt } },
              {
                scheduledAt: {
                  gte: new Date(scheduledAt.getTime() - duration * 60 * 60 * 1000),
                },
              },
            ],
          },
          {
            AND: [
              { scheduledAt: { gte: scheduledAt } },
              { scheduledAt: { lt: endTime } },
            ],
          },
        ],
      },
    });

    return !!conflicting;
  }
}
