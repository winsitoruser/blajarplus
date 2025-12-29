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
    return this.prisma.searchHistory.create({
      data: {
        userId,
        query: searchData.query,
        subject: searchData.subject,
        level: searchData.level,
        location: searchData.location,
        resultCount: searchData.resultCount || 0,
      },
    });
  }

  async getSearchHistory(userId: string, limit: number = 10) {
    return this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        query: true,
        subject: true,
        level: true,
        location: true,
        resultCount: true,
        createdAt: true,
      },
    });
  }

  async deleteSearchHistory(userId: string, historyId: string) {
    return this.prisma.searchHistory.delete({
      where: {
        id: historyId,
        userId, // Ensure user can only delete their own history
      },
    });
  }

  async clearAllSearchHistory(userId: string) {
    return this.prisma.searchHistory.deleteMany({
      where: { userId },
    });
  }

  async getRecommendations(userId: string) {
    // Get user's search history to understand preferences
    const searchHistory = await this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        subject: true,
        level: true,
        location: true,
      },
    });

    // Extract most searched subjects and levels
    const subjectCounts: Record<string, number> = {};
    const levelCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};

    searchHistory.forEach(search => {
      if (search.subject) {
        subjectCounts[search.subject] = (subjectCounts[search.subject] || 0) + 1;
      }
      if (search.level) {
        levelCounts[search.level] = (levelCounts[search.level] || 0) + 1;
      }
      if (search.location) {
        locationCounts[search.location] = (locationCounts[search.location] || 0) + 1;
      }
    });

    // Get top preferences
    const topSubjects = Object.entries(subjectCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([subject]) => subject);

    const topLevels = Object.entries(levelCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 2)
      .map(([level]) => level);

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
    // Get most common search queries
    const searches = await this.prisma.searchHistory.groupBy({
      by: ['query'],
      _count: {
        query: true,
      },
      orderBy: {
        _count: {
          query: 'desc',
        },
      },
      take: limit,
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    return searches.map(s => ({
      query: s.query,
      count: s._count.query,
    }));
  }
}
