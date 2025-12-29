import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto, CancelBookingDto, QueryBookingDto } from './dto';
import { BookingStatus, CancelledBy } from '@prisma/client';

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

    if (!tutor.isVerified) {
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
    const durationMinutes = dto.duration * 60;
    const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1000);

    // Check for conflicting bookings
    const conflictingBooking = await this.checkConflictingBookings(
      dto.tutorId,
      startAt,
      durationMinutes,
    );

    if (conflictingBooking) {
      throw new BadRequestException('Tutor already has a booking at this time');
    }

    // Calculate total amount
    const hourlyRateNum = Number(tutor.hourlyRate);
    const price = hourlyRateNum * dto.duration;
    const platformFee = price * 0.1;
    const totalAmount = price + platformFee;

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        studentId,
        tutorId: dto.tutorId,
        tutorSubjectId: tutorSubject.id,
        startAt,
        endAt,
        durationMinutes,
        price,
        platformFee,
        totalAmount,
        status: BookingStatus.pending_payment,
        notes: dto.notes,
        locationAddress: dto.location,
        locationType: dto.teachingMethod === 'online' ? 'online' : 'student_place',
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
        tutorSubject: {
          include: {
            subject: true,
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

    // Can only update draft or pending_payment bookings
    if (booking.status !== BookingStatus.draft && booking.status !== BookingStatus.pending_payment) {
      throw new BadRequestException('Can only update draft or pending bookings');
    }

    // If updating scheduled time, check for conflicts
    let startAt = booking.startAt;
    let endAt = booking.endAt;
    
    if (dto.scheduledAt) {
      startAt = new Date(dto.scheduledAt);
      
      if (startAt <= new Date()) {
        throw new BadRequestException('Scheduled time must be in the future');
      }

      endAt = new Date(startAt.getTime() + booking.durationMinutes * 60 * 1000);

      const conflictingBooking = await this.checkConflictingBookings(
        booking.tutorId,
        startAt,
        booking.durationMinutes,
        bookingId,
      );

      if (conflictingBooking) {
        throw new BadRequestException('Tutor already has a booking at this time');
      }
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        startAt: dto.scheduledAt ? startAt : undefined,
        endAt: dto.scheduledAt ? endAt : undefined,
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
        tutorSubject: {
          include: {
            subject: true,
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

    // Can only cancel pending_payment or confirmed bookings
    if (booking.status !== BookingStatus.pending_payment && booking.status !== BookingStatus.confirmed) {
      throw new BadRequestException('Cannot cancel this booking');
    }

    // Check cancellation policy (24 hours before)
    const hoursUntilBooking = (booking.startAt.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    const isLateCancel = hoursUntilBooking < 24;

    // Determine who cancelled
    let cancelledBy: CancelledBy = 'student';
    if (booking.tutor.userId === userId) {
      cancelledBy = 'tutor';
    }

    const cancelled = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.cancelled,
        cancelReason: dto.cancellationReason,
        cancelledBy,
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
        tutorSubject: {
          include: {
            subject: true,
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

    if (booking.status !== BookingStatus.pending_payment) {
      throw new BadRequestException('Can only confirm pending payment bookings');
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
        tutorSubject: {
          include: {
            subject: true,
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

    if (booking.status !== BookingStatus.confirmed) {
      throw new BadRequestException('Can only complete confirmed bookings');
    }

    const completed = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.completed,
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
        tutorSubject: {
          include: {
            subject: true,
          },
        },
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
        tutorSubject: {
          include: {
            subject: true,
          },
        },
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
          tutorSubject: {
            include: {
              subject: true,
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
    startAt: Date,
    durationMinutes: number,
    excludeBookingId?: string,
  ): Promise<boolean> {
    const endAt = new Date(startAt.getTime() + durationMinutes * 60 * 1000);

    const conflicting = await this.prisma.booking.findFirst({
      where: {
        tutorId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: {
          in: [BookingStatus.pending_payment, BookingStatus.confirmed],
        },
        OR: [
          {
            AND: [
              { startAt: { lt: endAt } },
              { endAt: { gt: startAt } },
            ],
          },
        ],
      },
    });

    return !!conflicting;
  }
}
