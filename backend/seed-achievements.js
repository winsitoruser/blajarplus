const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedAchievements() {
  try {
    console.log('🏆 Seeding achievements...\n');

    // Delete existing achievements
    await prisma.achievement.deleteMany({});

    const achievements = [
      {
        code: 'first_lesson',
        name: 'First Step',
        description: 'Complete your first lesson',
        icon: '🎯',
        category: 'lessons',
        requirement: 1,
        xpReward: 50,
      },
      {
        code: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        category: 'streak',
        requirement: 7,
        xpReward: 100,
      },
      {
        code: 'knowledge_seeker',
        name: 'Knowledge Seeker',
        description: 'Complete 10 lessons',
        icon: '📚',
        category: 'lessons',
        requirement: 10,
        xpReward: 150,
      },
      {
        code: 'early_bird',
        name: 'Early Bird',
        description: 'Complete a lesson before 8 AM',
        icon: '🌅',
        category: 'time',
        requirement: 1,
        xpReward: 75,
      },
      {
        code: 'night_owl',
        name: 'Night Owl',
        description: 'Complete a lesson after 10 PM',
        icon: '🦉',
        category: 'time',
        requirement: 1,
        xpReward: 75,
      },
      {
        code: 'perfect_score',
        name: 'Perfect Score',
        description: 'Get a 5-star rating in a lesson',
        icon: '💯',
        category: 'performance',
        requirement: 1,
        xpReward: 100,
      },
      {
        code: 'social_learner',
        name: 'Social Learner',
        description: 'Study with 5 different tutors',
        icon: '👥',
        category: 'social',
        requirement: 5,
        xpReward: 150,
      },
      {
        code: 'dedicated',
        name: 'Dedicated',
        description: 'Complete 20 lessons',
        icon: '⭐',
        category: 'lessons',
        requirement: 20,
        xpReward: 200,
      },
      {
        code: 'marathon',
        name: 'Marathon',
        description: 'Study for 3 hours in one day',
        icon: '🏃',
        category: 'time',
        requirement: 3,
        xpReward: 150,
      },
      {
        code: 'master',
        name: 'Master',
        description: 'Reach level 20',
        icon: '👑',
        category: 'level',
        requirement: 20,
        xpReward: 500,
      },
      {
        code: 'unstoppable',
        name: 'Unstoppable',
        description: 'Maintain a 30-day streak',
        icon: '🚀',
        category: 'streak',
        requirement: 30,
        xpReward: 300,
      },
      {
        code: 'scholar',
        name: 'Scholar',
        description: 'Complete 50 lessons',
        icon: '🎓',
        category: 'lessons',
        requirement: 50,
        xpReward: 500,
      },
      {
        code: 'speed_learner',
        name: 'Speed Learner',
        description: 'Complete 5 lessons in one week',
        icon: '⚡',
        category: 'lessons',
        requirement: 5,
        xpReward: 100,
      },
      {
        code: 'consistent',
        name: 'Consistent',
        description: 'Complete lessons 3 days in a row',
        icon: '📅',
        category: 'streak',
        requirement: 3,
        xpReward: 75,
      },
      {
        code: 'explorer',
        name: 'Explorer',
        description: 'Study 3 different subjects',
        icon: '🌍',
        category: 'variety',
        requirement: 3,
        xpReward: 100,
      },
    ];

    for (const achievement of achievements) {
      await prisma.achievement.create({
        data: achievement,
      });
    }

    console.log(`✅ Created ${achievements.length} achievements\n`);

    // Get demo user and create initial progress
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@blajarplus.com' },
    });

    if (demoUser) {
      // Delete existing progress
      await prisma.userProgress.deleteMany({
        where: { userId: demoUser.id },
      });

      // Create initial progress
      await prisma.userProgress.create({
        data: {
          userId: demoUser.id,
          totalXP: 2450,
          level: 12,
          currentStreak: 7,
          longestStreak: 15,
          totalLessons: 24,
          hoursLearned: 48,
          rank: 'Gold',
          lastLessonDate: new Date(),
        },
      });

      console.log('✅ Created user progress for demo user');

      // Create some user achievements
      const unlockedAchievements = achievements.filter(a => 
        ['first_lesson', 'week_warrior', 'knowledge_seeker', 'early_bird', 'night_owl', 'perfect_score', 'social_learner', 'dedicated'].includes(a.code)
      );

      for (const achievement of unlockedAchievements) {
        const dbAchievement = await prisma.achievement.findUnique({
          where: { code: achievement.code },
        });

        await prisma.userAchievement.create({
          data: {
            userId: demoUser.id,
            achievementId: dbAchievement.id,
            progress: achievement.requirement,
            unlockedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date in last 30 days
          },
        });
      }

      console.log(`✅ Unlocked ${unlockedAchievements.length} achievements for demo user`);

      // Create learning history
      const completedBookings = await prisma.booking.findMany({
        where: {
          studentId: demoUser.id,
          status: 'completed',
        },
        include: {
          tutor: {
            include: {
              user: true,
            },
          },
          subject: true,
        },
        take: 5,
      });

      if (completedBookings.length > 0) {
        for (const booking of completedBookings) {
          await prisma.learningHistory.create({
            data: {
              userId: demoUser.id,
              bookingId: booking.id,
              subject: booking.subject.name,
              tutorName: booking.tutor.user.fullName,
              duration: booking.duration,
              rating: 5,
              xpEarned: Math.floor(booking.duration * 50),
              notes: 'Great session!',
            },
          });
        }

        console.log(`✅ Created ${completedBookings.length} learning history entries`);
      }
    }

    console.log('\n🎉 Achievements seeded successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - ${achievements.length} achievements created`);
    console.log(`   - Demo user progress initialized`);
    console.log(`   - 8 achievements unlocked for demo user`);
    console.log('\n💡 You can now test the gamification system!');

  } catch (error) {
    console.error('❌ Error seeding achievements:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAchievements();
