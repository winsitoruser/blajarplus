const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedChatMessages() {
  try {
    console.log('🌱 Seeding chat messages...');

    // Get demo user
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@blajarplus.com' },
    });

    if (!demoUser) {
      console.log('❌ Demo user not found. Please create demo user first.');
      return;
    }

    console.log('✅ Found demo user:', demoUser.fullName);

    // Get or create some tutor profiles
    const tutors = await prisma.tutorProfile.findMany({
      take: 3,
      include: {
        user: true,
      },
    });

    if (tutors.length === 0) {
      console.log('⚠️  No tutors found. Creating dummy tutors...');
      
      // Create dummy tutors
      const tutorUsers = [];
      
      for (let i = 1; i <= 3; i++) {
        // Check if tutor user already exists
        let tutorUser = await prisma.user.findUnique({
          where: { email: `tutor${i}@blajarplus.com` },
        });

        if (!tutorUser) {
          tutorUser = await prisma.user.create({
            data: {
              email: `tutor${i}@blajarplus.com`,
              phone: `+628123456789${i}`,
              passwordHash: '$2b$10$demopasswordhash',
              fullName: i === 1 ? 'Budi Santoso' : i === 2 ? 'Siti Nurhaliza' : 'Andi Wijaya',
              role: 'tutor',
              status: 'active',
            },
          });
        }
        tutorUsers.push(tutorUser);
      }

      // Create tutor profiles
      for (const tutorUser of tutorUsers) {
        // Check if profile already exists
        const existingProfile = await prisma.tutorProfile.findUnique({
          where: { userId: tutorUser.id },
        });

        if (!existingProfile) {
          await prisma.tutorProfile.create({
            data: {
              userId: tutorUser.id,
              bio: `Tutor profesional dengan pengalaman ${Math.floor(Math.random() * 5) + 3} tahun`,
              hourlyRate: 150000 + Math.floor(Math.random() * 100000),
              teachingModes: ['online', 'offline'],
              offerFreeTrial: true,
              freeTrialDuration: 30,
            },
          });
        }
      }

      console.log('✅ Created/verified 3 dummy tutors');
    }

    // Fetch tutors again
    const allTutors = await prisma.tutorProfile.findMany({
      take: 3,
      include: {
        user: true,
      },
    });

    console.log(`✅ Found ${allTutors.length} tutors`);

    // Create conversations and messages
    for (let i = 0; i < allTutors.length; i++) {
      const tutor = allTutors[i];
      
      // Check if conversation already exists
      let conversation = await prisma.conversation.findFirst({
        where: {
          studentId: demoUser.id,
          tutorId: tutor.id,
        },
      });

      // Create conversation if doesn't exist
      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            studentId: demoUser.id,
            tutorId: tutor.id,
            lastMessageAt: new Date(),
          },
        });
        console.log(`✅ Created conversation with ${tutor.user.fullName}`);
      } else {
        console.log(`ℹ️  Conversation with ${tutor.user.fullName} already exists`);
      }

      // Delete existing messages for clean slate
      await prisma.message.deleteMany({
        where: { conversationId: conversation.id },
      });

      // Create messages based on tutor index
      const messageTemplates = [
        // Conversation 1 - Matematika
        [
          { sender: tutor.user.id, content: 'Halo! Saya Budi, tutor Matematika. Ada yang bisa saya bantu?', hoursAgo: 48 },
          { sender: demoUser.id, content: 'Halo Pak Budi, saya kesulitan dengan materi kalkulus', hoursAgo: 47 },
          { sender: tutor.user.id, content: 'Baik, topik kalkulus apa yang ingin dipelajari? Diferensial atau integral?', hoursAgo: 46 },
          { sender: demoUser.id, content: 'Diferensial pak, terutama turunan fungsi trigonometri', hoursAgo: 45 },
          { sender: tutor.user.id, content: 'Oke, saya bisa bantu. Kapan waktu yang cocok untuk les online?', hoursAgo: 44 },
          { sender: demoUser.id, content: 'Besok sore jam 4 bisa pak?', hoursAgo: 2 },
          { sender: tutor.user.id, content: 'Bisa! Saya tunggu besok ya. Siapkan buku catatan 📚', hoursAgo: 1, unread: true },
        ],
        // Conversation 2 - Bahasa Inggris
        [
          { sender: tutor.user.id, content: 'Hi! I\'m Siti, your English tutor. How can I help you today?', hoursAgo: 72 },
          { sender: demoUser.id, content: 'Hello Miss Siti, I want to improve my speaking skills', hoursAgo: 71 },
          { sender: tutor.user.id, content: 'Great! What\'s your current level? Beginner, intermediate, or advanced?', hoursAgo: 70 },
          { sender: demoUser.id, content: 'I think intermediate. I can understand but speaking is difficult', hoursAgo: 69 },
          { sender: tutor.user.id, content: 'No problem! We can practice conversation together. When would you like to start?', hoursAgo: 68 },
          { sender: demoUser.id, content: 'This weekend would be perfect', hoursAgo: 24 },
          { sender: tutor.user.id, content: 'Saturday at 10 AM works for you? We can do 1 hour session', hoursAgo: 23, unread: true },
          { sender: tutor.user.id, content: 'Let me know if that time is okay 😊', hoursAgo: 23, unread: true },
        ],
        // Conversation 3 - Fisika
        [
          { sender: tutor.user.id, content: 'Selamat siang! Saya Andi, tutor Fisika. Ada pertanyaan?', hoursAgo: 96 },
          { sender: demoUser.id, content: 'Siang Pak Andi, saya mau tanya tentang hukum Newton', hoursAgo: 95 },
          { sender: tutor.user.id, content: 'Silakan, hukum Newton yang mana? Ada 3 hukum Newton', hoursAgo: 94 },
          { sender: demoUser.id, content: 'Yang kedua pak, tentang F = ma', hoursAgo: 93 },
          { sender: tutor.user.id, content: 'Ah iya, hukum kedua Newton. Ini tentang hubungan gaya, massa, dan percepatan. Mau saya jelaskan lebih detail?', hoursAgo: 92 },
          { sender: demoUser.id, content: 'Iya pak, tolong dijelaskan dengan contoh soal', hoursAgo: 5 },
          { sender: tutor.user.id, content: 'Baik, nanti saya siapkan materi dan contoh soal. Kita bisa diskusi via video call', hoursAgo: 4, unread: true },
          { sender: tutor.user.id, content: 'Saya available hari Senin-Jumat jam 3-8 malam', hoursAgo: 4, unread: true },
          { sender: tutor.user.id, content: 'Pilih waktu yang cocok ya 👍', hoursAgo: 4, unread: true },
        ],
      ];

      const messages = messageTemplates[i] || messageTemplates[0];

      for (const msg of messages) {
        const createdAt = new Date();
        createdAt.setHours(createdAt.getHours() - msg.hoursAgo);

        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderUserId: msg.sender,
            content: msg.content,
            messageType: 'text',
            readAt: msg.unread ? null : createdAt,
            createdAt: createdAt,
          },
        });
      }

      // Update conversation lastMessageAt
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          lastMessageAt: new Date(),
        },
      });

      console.log(`✅ Created ${messages.length} messages with ${tutor.user.fullName}`);
    }

    console.log('\n🎉 Chat messages seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${allTutors.length} conversations created`);
    console.log(`   - Multiple messages per conversation`);
    console.log(`   - Some messages marked as unread for testing`);
    console.log('\n💡 You can now test the chatbox with real-looking conversations!');

  } catch (error) {
    console.error('❌ Error seeding chat messages:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChatMessages();
