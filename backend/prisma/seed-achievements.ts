import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAchievements() {
  console.log('🌱 Seeding achievements...');

  const achievements = [
    {
      name: 'First Step',
      description: 'Complete your first learning session',
      type: 'milestone',
      category: 'learning',
      icon: '🎯',
      points: 50,
      requirement: 1,
    },
    {
      name: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      type: 'streak',
      category: 'engagement',
      icon: '🔥',
      points: 100,
      requirement: 7,
    },
    {
      name: 'Knowledge Seeker',
      description: 'Complete 10 learning sessions',
      type: 'completion',
      category: 'progress',
      icon: '📚',
      points: 200,
      requirement: 10,
    },
    {
      name: 'Dedicated Learner',
      description: 'Complete 25 learning sessions',
      type: 'completion',
      category: 'progress',
      icon: '⭐',
      points: 500,
      requirement: 25,
    },
    {
      name: 'Scholar',
      description: 'Complete 50 learning sessions',
      type: 'completion',
      category: 'progress',
      icon: '🏆',
      points: 1000,
      requirement: 50,
    },
    {
      name: 'Marathon Runner',
      description: 'Maintain a 30-day learning streak',
      type: 'streak',
      category: 'engagement',
      icon: '🏃',
      points: 500,
      requirement: 30,
    },
    {
      name: 'Level Master',
      description: 'Reach level 10',
      type: 'milestone',
      category: 'progress',
      icon: '🎖️',
      points: 300,
      requirement: 10,
    },
    {
      name: 'Social Butterfly',
      description: 'Connect with 5 different tutors',
      type: 'social',
      category: 'social',
      icon: '🦋',
      points: 150,
      requirement: 5,
    },
  ];

  for (const achievement of achievements) {
    const existing = await prisma.achievement.findFirst({
      where: { name: achievement.name },
    });

    if (!existing) {
      await prisma.achievement.create({
        data: achievement as any,
      });
      console.log(`✅ Created achievement: ${achievement.name}`);
    } else {
      console.log(`⏭️  Skipped (already exists): ${achievement.name}`);
    }
  }

  console.log('✅ Achievements seeding completed!');
}

seedAchievements()
  .catch((e) => {
    console.error('❌ Error seeding achievements:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
