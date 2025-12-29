const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedCompleteData() {
  try {
    console.log('🌱 Seeding complete data for testing...\n');

    // ============================================
    // 1. SEED SUBJECTS
    // ============================================
    console.log('📚 Seeding subjects...');
    
    const subjectData = [
      { name: 'Matematika', slug: 'matematika' },
      { name: 'Fisika', slug: 'fisika' },
      { name: 'Kimia', slug: 'kimia' },
      { name: 'Biologi', slug: 'biologi' },
      { name: 'Bahasa Inggris', slug: 'bahasa-inggris' },
      { name: 'Bahasa Indonesia', slug: 'bahasa-indonesia' },
      { name: 'Ekonomi', slug: 'ekonomi' },
      { name: 'Sejarah', slug: 'sejarah' },
      { name: 'Geografi', slug: 'geografi' },
      { name: 'Programming', slug: 'programming' },
    ];

    const subjects = [];
    for (const subjectInfo of subjectData) {
      let subject = await prisma.subject.findUnique({
        where: { slug: subjectInfo.slug },
      });

      if (!subject) {
        subject = await prisma.subject.create({
          data: subjectInfo,
        });
        console.log(`  ✅ Created subject: ${subject.name}`);
      } else {
        console.log(`  ℹ️  Subject already exists: ${subject.name}`);
      }
      subjects.push(subject);
    }

    console.log(`✅ ${subjects.length} subjects ready\n`);

    // ============================================
    // 2. GET OR CREATE DEMO USER
    // ============================================
    console.log('👤 Checking demo user...');
    
    let demoUser = await prisma.user.findUnique({
      where: { email: 'demo@blajarplus.com' },
    });

    if (!demoUser) {
      console.log('  ⚠️  Demo user not found. Please create it first.');
      return;
    }

    console.log(`  ✅ Demo user found: ${demoUser.fullName}\n`);

    // ============================================
    // 3. CREATE/UPDATE TUTORS WITH VERIFICATION
    // ============================================
    console.log('👨‍🏫 Setting up tutors...');

    const tutorConfigs = [
      {
        email: 'tutor1@blajarplus.com',
        phone: '+6281234567891',
        fullName: 'Budi Santoso',
        bio: 'Tutor Matematika dan Fisika berpengalaman 10 tahun. Lulusan ITB dengan spesialisasi pendidikan.',
        education: 'S1 Pendidikan Matematika ITB',
        experienceYears: 10,
        hourlyRate: 150000,
        subjects: ['Matematika', 'Fisika'],
        levels: ['SD', 'SMP', 'SMA'],
      },
      {
        email: 'tutor2@blajarplus.com',
        phone: '+6281234567892',
        fullName: 'Siti Nurhaliza',
        bio: 'Native English speaker dengan pengalaman mengajar TOEFL dan IELTS. Bersertifikat TESOL.',
        education: 'S1 English Literature UI',
        experienceYears: 8,
        hourlyRate: 200000,
        subjects: ['Bahasa Inggris'],
        levels: ['SD', 'SMP', 'SMA', 'Universitas', 'Umum'],
      },
      {
        email: 'tutor3@blajarplus.com',
        phone: '+6281234567893',
        fullName: 'Andi Wijaya',
        bio: 'Guru Fisika dan Kimia dengan metode pembelajaran interaktif. Spesialis persiapan UN dan SBMPTN.',
        education: 'S1 Fisika UGM',
        experienceYears: 7,
        hourlyRate: 175000,
        subjects: ['Fisika', 'Kimia', 'Matematika'],
        levels: ['SMP', 'SMA'],
      },
    ];

    const tutorProfiles = [];

    for (const config of tutorConfigs) {
      // Get or create tutor user
      let tutorUser = await prisma.user.findUnique({
        where: { email: config.email },
      });

      if (!tutorUser) {
        tutorUser = await prisma.user.create({
          data: {
            email: config.email,
            phone: config.phone,
            passwordHash: '$2b$10$YourHashedPasswordHere', // Use proper hash in production
            fullName: config.fullName,
            role: 'tutor',
            status: 'active',
          },
        });
        console.log(`  ✅ Created tutor user: ${tutorUser.fullName}`);
      }

      // Get or create tutor profile
      let tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId: tutorUser.id },
      });

      if (!tutorProfile) {
        tutorProfile = await prisma.tutorProfile.create({
          data: {
            userId: tutorUser.id,
            headline: `${config.subjects.join(', ')} Expert`,
            bio: config.bio,
            education: config.education,
            experienceYears: config.experienceYears,
            teachingModes: ['online', 'offline'],
            baseCity: 'Jakarta',
            hourlyRate: config.hourlyRate,
            offerFreeTrial: true,
            freeTrialDuration: 30,
            verificationStatus: 'approved', // IMPORTANT: Set to approved
            isVerified: true,                // IMPORTANT: Set to true
            status: 'active',
          },
        });
        console.log(`  ✅ Created tutor profile: ${config.fullName}`);
      } else {
        // Update existing profile to ensure verification
        tutorProfile = await prisma.tutorProfile.update({
          where: { id: tutorProfile.id },
          data: {
            verificationStatus: 'approved',
            isVerified: true,
            status: 'active',
          },
        });
        console.log(`  ✅ Updated tutor profile: ${config.fullName}`);
      }

      tutorProfiles.push({ profile: tutorProfile, config });
    }

    console.log(`✅ ${tutorProfiles.length} tutors ready\n`);

    // ============================================
    // 4. CREATE TUTOR-SUBJECT LINKS
    // ============================================
    console.log('🔗 Linking tutors to subjects...');

    for (const { profile, config } of tutorProfiles) {
      for (const subjectName of config.subjects) {
        const subject = subjects.find(s => s.name === subjectName);
        if (!subject) continue;

        for (const level of config.levels) {
          // Check if link already exists
          const existing = await prisma.tutorSubject.findFirst({
            where: {
              tutorId: profile.id,
              subjectId: subject.id,
              level: level,
            },
          });

          if (!existing) {
            await prisma.tutorSubject.create({
              data: {
                tutorId: profile.id,
                subjectId: subject.id,
                level: level,
                description: `${subjectName} untuk tingkat ${level}`,
                isActive: true,
              },
            });
            console.log(`  ✅ ${config.fullName} → ${subjectName} (${level})`);
          }
        }
      }
    }

    console.log('✅ Tutor-subject links created\n');

    // ============================================
    // 5. CREATE TUTOR AVAILABILITY (SAMPLE)
    // ============================================
    console.log('📅 Setting up tutor availability...');

    for (const { profile } of tutorProfiles) {
      // Check if availability already exists
      const existingAvailability = await prisma.tutorAvailability.findFirst({
        where: { tutorId: profile.id },
      });

      if (!existingAvailability) {
        // Create availability for weekdays
        const weekdays = [1, 2, 3, 4, 5]; // Monday to Friday
        for (const day of weekdays) {
          await prisma.tutorAvailability.create({
            data: {
              tutorId: profile.id,
              dayOfWeek: day,
              startTime: '09:00',
              endTime: '17:00',
              isActive: true,
            },
          });
        }
        console.log(`  ✅ Availability set for tutor: ${profile.id.substring(0, 8)}...`);
      }
    }

    console.log('✅ Tutor availability created\n');

    // ============================================
    // 6. CREATE WALLETS FOR USERS
    // ============================================
    console.log('💰 Setting up wallets...');

    // Demo user wallet
    let demoWallet = await prisma.wallet.findUnique({
      where: { userId: demoUser.id },
    });

    if (!demoWallet) {
      demoWallet = await prisma.wallet.create({
        data: {
          userId: demoUser.id,
          balance: 0,
          currency: 'IDR',
        },
      });
      console.log(`  ✅ Wallet created for demo user`);
    }

    // Tutor wallets
    for (const { profile } of tutorProfiles) {
      let wallet = await prisma.wallet.findUnique({
        where: { userId: profile.userId },
      });

      if (!wallet) {
        wallet = await prisma.wallet.create({
          data: {
            userId: profile.userId,
            balance: 0,
            currency: 'IDR',
          },
        });
        console.log(`  ✅ Wallet created for tutor: ${profile.userId.substring(0, 8)}...`);
      }
    }

    console.log('✅ Wallets created\n');

    // ============================================
    // SUMMARY
    // ============================================
    console.log('\n🎉 Complete data seeding finished!\n');
    console.log('📊 Summary:');
    console.log(`   - ${subjects.length} subjects`);
    console.log(`   - ${tutorProfiles.length} verified tutors`);
    console.log(`   - Tutor-subject links created`);
    console.log(`   - Tutor availability set (Mon-Fri, 9AM-5PM)`);
    console.log(`   - Wallets created for all users`);
    console.log('\n✅ System is now ready for booking creation testing!');
    console.log('\n📝 Test Accounts:');
    console.log('   Student: demo@blajarplus.com / demo12345');
    console.log('   Tutor 1: tutor1@blajarplus.com / demo12345 (Budi Santoso)');
    console.log('   Tutor 2: tutor2@blajarplus.com / demo12345 (Siti Nurhaliza)');
    console.log('   Tutor 3: tutor3@blajarplus.com / demo12345 (Andi Wijaya)');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedCompleteData();
