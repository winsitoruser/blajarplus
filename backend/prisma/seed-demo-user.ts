import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('👤 Creating demo users...\n');

  const hashedPassword = await bcrypt.hash('demo12345', 10);

  // Create demo student
  const demoStudent = await prisma.user.upsert({
    where: { email: 'demo@blajarplus.com' },
    update: {},
    create: {
      email: 'demo@blajarplus.com',
      phone: '081234567890',
      passwordHash: hashedPassword,
      fullName: 'Demo Student',
      role: 'student',
      status: 'active',
    },
  });

  console.log('✅ Created demo student:', demoStudent.email);

  // Create demo tutor
  const demoTutor = await prisma.user.upsert({
    where: { email: 'tutor@blajarplus.com' },
    update: {},
    create: {
      email: 'tutor@blajarplus.com',
      phone: '081234567891',
      passwordHash: hashedPassword,
      fullName: 'Demo Tutor',
      role: 'tutor',
      status: 'active',
    },
  });

  console.log('✅ Created demo tutor:', demoTutor.email);

  // Create user progress for demo student
  await prisma.userProgress.upsert({
    where: { userId: demoStudent.id },
    update: {},
    create: {
      userId: demoStudent.id,
      totalXp: 150,
      xp: 50,
      level: 3,
      streak: 5,
      longestStreak: 7,
      totalSessions: 10,
      totalHours: 5.5,
      lastActiveDate: new Date(),
    },
  });

  console.log('✅ Created user progress for demo student');

  console.log('\n🎉 Demo users created successfully!');
  console.log('\n📝 Login credentials:');
  console.log('   Student:');
  console.log('   - Email: demo@blajarplus.com');
  console.log('   - Password: demo12345');
  console.log('\n   Tutor:');
  console.log('   - Email: tutor@blajarplus.com');
  console.log('   - Password: demo12345');
}

main()
  .catch((e) => {
    console.error('❌ Error creating demo users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
