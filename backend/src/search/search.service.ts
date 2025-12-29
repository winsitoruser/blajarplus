import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async saveSearchHistory(userId: string, searchData: {
    query: string;
    subject?: string;
    level?: string;
    location?: string;
    resultCount?: number;
  }) {
    // TODO: Implement when SearchHistory model is added to Prisma schema
    return null;
  }

  async getSearchHistory(userId: string, limit: number = 10) {
    // TODO: Implement when SearchHistory model is added to Prisma schema
    return [];
  }

  async deleteSearchHistory(userId: string, historyId: string) {
    // TODO: Implement when SearchHistory model is added to Prisma schema
    return null;
  }

  async clearAllSearchHistory(userId: string) {
    // TODO: Implement when SearchHistory model is added to Prisma schema
    return { count: 0 };
  }

  async getRecommendations(userId: string) {
    // Simplified recommendations without search history
    const topSubjects: string[] = [];
    const topLevels: string[] = [];

    // Get recommended tutors based on preferences
    const recommendedTutors = await this.prisma.tutorProfile.findMany({
      where: {
        subjects: {
          some: {
            OR: topSubjects.length > 0 
              ? topSubjects.map(subject => ({
                  subject: { name: { contains: subject, mode: 'insensitive' } }
                }))
              : undefined,
          },
        },
        user: {
          status: 'active',
        },
      },
      take: 6,
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
            subject: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Calculate average ratings
    const tutorsWithRatings = recommendedTutors.map(tutor => {
      const ratings = tutor.reviews.map(r => r.rating);
      const avgRating = ratings.length > 0 
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
        : 0;
      
      return {
        id: tutor.id,
        userId: tutor.user.id,
        fullName: tutor.user.fullName,
        avatarUrl: tutor.user.avatarUrl,
        bio: tutor.bio,
        hourlyRate: tutor.hourlyRate,
        subjects: tutor.subjects.map(s => s.subject.name),
        rating: avgRating,
        reviewCount: tutor.reviews.length,
      };
    });

    return {
      preferences: {
        subjects: topSubjects,
        levels: topLevels,
      },
      tutors: tutorsWithRatings,
    };
  }

  async getPopularSearches(limit: number = 5) {
    // TODO: Implement when SearchHistory model is added to Prisma schema
    return [];
  }
}
