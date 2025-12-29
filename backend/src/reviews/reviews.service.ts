import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto, QueryReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(studentId: string, dto: CreateReviewDto) {
    // Verify booking exists and belongs to student
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        tutor: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.studentId !== studentId) {
      throw new ForbiddenException('You can only review your own bookings');
    }

    // Can only review completed bookings
    if (booking.status !== 'completed') {
      throw new BadRequestException('Can only review completed bookings');
    }

    // Check if review already exists
    const existingReview = await this.prisma.review.findUnique({
      where: { bookingId: dto.bookingId },
    });

    if (existingReview) {
      throw new BadRequestException('Review already exists for this booking');
    }

    // Create review
    const review = await this.prisma.review.create({
      data: {
        bookingId: dto.bookingId,
        authorUserId: studentId,
        tutorId: booking.tutorId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        booking: {
          include: {
            tutorSubject: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    });

    // Update tutor's average rating
    await this.updateTutorRating(booking.tutorId);

    return review;
  }

  async updateReview(studentId: string, reviewId: string, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        booking: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.authorUserId !== studentId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        booking: {
          include: {
            tutorSubject: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    });

    // Update tutor's average rating
    await this.updateTutorRating(review.tutorId);

    return updated;
  }

  async deleteReview(studentId: string, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.authorUserId !== studentId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    // Update tutor's average rating
    await this.updateTutorRating(review.tutorId);

    return { message: 'Review deleted successfully' };
  }

  async getReviewById(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
        booking: {
          include: {
            tutorSubject: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async getTutorReviews(tutorId: string, dto: QueryReviewDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    // Verify tutor exists
    const tutor = await this.prisma.tutorProfile.findUnique({
      where: { id: tutorId },
    });

    if (!tutor) {
      throw new NotFoundException('Tutor not found');
    }

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { tutorId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          booking: {
            include: {
              tutorSubject: {
              include: {
                subject: true,
              },
            },
            },
          },
        },
      }),
      this.prisma.review.count({ where: { tutorId } }),
    ]);

    // Calculate rating distribution
    const ratingDistribution = await this.prisma.review.groupBy({
      by: ['rating'],
      where: { tutorId },
      _count: {
        rating: true,
      },
    });

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    ratingDistribution.forEach((item) => {
      distribution[item.rating] = item._count.rating;
    });

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        averageRating: tutor.ratingAvg,
        ratingDistribution: distribution,
      },
    };
  }

  async getMyReviews(studentId: string, dto: QueryReviewDto) {
    const page = dto.page || 1;
    const limit = dto.limit || 20;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { authorUserId: studentId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          tutor: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  avatarUrl: true,
                },
              },
            },
          },
          booking: {
            include: {
              tutorSubject: {
              include: {
                subject: true,
              },
            },
            },
          },
        },
      }),
      this.prisma.review.count({ where: { authorUserId: studentId } }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private async updateTutorRating(tutorId: string) {
    const result = await this.prisma.review.aggregate({
      where: { tutorId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    });

    await this.prisma.tutorProfile.update({
      where: { id: tutorId },
      data: {
        ratingAvg: result._avg.rating || 0,
        ratingCount: result._count.rating,
      },
    });
  }
}
