import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GamificationService {
  constructor(private prisma: PrismaService) {}

  // XP calculation based on lesson duration and rating
  calculateXP(duration: number, rating?: number): number {
    const baseXP = Math.floor(duration * 50); // 50 XP per hour
    const ratingBonus = rating ? (rating - 3) * 10 : 0; // Bonus for 4-5 star ratings
    return Math.max(baseXP + ratingBonus, 25); // Minimum 25 XP
  }

  // Calculate level from total XP
  calculateLevel(totalXP: number): number {
    // Level formula: level = floor(sqrt(totalXP / 100))
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
  }

  // Calculate rank based on level
  calculateRank(level: number): string {
    if (level >= 50) return 'Diamond';
    if (level >= 30) return 'Platinum';
    if (level >= 20) return 'Gold';
    if (level >= 10) return 'Silver';
    return 'Bronze';
  }

  // Get or create user progress
  async getUserProgress(userId: string) {
    let progress = await this.prisma.userProgress.findUnique({
      where: { userId },
    });

    if (!progress) {
      progress = await this.prisma.userProgress.create({
        data: {
          userId,
          totalXP: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
          totalLessons: 0,
          hoursLearned: 0,
          rank: 'Bronze',
        },
      });
    }

    return progress;
  }

  // Update user progress after completing a lesson
  async updateProgress(userId: string, bookingId: string, duration: number, rating?: number) {
    const xpEarned = this.calculateXP(duration, rating);
    
    // Get current progress
    const progress = await this.getUserProgress(userId);
    
    // Calculate new values
    const newTotalXP = progress.totalXP + xpEarned;
    const newLevel = this.calculateLevel(newTotalXP);
    const newRank = this.calculateRank(newLevel);
    const newTotalLessons = progress.totalLessons + 1;
    const newHoursLearned = Number(progress.hoursLearned) + duration;

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let newCurrentStreak = progress.currentStreak;
    let newLongestStreak = progress.longestStreak;

    if (progress.lastLessonDate) {
      const lastDate = new Date(progress.lastLessonDate);
      lastDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Same day, no change to streak
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        newCurrentStreak += 1;
        newLongestStreak = Math.max(newLongestStreak, newCurrentStreak);
      } else {
        // Streak broken
        newCurrentStreak = 1;
      }
    } else {
      newCurrentStreak = 1;
      newLongestStreak = 1;
    }

    // Update progress
    const updatedProgress = await this.prisma.userProgress.update({
      where: { userId },
      data: {
        totalXP: newTotalXP,
        level: newLevel,
        rank: newRank,
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        totalLessons: newTotalLessons,
        hoursLearned: newHoursLearned,
        lastLessonDate: new Date(),
      },
    });

    // Get booking details for learning history
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
        subject: true,
      },
    });

    // Create learning history entry
    await this.prisma.learningHistory.create({
      data: {
        userId,
        bookingId,
        subject: booking.subject.name,
        tutorName: booking.tutor.user.fullName,
        duration,
        rating,
        xpEarned,
        notes: '',
      },
    });

    // Check and unlock achievements
    await this.checkAchievements(userId, updatedProgress);

    return {
      progress: updatedProgress,
      xpEarned,
      levelUp: newLevel > progress.level,
      newLevel,
    };
  }

  // Check and unlock achievements
  async checkAchievements(userId: string, progress: any) {
    const achievements = await this.prisma.achievement.findMany({
      where: { isActive: true },
    });

    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    const unlockedCodes = new Set(
      userAchievements
        .filter(ua => ua.progress >= ua.achievement.requirement)
        .map(ua => ua.achievement.code)
    );

    const newlyUnlocked = [];

    for (const achievement of achievements) {
      if (unlockedCodes.has(achievement.code)) continue;

      let currentProgress = 0;
      let shouldUnlock = false;

      switch (achievement.code) {
        case 'first_lesson':
          currentProgress = progress.totalLessons;
          shouldUnlock = progress.totalLessons >= 1;
          break;
        case 'week_warrior':
          currentProgress = progress.currentStreak;
          shouldUnlock = progress.currentStreak >= 7;
          break;
        case 'knowledge_seeker':
          currentProgress = progress.totalLessons;
          shouldUnlock = progress.totalLessons >= 10;
          break;
        case 'dedicated':
          currentProgress = progress.totalLessons;
          shouldUnlock = progress.totalLessons >= 20;
          break;
        case 'scholar':
          currentProgress = progress.totalLessons;
          shouldUnlock = progress.totalLessons >= 50;
          break;
        case 'marathon':
          currentProgress = Math.floor(Number(progress.hoursLearned));
          shouldUnlock = Number(progress.hoursLearned) >= 3;
          break;
        case 'master':
          currentProgress = progress.level;
          shouldUnlock = progress.level >= 20;
          break;
        case 'unstoppable':
          currentProgress = progress.currentStreak;
          shouldUnlock = progress.currentStreak >= 30;
          break;
      }

      // Update or create user achievement
      const existingUA = userAchievements.find(ua => ua.achievement.code === achievement.code);
      
      if (existingUA) {
        await this.prisma.userAchievement.update({
          where: { id: existingUA.id },
          data: { progress: currentProgress },
        });
      } else {
        await this.prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            progress: currentProgress,
          },
        });
      }

      if (shouldUnlock && !existingUA) {
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  }

  // Get user achievements
  async getUserAchievements(userId: string) {
    const achievements = await this.prisma.achievement.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    const userAchievements = await this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    const progress = await this.getUserProgress(userId);

    return achievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
      
      let currentProgress = 0;
      let unlocked = false;

      if (userAchievement) {
        currentProgress = userAchievement.progress;
        unlocked = currentProgress >= achievement.requirement;
      }

      return {
        id: achievement.id,
        code: achievement.code,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        requirement: achievement.requirement,
        xpReward: achievement.xpReward,
        progress: currentProgress,
        unlocked,
        unlockedAt: unlocked ? userAchievement.unlockedAt : null,
      };
    });
  }

  // Get learning history
  async getLearningHistory(userId: string, limit = 10) {
    return this.prisma.learningHistory.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      take: limit,
    });
  }

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    return this.prisma.userProgress.findMany({
      take: limit,
      orderBy: [
        { totalXP: 'desc' },
        { level: 'desc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }
}
