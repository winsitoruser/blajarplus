import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  
  // Hash password untuk semua user
  const hashedPassword = await bcrypt.hash('Test123!', 10);

  // Seed Subject Categories
  const categories = await Promise.all([
    prisma.subjectCategory.upsert({
      where: { slug: 'akademik' },
      update: {},
      create: {
        name: 'Akademik',
        slug: 'akademik',
      },
    }),
    prisma.subjectCategory.upsert({
      where: { slug: 'bahasa' },
      update: {},
      create: {
        name: 'Bahasa',
        slug: 'bahasa',
      },
    }),
    prisma.subjectCategory.upsert({
      where: { slug: 'skill' },
      update: {},
      create: {
        name: 'Skill',
        slug: 'skill',
      },
    }),
    prisma.subjectCategory.upsert({
      where: { slug: 'hobi' },
      update: {},
      create: {
        name: 'Hobi',
        slug: 'hobi',
      },
    }),
    prisma.subjectCategory.upsert({
      where: { slug: 'profesional' },
      update: {},
      create: {
        name: 'Profesional',
        slug: 'profesional',
      },
    }),
  ]);

  console.log('✅ Categories seeded:', categories.length);

  // Seed Subjects
  const subjects = await Promise.all([
    // Akademik
    prisma.subject.upsert({
      where: { slug: 'matematika' },
      update: {},
      create: {
        name: 'Matematika',
        slug: 'matematika',
        categoryId: categories[0].id,
      },
    }),
    prisma.subject.upsert({
      where: { slug: 'fisika' },
      update: {},
      create: {
        name: 'Fisika',
        slug: 'fisika',
        categoryId: categories[0].id,
      },
    }),
    prisma.subject.upsert({
      where: { slug: 'kimia' },
      update: {},
      create: {
        name: 'Kimia',
        slug: 'kimia',
        categoryId: categories[0].id,
      },
    }),
    prisma.subject.upsert({
      where: { slug: 'biologi' },
      update: {},
      create: {
        name: 'Biologi',
        slug: 'biologi',
        categoryId: categories[0].id,
      },
    }),
    // Bahasa
    prisma.subject.upsert({
      where: { slug: 'bahasa-inggris' },
      update: {},
      create: {
        name: 'Bahasa Inggris',
        slug: 'bahasa-inggris',
        categoryId: categories[1].id,
      },
    }),
    prisma.subject.upsert({
      where: { slug: 'bahasa-indonesia' },
      update: {},
      create: {
        name: 'Bahasa Indonesia',
        slug: 'bahasa-indonesia',
        categoryId: categories[1].id,
      },
    }),
    prisma.subject.upsert({
      where: { slug: 'bahasa-mandarin' },
      update: {},
      create: {
        name: 'Bahasa Mandarin',
        slug: 'bahasa-mandarin',
        categoryId: categories[1].id,
      },
    }),
    // Skill
    prisma.subject.upsert({
      where: { slug: 'programming' },
      update: {},
      create: {
        name: 'Programming',
        slug: 'programming',
        categoryId: categories[2].id,
      },
    }),
    prisma.subject.upsert({
      where: { slug: 'design-grafis' },
      update: {},
      create: {
        name: 'Design Grafis',
        slug: 'design-grafis',
        categoryId: categories[2].id,
      },
    }),
    // Hobi
    prisma.subject.upsert({
      where: { slug: 'musik' },
      update: {},
      create: {
        name: 'Musik',
        slug: 'musik',
        categoryId: categories[3].id,
      },
    }),
    prisma.subject.upsert({
      where: { slug: 'menggambar' },
      update: {},
      create: {
        name: 'Menggambar',
        slug: 'menggambar',
        categoryId: categories[3].id,
      },
    }),
  ]);

  console.log('✅ Subjects seeded:', subjects.length);

  // Seed Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@blajarplus.com' },
    update: {},
    create: {
      email: 'admin@blajarplus.com',
      passwordHash: hashedPassword,
      fullName: 'Admin BlajarPlus',
      phone: '081234567890',
      role: 'admin',
    },
  });

  const tutor1User = await prisma.user.upsert({
    where: { email: 'tutor1@test.com' },
    update: {},
    create: {
      email: 'tutor1@test.com',
      passwordHash: hashedPassword,
      fullName: 'Dr. Ahmad Hidayat',
      phone: '081234567891',
      role: 'tutor',
    },
  });

  const tutor2User = await prisma.user.upsert({
    where: { email: 'tutor2@test.com' },
    update: {},
    create: {
      email: 'tutor2@test.com',
      passwordHash: hashedPassword,
      fullName: 'Sarah Johnson',
      phone: '081234567892',
      role: 'tutor',
    },
  });

  const tutor3User = await prisma.user.upsert({
    where: { email: 'tutor3@test.com' },
    update: {},
    create: {
      email: 'tutor3@test.com',
      passwordHash: hashedPassword,
      fullName: 'Budi Santoso',
      phone: '081234567893',
      role: 'tutor',
    },
  });

  const student1 = await prisma.user.upsert({
    where: { email: 'student1@test.com' },
    update: {},
    create: {
      email: 'student1@test.com',
      passwordHash: hashedPassword,
      fullName: 'Andi Wijaya',
      phone: '081234567894',
      role: 'student',
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@test.com' },
    update: {},
    create: {
      email: 'student2@test.com',
      passwordHash: hashedPassword,
      fullName: 'Siti Nurhaliza',
      phone: '081234567895',
      role: 'student',
    },
  });

  const student3 = await prisma.user.upsert({
    where: { email: 'student3@test.com' },
    update: {},
    create: {
      email: 'student3@test.com',
      passwordHash: hashedPassword,
      fullName: 'Rudi Hartono',
      phone: '081234567896',
      role: 'student',
    },
  });

  console.log('✅ Users seeded: 7 (1 admin, 3 tutors, 3 students)');

  // Seed Tutor Profiles
  const tutor1 = await prisma.tutorProfile.upsert({
    where: { userId: tutor1User.id },
    update: {},
    create: {
      userId: tutor1User.id,
      bio: 'Doktor Matematika dengan pengalaman 10+ tahun mengajar. Spesialisasi dalam persiapan ujian masuk universitas dan olimpiade.',
      baseCity: 'Jakarta',
      hourlyRate: 150000,
      verificationStatus: 'approved',
      isVerified: true,
      status: 'active',
      ratingAvg: 4.8,
      ratingCount: 15,
      completedLessonsCount: 45,
    },
  });

  const tutor2 = await prisma.tutorProfile.upsert({
    where: { userId: tutor2User.id },
    update: {},
    create: {
      userId: tutor2User.id,
      bio: 'Native English speaker dengan sertifikasi TESOL. Berpengalaman mengajar dari anak-anak hingga dewasa.',
      baseCity: 'Bandung',
      hourlyRate: 120000,
      verificationStatus: 'approved',
      isVerified: true,
      status: 'active',
      ratingAvg: 4.9,
      ratingCount: 22,
      completedLessonsCount: 68,
    },
  });

  const tutor3 = await prisma.tutorProfile.upsert({
    where: { userId: tutor3User.id },
    update: {},
    create: {
      userId: tutor3User.id,
      bio: 'Full-stack developer dengan 7 tahun pengalaman. Mengajar programming dari basic hingga advanced level.',
      baseCity: 'Surabaya',
      hourlyRate: 200000,
      verificationStatus: 'approved',
      isVerified: true,
      status: 'active',
      ratingAvg: 4.7,
      ratingCount: 18,
      completedLessonsCount: 52,
    },
  });

  console.log('✅ Tutor profiles seeded: 3');

  // Seed Tutor Subjects
  const tutorSubjects = await Promise.all([
    // Tutor 1 - Matematika & Fisika
    prisma.tutorSubject.create({
      data: {
        tutorId: tutor1.id,
        subjectId: subjects[0].id, // Matematika
        level: 'sma',
        priceOverride: 150000,
      },
    }),
    prisma.tutorSubject.create({
      data: {
        tutorId: tutor1.id,
        subjectId: subjects[0].id, // Matematika
        level: 'university',
        priceOverride: 180000,
      },
    }),
    prisma.tutorSubject.create({
      data: {
        tutorId: tutor1.id,
        subjectId: subjects[1].id, // Fisika
        level: 'sma',
        priceOverride: 150000,
      },
    }),
    // Tutor 2 - Bahasa Inggris
    prisma.tutorSubject.create({
      data: {
        tutorId: tutor2.id,
        subjectId: subjects[4].id, // Bahasa Inggris
        level: 'sd',
        priceOverride: 100000,
      },
    }),
    prisma.tutorSubject.create({
      data: {
        tutorId: tutor2.id,
        subjectId: subjects[4].id, // Bahasa Inggris
        level: 'smp',
        priceOverride: 110000,
      },
    }),
    prisma.tutorSubject.create({
      data: {
        tutorId: tutor2.id,
        subjectId: subjects[4].id, // Bahasa Inggris
        level: 'sma',
        priceOverride: 120000,
      },
    }),
    // Tutor 3 - Programming
    prisma.tutorSubject.create({
      data: {
        tutorId: tutor3.id,
        subjectId: subjects[7].id, // Programming
        level: 'university',
        priceOverride: 200000,
      },
    }),
    prisma.tutorSubject.create({
      data: {
        tutorId: tutor3.id,
        subjectId: subjects[7].id, // Programming
        level: 'professional',
        priceOverride: 250000,
      },
    }),
  ]);

  console.log('✅ Tutor subjects seeded:', tutorSubjects.length);

  // Seed Tutor Availability
  const availabilities = [];
  // Tutor 1 - Senin-Jumat 09:00-17:00
  for (let day = 1; day <= 5; day++) {
    availabilities.push(
      prisma.tutorAvailability.create({
        data: {
          tutorId: tutor1.id,
          dayOfWeek: day,
          startTime: '09:00',
          endTime: '17:00',
          slotDurationMinutes: 60,
        },
      })
    );
  }
  // Tutor 2 - Senin-Sabtu 10:00-18:00
  for (let day = 1; day <= 6; day++) {
    availabilities.push(
      prisma.tutorAvailability.create({
        data: {
          tutorId: tutor2.id,
          dayOfWeek: day,
          startTime: '10:00',
          endTime: '18:00',
          slotDurationMinutes: 90,
        },
      })
    );
  }
  // Tutor 3 - Selasa-Kamis 14:00-22:00
  for (let day = 2; day <= 4; day++) {
    availabilities.push(
      prisma.tutorAvailability.create({
        data: {
          tutorId: tutor3.id,
          dayOfWeek: day,
          startTime: '14:00',
          endTime: '22:00',
          slotDurationMinutes: 120,
        },
      })
    );
  }
  await Promise.all(availabilities);

  console.log('✅ Tutor availabilities seeded:', availabilities.length);

  console.log('🎉 Seeding completed!');
  console.log('\n📋 Test Credentials:');
  console.log('Admin: admin@blajarplus.com / Test123!');
  console.log('Tutor 1: tutor1@test.com / Test123!');
  console.log('Tutor 2: tutor2@test.com / Test123!');
  console.log('Tutor 3: tutor3@test.com / Test123!');
  console.log('Student 1: student1@test.com / Test123!');
  console.log('Student 2: student2@test.com / Test123!');
  console.log('Student 3: student3@test.com / Test123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
