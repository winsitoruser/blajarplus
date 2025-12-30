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
          totalXp: 0,
          xp: 0,
          level: 1,
          streak: 0,
          longestStreak: 0,
          totalSessions: 0,
          totalHours: 0,
          lastActiveDate: new Date(),
        },
      });
    }

    return progress;
  }

  // Update user progress after completing a lesson
  async updateProgress(userId: string, duration: number, activityType: string, description: string) {
    const xpEarned = this.calculateXP(duration);
    
    // Get current progress
    const progress = await this.getUserProgress(userId);
    
    // Calculate new values
    const newTotalXP = progress.totalXp + xpEarned;
    const newLevel = this.calculateLevel(newTotalXP);
    const newTotalSessions = progress.totalSessions + 1;
    const newTotalHours = Number(progress.totalHours) + duration;

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let newStreak = progress.streak;
    let newLongestStreak = progress.longestStreak;

    if (progress.lastActiveDate) {
      const lastDate = new Date(progress.lastActiveDate);
      lastDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Same day, no change to streak
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        newStreak += 1;
        newLongestStreak = Math.max(newLongestStreak, newStreak);
      } else {
        // Streak broken
        newStreak = 1;
      }
    } else {
      newStreak = 1;
      newLongestStreak = 1;
    }

    // Calculate XP for current level
    const currentLevelXP = newTotalXP - (progress.level * progress.level * 100);
    const xpForNextLevel = (newLevel + 1) * (newLevel + 1) * 100 - newLevel * newLevel * 100;

    // Update progress
    const updatedProgress = await this.prisma.userProgress.update({
      where: { userId },
      data: {
        totalXp: newTotalXP,
        xp: currentLevelXP,
        level: newLevel,
        streak: newStreak,
        longestStreak: newLongestStreak,
        totalSessions: newTotalSessions,
        totalHours: newTotalHours,
        lastActiveDate: new Date(),
      },
    });

    // Create learning history entry
    await this.prisma.learningHistory.create({
      data: {
        userId,
        activityType,
        description,
        xpEarned,
        metadata: {
          duration,
        },
      },
    });

    // Check and unlock achievements
    await this.checkAchievements(userId, updatedProgress);

    return {
      progress: updatedProgress,
      xpEarned,
      levelUp: newLevel > progress.level,
      newLevel,
      rank: this.calculateRank(newLevel),
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

    const unlockedIds = new Set(
      userAchievements
        .filter(ua => ua.isCompleted)
        .map(ua => ua.achievementId)
    );

    const newlyUnlocked = [];

    for (const achievement of achievements) {
      if (unlockedIds.has(achievement.id)) continue;

      let currentProgress = 0;
      let shouldUnlock = false;

      // Check achievement requirements based on type
      if (achievement.type === 'milestone') {
        currentProgress = progress.totalSessions;
        shouldUnlock = progress.totalSessions >= achievement.requirement;
      } else if (achievement.type === 'streak') {
        currentProgress = progress.streak;
        shouldUnlock = progress.streak >= achievement.requirement;
      } else if (achievement.type === 'completion') {
        currentProgress = progress.totalSessions;
        shouldUnlock = progress.totalSessions >= achievement.requirement;
      } else if (achievement.type === 'social') {
        currentProgress = 0;
        shouldUnlock = false;
      }

      // Update or create user achievement
      const existingUA = userAchievements.find(ua => ua.achievementId === achievement.id);
      
      if (existingUA && !existingUA.isCompleted && shouldUnlock) {
        await this.prisma.userAchievement.update({
          where: { id: existingUA.id },
          data: { 
            progress: currentProgress,
            isCompleted: true,
            completedAt: new Date(),
          },
        });
        newlyUnlocked.push(achievement);
      } else if (existingUA) {
        await this.prisma.userAchievement.update({
          where: { id: existingUA.id },
          data: { progress: currentProgress },
        });
      } else {
        const newUA = await this.prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            progress: currentProgress,
            isCompleted: shouldUnlock,
            completedAt: shouldUnlock ? new Date() : null,
          },
        });
        if (shouldUnlock) {
          newlyUnlocked.push(achievement);
        }
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
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        type: achievement.type,
        category: achievement.category,
        requirement: achievement.requirement,
        points: achievement.points,
        progress: currentProgress,
        unlocked,
        completedAt: unlocked && userAchievement ? userAchievement.completedAt : null,
      };
    });
  }

  // Get learning history
  async getLearningHistory(userId: string, limit = 10) {
    return this.prisma.learningHistory.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    return this.prisma.userProgress.findMany({
      take: limit,
      orderBy: [
        { totalXp: 'desc' },
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
