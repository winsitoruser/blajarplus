import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  console.log('=== CHECKING EXISTING USERS ===\n');

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      phone: true,
      fullName: true,
      role: true,
      status: true,
    },
    orderBy: {
      role: 'asc',
    },
  });

  console.log(`Total users: ${users.length}\n`);

  const admin = users.filter(u => u.role === 'admin');
  const tutors = users.filter(u => u.role === 'tutor');
  const students = users.filter(u => u.role === 'student');

  console.log('📋 ADMIN USERS:');
  admin.forEach(u => {
    console.log(`  - ${u.fullName} (${u.email || u.phone})`);
  });

  console.log('\n👨‍🏫 TUTOR USERS:');
  tutors.forEach(u => {
    console.log(`  - ${u.fullName} (${u.email || u.phone})`);
  });

  console.log('\n👨‍🎓 STUDENT USERS:');
  students.forEach(u => {
    console.log(`  - ${u.fullName} (${u.email || u.phone})`);
  });

  await prisma.$disconnect();
}

checkUsers().catch(console.error);
