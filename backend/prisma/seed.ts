import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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
  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
