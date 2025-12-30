import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Seeding languages...');

  // Create Languages
  const languages = await Promise.all([
    prisma.language.upsert({
      where: { code: 'EN' },
      update: {},
      create: {
        code: 'EN',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧',
        description: 'Learn English from scratch to advanced level',
        isActive: true,
      },
    }),
    prisma.language.upsert({
      where: { code: 'JA' },
      update: {},
      create: {
        code: 'JA',
        name: 'Japanese',
        nativeName: '日本語',
        flag: '🇯🇵',
        description: 'Master Japanese language and culture',
        isActive: true,
      },
    }),
    prisma.language.upsert({
      where: { code: 'FR' },
      update: {},
      create: {
        code: 'FR',
        name: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        description: 'Learn the language of love and culture',
        isActive: true,
      },
    }),
    prisma.language.upsert({
      where: { code: 'KO' },
      update: {},
      create: {
        code: 'KO',
        name: 'Korean',
        nativeName: '한국어',
        flag: '🇰🇷',
        description: 'Discover Korean language and K-culture',
        isActive: true,
      },
    }),
    prisma.language.upsert({
      where: { code: 'ES' },
      update: {},
      create: {
        code: 'ES',
        name: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸',
        description: 'Learn Spanish, spoken by 500M+ people',
        isActive: true,
      },
    }),
    prisma.language.upsert({
      where: { code: 'PT' },
      update: {},
      create: {
        code: 'PT',
        name: 'Portuguese',
        nativeName: 'Português',
        flag: '🇵🇹',
        description: 'Learn Portuguese for Brazil and Portugal',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${languages.length} languages`);

  // Create English Beginner Course
  const englishLang = languages.find(l => l.code === 'EN');
  if (englishLang) {
    const englishCourse = await prisma.course.upsert({
      where: { id: 'english-beginner-course' },
      update: {},
      create: {
        id: 'english-beginner-course',
        languageId: englishLang.id,
        title: 'English for Beginners',
        description: 'Start your English journey from zero',
        level: 'BEGINNER',
        order: 1,
        icon: '📚',
        color: '#4CAF50',
        isActive: true,
      },
    });

    // Unit 1: Greetings
    const unit1 = await prisma.unit.create({
      data: {
        courseId: englishCourse.id,
        title: 'Greetings & Introductions',
        description: 'Learn how to greet people and introduce yourself',
        order: 1,
        icon: '👋',
        xpReward: 20,
        isActive: true,
      },
    });

    // Lesson 1: Basic Greetings
    const lesson1 = await prisma.lesson.create({
      data: {
        unitId: unit1.id,
        title: 'Basic Greetings',
        description: 'Hello, Hi, Good morning',
        order: 1,
        xpReward: 10,
        hearts: 5,
        isActive: true,
      },
    });

    // Exercises for Lesson 1
    await prisma.exercise.createMany({
      data: [
        {
          lessonId: lesson1.id,
          type: 'MULTIPLE_CHOICE',
          difficulty: 'EASY',
          question: 'How do you say "Hello" in English?',
          correctAnswer: 'Hello',
          options: JSON.stringify(['Hello', 'Goodbye', 'Thank you', 'Sorry']),
          explanation: '"Hello" is the most common greeting in English.',
          order: 1,
          xpReward: 2,
        },
        {
          lessonId: lesson1.id,
          type: 'MULTIPLE_CHOICE',
          difficulty: 'EASY',
          question: 'What is the correct response to "How are you?"',
          correctAnswer: "I'm fine, thank you",
          options: JSON.stringify(["I'm fine, thank you", 'Goodbye', 'Hello', 'Yes']),
          explanation: '"I\'m fine, thank you" is a polite response.',
          order: 2,
          xpReward: 2,
        },
        {
          lessonId: lesson1.id,
          type: 'FILL_IN_BLANK',
          difficulty: 'EASY',
          question: 'Complete: Good _____ (in the morning)',
          correctAnswer: 'morning',
          explanation: '"Good morning" is used to greet someone in the morning.',
          hints: JSON.stringify(['It\'s the first part of the day', 'Starts with "m"']),
          order: 3,
          xpReward: 2,
        },
        {
          lessonId: lesson1.id,
          type: 'TRANSLATION',
          difficulty: 'MEDIUM',
          question: 'Translate to English: "Selamat pagi"',
          correctAnswer: 'Good morning',
          explanation: '"Selamat pagi" means "Good morning" in English.',
          order: 4,
          xpReward: 3,
        },
        {
          lessonId: lesson1.id,
          type: 'MULTIPLE_CHOICE',
          difficulty: 'EASY',
          question: 'Which greeting is used in the evening?',
          correctAnswer: 'Good evening',
          options: JSON.stringify(['Good morning', 'Good afternoon', 'Good evening', 'Good night']),
          explanation: '"Good evening" is used when you meet someone in the evening.',
          order: 5,
          xpReward: 2,
        },
      ],
    });

    // Lesson 2: Introducing Yourself
    const lesson2 = await prisma.lesson.create({
      data: {
        unitId: unit1.id,
        title: 'Introducing Yourself',
        description: 'My name is..., I am from...',
        order: 2,
        xpReward: 10,
        hearts: 5,
        isActive: true,
      },
    });

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: lesson2.id,
          type: 'MULTIPLE_CHOICE',
          difficulty: 'EASY',
          question: 'How do you introduce your name?',
          correctAnswer: 'My name is...',
          options: JSON.stringify(['My name is...', 'Your name is...', 'His name is...', 'Their name is...']),
          explanation: 'Use "My name is..." to introduce yourself.',
          order: 1,
          xpReward: 2,
        },
        {
          lessonId: lesson2.id,
          type: 'FILL_IN_BLANK',
          difficulty: 'EASY',
          question: 'Complete: I am _____ Indonesia (from)',
          correctAnswer: 'from',
          explanation: 'Use "from" to say where you are from.',
          order: 2,
          xpReward: 2,
        },
        {
          lessonId: lesson2.id,
          type: 'SENTENCE_BUILDING',
          difficulty: 'MEDIUM',
          question: 'Arrange: name / My / is / John',
          correctAnswer: 'My name is John',
          explanation: 'The correct order is: My name is John.',
          order: 3,
          xpReward: 3,
        },
      ],
    });

    // Unit 2: Numbers
    const unit2 = await prisma.unit.create({
      data: {
        courseId: englishCourse.id,
        title: 'Numbers & Counting',
        description: 'Learn numbers from 1 to 100',
        order: 2,
        icon: '🔢',
        xpReward: 20,
        isActive: true,
      },
    });

    const lesson3 = await prisma.lesson.create({
      data: {
        unitId: unit2.id,
        title: 'Numbers 1-10',
        description: 'Basic counting',
        order: 1,
        xpReward: 10,
        hearts: 5,
        isActive: true,
      },
    });

    await prisma.exercise.createMany({
      data: [
        {
          lessonId: lesson3.id,
          type: 'MULTIPLE_CHOICE',
          difficulty: 'EASY',
          question: 'What number is this: "five"?',
          correctAnswer: '5',
          options: JSON.stringify(['3', '4', '5', '6']),
          explanation: '"Five" is the number 5.',
          order: 1,
          xpReward: 2,
        },
        {
          lessonId: lesson3.id,
          type: 'TRANSLATION',
          difficulty: 'EASY',
          question: 'Translate to English: "tiga"',
          correctAnswer: 'three',
          explanation: '"Tiga" means "three" in English.',
          order: 2,
          xpReward: 2,
        },
      ],
    });

    console.log('✅ Created English Beginner course with units and lessons');
  }

  // Add some vocabulary
  await prisma.vocabulary.createMany({
    data: [
      {
        languageCode: 'EN',
        word: 'Hello',
        translation: 'Halo',
        pronunciation: '/həˈloʊ/',
        partOfSpeech: 'interjection',
        exampleSentence: 'Hello! How are you?',
        exampleTranslation: 'Halo! Apa kabar?',
        difficulty: 'EASY',
      },
      {
        languageCode: 'EN',
        word: 'Thank you',
        translation: 'Terima kasih',
        pronunciation: '/θæŋk juː/',
        partOfSpeech: 'phrase',
        exampleSentence: 'Thank you for your help.',
        exampleTranslation: 'Terima kasih atas bantuanmu.',
        difficulty: 'EASY',
      },
      {
        languageCode: 'EN',
        word: 'Good morning',
        translation: 'Selamat pagi',
        pronunciation: '/ɡʊd ˈmɔːrnɪŋ/',
        partOfSpeech: 'phrase',
        exampleSentence: 'Good morning! Did you sleep well?',
        exampleTranslation: 'Selamat pagi! Apakah kamu tidur nyenyak?',
        difficulty: 'EASY',
      },
      {
        languageCode: 'JA',
        word: 'こんにちは',
        translation: 'Halo',
        pronunciation: 'Konnichiwa',
        partOfSpeech: 'greeting',
        exampleSentence: 'こんにちは、元気ですか？',
        exampleTranslation: 'Halo, apa kabar?',
        difficulty: 'EASY',
      },
      {
        languageCode: 'JA',
        word: 'ありがとう',
        translation: 'Terima kasih',
        pronunciation: 'Arigatou',
        partOfSpeech: 'phrase',
        exampleSentence: 'ありがとうございます。',
        exampleTranslation: 'Terima kasih banyak.',
        difficulty: 'EASY',
      },
    ],
  });

  console.log('✅ Added vocabulary words');
  console.log('🎉 Language learning seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding languages:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
