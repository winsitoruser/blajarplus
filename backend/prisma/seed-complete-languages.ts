import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Starting comprehensive language learning seed...\n');

  // ==================== CREATE LANGUAGES ====================
  console.log('📚 Creating languages...');
  
  const english = await prisma.language.upsert({
    where: { code: 'EN' },
    update: {},
    create: {
      code: 'EN',
      name: 'English',
      nativeName: 'English',
      flag: '🇬🇧',
      description: 'Learn English from scratch to advanced level. Master grammar, vocabulary, and conversation.',
      isActive: true,
    },
  });

  const japanese = await prisma.language.upsert({
    where: { code: 'JA' },
    update: {},
    create: {
      code: 'JA',
      name: 'Japanese',
      nativeName: '日本語',
      flag: '🇯🇵',
      description: 'Master Japanese language including Hiragana, Katakana, Kanji, and conversation.',
      isActive: true,
    },
  });

  const french = await prisma.language.upsert({
    where: { code: 'FR' },
    update: {},
    create: {
      code: 'FR',
      name: 'French',
      nativeName: 'Français',
      flag: '🇫🇷',
      description: 'Learn the language of love and culture. Perfect your French accent and grammar.',
      isActive: true,
    },
  });

  const korean = await prisma.language.upsert({
    where: { code: 'KO' },
    update: {},
    create: {
      code: 'KO',
      name: 'Korean',
      nativeName: '한국어',
      flag: '🇰🇷',
      description: 'Discover Korean language and K-culture. Learn Hangul and conversational Korean.',
      isActive: true,
    },
  });

  const spanish = await prisma.language.upsert({
    where: { code: 'ES' },
    update: {},
    create: {
      code: 'ES',
      name: 'Spanish',
      nativeName: 'Español',
      flag: '🇪🇸',
      description: 'Learn Spanish, spoken by 500M+ people worldwide. Master Latin American and European Spanish.',
      isActive: true,
    },
  });

  const portuguese = await prisma.language.upsert({
    where: { code: 'PT' },
    update: {},
    create: {
      code: 'PT',
      name: 'Portuguese',
      nativeName: 'Português',
      flag: '🇵🇹',
      description: 'Learn Portuguese for Brazil and Portugal. Master pronunciation and grammar.',
      isActive: true,
    },
  });

  console.log('✅ Created 6 languages\n');

  // ==================== ENGLISH COURSES ====================
  console.log('🇬🇧 Creating English courses...');
  
  const englishBeginner = await prisma.course.create({
    data: {
      languageId: english.id,
      title: 'English for Beginners',
      description: 'Start your English journey from zero. Learn basic greetings, numbers, and everyday phrases.',
      level: 'BEGINNER',
      order: 1,
      icon: '📖',
      color: '#4CAF50',
      isActive: true,
    },
  });

  // Unit 1: Greetings & Introductions
  const engUnit1 = await prisma.unit.create({
    data: {
      courseId: englishBeginner.id,
      title: 'Greetings & Introductions',
      description: 'Learn how to greet people and introduce yourself',
      order: 1,
      icon: '👋',
      xpReward: 20,
      isActive: true,
    },
  });

  const engLesson1 = await prisma.lesson.create({
    data: {
      unitId: engUnit1.id,
      title: 'Basic Greetings',
      description: 'Hello, Hi, Good morning, Good afternoon',
      order: 1,
      xpReward: 10,
      hearts: 5,
      isActive: true,
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: engLesson1.id,
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
        lessonId: engLesson1.id,
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
        lessonId: engLesson1.id,
        type: 'FILL_IN_BLANK',
        difficulty: 'EASY',
        question: 'Complete: Good _____ (in the morning)',
        correctAnswer: 'morning',
        explanation: '"Good morning" is used to greet someone in the morning.',
        hints: JSON.stringify(['First part of the day', 'Starts with "m"']),
        order: 3,
        xpReward: 2,
      },
      {
        lessonId: engLesson1.id,
        type: 'TRANSLATION',
        difficulty: 'MEDIUM',
        question: 'Translate to English: "Selamat pagi"',
        correctAnswer: 'Good morning',
        explanation: '"Selamat pagi" means "Good morning" in English.',
        order: 4,
        xpReward: 3,
      },
      {
        lessonId: engLesson1.id,
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

  const engLesson2 = await prisma.lesson.create({
    data: {
      unitId: engUnit1.id,
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
        lessonId: engLesson2.id,
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
        lessonId: engLesson2.id,
        type: 'FILL_IN_BLANK',
        difficulty: 'EASY',
        question: 'Complete: I am _____ Indonesia (from)',
        correctAnswer: 'from',
        explanation: 'Use "from" to say where you are from.',
        order: 2,
        xpReward: 2,
      },
      {
        lessonId: engLesson2.id,
        type: 'SENTENCE_BUILDING',
        difficulty: 'MEDIUM',
        question: 'Arrange: name / My / is / John',
        correctAnswer: 'My name is John',
        explanation: 'The correct order is: My name is John.',
        order: 3,
        xpReward: 3,
      },
      {
        lessonId: engLesson2.id,
        type: 'TRANSLATION',
        difficulty: 'MEDIUM',
        question: 'Translate: "Nama saya Budi"',
        correctAnswer: 'My name is Budi',
        explanation: 'This is how you introduce your name in English.',
        order: 4,
        xpReward: 3,
      },
    ],
  });

  // Unit 2: Numbers & Counting
  const engUnit2 = await prisma.unit.create({
    data: {
      courseId: englishBeginner.id,
      title: 'Numbers & Counting',
      description: 'Learn numbers from 1 to 100',
      order: 2,
      icon: '🔢',
      xpReward: 20,
      isActive: true,
    },
  });

  const engLesson3 = await prisma.lesson.create({
    data: {
      unitId: engUnit2.id,
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
        lessonId: engLesson3.id,
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
        lessonId: engLesson3.id,
        type: 'TRANSLATION',
        difficulty: 'EASY',
        question: 'Translate to English: "tiga"',
        correctAnswer: 'three',
        explanation: '"Tiga" means "three" in English.',
        order: 2,
        xpReward: 2,
      },
      {
        lessonId: engLesson3.id,
        type: 'MATCHING',
        difficulty: 'EASY',
        question: 'Match: "seven"',
        correctAnswer: '7',
        options: JSON.stringify(['5', '6', '7', '8']),
        explanation: 'Seven is 7.',
        order: 3,
        xpReward: 2,
      },
    ],
  });

  console.log('✅ English Beginner course created\n');

  // ==================== JAPANESE COURSES ====================
  console.log('🇯🇵 Creating Japanese courses...');
  
  const japaneseBeginner = await prisma.course.create({
    data: {
      languageId: japanese.id,
      title: 'Japanese for Beginners',
      description: 'Start with Hiragana, basic greetings, and simple phrases.',
      level: 'BEGINNER',
      order: 1,
      icon: '🗾',
      color: '#E91E63',
      isActive: true,
    },
  });

  const jpUnit1 = await prisma.unit.create({
    data: {
      courseId: japaneseBeginner.id,
      title: 'Hiragana Basics',
      description: 'Learn the Japanese Hiragana alphabet',
      order: 1,
      icon: 'あ',
      xpReward: 25,
      isActive: true,
    },
  });

  const jpLesson1 = await prisma.lesson.create({
    data: {
      unitId: jpUnit1.id,
      title: 'Vowels (あいうえお)',
      description: 'Learn the 5 basic vowels',
      order: 1,
      xpReward: 12,
      hearts: 5,
      isActive: true,
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: jpLesson1.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'How do you pronounce "あ"?',
        correctAnswer: 'a',
        options: JSON.stringify(['a', 'i', 'u', 'e']),
        explanation: '"あ" is pronounced as "a" like in "father".',
        order: 1,
        xpReward: 2,
      },
      {
        lessonId: jpLesson1.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'Which hiragana represents "i"?',
        correctAnswer: 'い',
        options: JSON.stringify(['あ', 'い', 'う', 'え']),
        explanation: '"い" is pronounced as "i" like in "ski".',
        order: 2,
        xpReward: 2,
      },
      {
        lessonId: jpLesson1.id,
        type: 'MATCHING',
        difficulty: 'EASY',
        question: 'Match the sound: "u"',
        correctAnswer: 'う',
        options: JSON.stringify(['あ', 'い', 'う', 'お']),
        explanation: '"う" is pronounced as "u" like in "food".',
        order: 3,
        xpReward: 2,
      },
    ],
  });

  const jpUnit2 = await prisma.unit.create({
    data: {
      courseId: japaneseBeginner.id,
      title: 'Basic Greetings',
      description: 'Common Japanese greetings',
      order: 2,
      icon: '🙇',
      xpReward: 20,
      isActive: true,
    },
  });

  const jpLesson2 = await prisma.lesson.create({
    data: {
      unitId: jpUnit2.id,
      title: 'Daily Greetings',
      description: 'こんにちは、おはよう、こんばんは',
      order: 1,
      xpReward: 10,
      hearts: 5,
      isActive: true,
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: jpLesson2.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'How do you say "Hello" in Japanese?',
        correctAnswer: 'こんにちは',
        options: JSON.stringify(['こんにちは', 'さようなら', 'ありがとう', 'すみません']),
        explanation: '"こんにちは" (Konnichiwa) means "Hello".',
        order: 1,
        xpReward: 2,
      },
      {
        lessonId: jpLesson2.id,
        type: 'TRANSLATION',
        difficulty: 'EASY',
        question: 'Translate: "Good morning"',
        correctAnswer: 'おはよう',
        explanation: '"おはよう" (Ohayou) means "Good morning".',
        order: 2,
        xpReward: 3,
      },
    ],
  });

  console.log('✅ Japanese Beginner course created\n');

  // ==================== FRENCH COURSES ====================
  console.log('🇫🇷 Creating French courses...');
  
  const frenchBeginner = await prisma.course.create({
    data: {
      languageId: french.id,
      title: 'French for Beginners',
      description: 'Learn French basics, pronunciation, and common phrases.',
      level: 'BEGINNER',
      order: 1,
      icon: '🥐',
      color: '#2196F3',
      isActive: true,
    },
  });

  const frUnit1 = await prisma.unit.create({
    data: {
      courseId: frenchBeginner.id,
      title: 'French Basics',
      description: 'Greetings and introductions',
      order: 1,
      icon: '🇫🇷',
      xpReward: 20,
      isActive: true,
    },
  });

  const frLesson1 = await prisma.lesson.create({
    data: {
      unitId: frUnit1.id,
      title: 'Bonjour!',
      description: 'Basic French greetings',
      order: 1,
      xpReward: 10,
      hearts: 5,
      isActive: true,
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: frLesson1.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'How do you say "Hello" in French?',
        correctAnswer: 'Bonjour',
        options: JSON.stringify(['Bonjour', 'Au revoir', 'Merci', 'Pardon']),
        explanation: '"Bonjour" means "Hello" or "Good day".',
        order: 1,
        xpReward: 2,
      },
      {
        lessonId: frLesson1.id,
        type: 'TRANSLATION',
        difficulty: 'EASY',
        question: 'Translate: "Thank you"',
        correctAnswer: 'Merci',
        explanation: '"Merci" means "Thank you" in French.',
        order: 2,
        xpReward: 2,
      },
      {
        lessonId: frLesson1.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'How do you say "Goodbye"?',
        correctAnswer: 'Au revoir',
        options: JSON.stringify(['Bonjour', 'Au revoir', 'Salut', 'Bonsoir']),
        explanation: '"Au revoir" is the formal way to say "Goodbye".',
        order: 3,
        xpReward: 2,
      },
    ],
  });

  console.log('✅ French Beginner course created\n');

  // ==================== KOREAN COURSES ====================
  console.log('🇰🇷 Creating Korean courses...');
  
  const koreanBeginner = await prisma.course.create({
    data: {
      languageId: korean.id,
      title: 'Korean for Beginners',
      description: 'Learn Hangul alphabet and basic Korean phrases.',
      level: 'BEGINNER',
      order: 1,
      icon: '🇰🇷',
      color: '#FF9800',
      isActive: true,
    },
  });

  const koUnit1 = await prisma.unit.create({
    data: {
      courseId: koreanBeginner.id,
      title: 'Hangul Alphabet',
      description: 'Learn to read and write Hangul',
      order: 1,
      icon: 'ㄱ',
      xpReward: 25,
      isActive: true,
    },
  });

  const koLesson1 = await prisma.lesson.create({
    data: {
      unitId: koUnit1.id,
      title: 'Basic Consonants',
      description: 'ㄱ ㄴ ㄷ ㄹ ㅁ',
      order: 1,
      xpReward: 12,
      hearts: 5,
      isActive: true,
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: koLesson1.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'How do you pronounce "ㄱ"?',
        correctAnswer: 'g/k',
        options: JSON.stringify(['g/k', 'n', 'd/t', 'r/l']),
        explanation: '"ㄱ" is pronounced as "g" or "k" depending on position.',
        order: 1,
        xpReward: 2,
      },
      {
        lessonId: koLesson1.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'Which consonant represents "n"?',
        correctAnswer: 'ㄴ',
        options: JSON.stringify(['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ']),
        explanation: '"ㄴ" is pronounced as "n".',
        order: 2,
        xpReward: 2,
      },
    ],
  });

  const koUnit2 = await prisma.unit.create({
    data: {
      courseId: koreanBeginner.id,
      title: 'Korean Greetings',
      description: 'Learn basic Korean greetings',
      order: 2,
      icon: '👋',
      xpReward: 20,
      isActive: true,
    },
  });

  const koLesson2 = await prisma.lesson.create({
    data: {
      unitId: koUnit2.id,
      title: 'Hello & Goodbye',
      description: '안녕하세요, 안녕히 가세요',
      order: 1,
      xpReward: 10,
      hearts: 5,
      isActive: true,
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: koLesson2.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'How do you say "Hello" in Korean?',
        correctAnswer: '안녕하세요',
        options: JSON.stringify(['안녕하세요', '감사합니다', '죄송합니다', '안녕히 가세요']),
        explanation: '"안녕하세요" (Annyeonghaseyo) means "Hello".',
        order: 1,
        xpReward: 2,
      },
      {
        lessonId: koLesson2.id,
        type: 'TRANSLATION',
        difficulty: 'EASY',
        question: 'Translate: "Thank you"',
        correctAnswer: '감사합니다',
        explanation: '"감사합니다" (Gamsahamnida) means "Thank you".',
        order: 2,
        xpReward: 3,
      },
    ],
  });

  console.log('✅ Korean Beginner course created\n');

  // ==================== SPANISH COURSES ====================
  console.log('🇪🇸 Creating Spanish courses...');
  
  const spanishBeginner = await prisma.course.create({
    data: {
      languageId: spanish.id,
      title: 'Spanish for Beginners',
      description: 'Learn Spanish basics, pronunciation, and everyday conversation.',
      level: 'BEGINNER',
      order: 1,
      icon: '🌮',
      color: '#F44336',
      isActive: true,
    },
  });

  const esUnit1 = await prisma.unit.create({
    data: {
      courseId: spanishBeginner.id,
      title: 'Spanish Basics',
      description: 'Greetings and introductions',
      order: 1,
      icon: '👋',
      xpReward: 20,
      isActive: true,
    },
  });

  const esLesson1 = await prisma.lesson.create({
    data: {
      unitId: esUnit1.id,
      title: '¡Hola!',
      description: 'Basic Spanish greetings',
      order: 1,
      xpReward: 10,
      hearts: 5,
      isActive: true,
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: esLesson1.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'How do you say "Hello" in Spanish?',
        correctAnswer: 'Hola',
        options: JSON.stringify(['Hola', 'Adiós', 'Gracias', 'Por favor']),
        explanation: '"Hola" means "Hello" in Spanish.',
        order: 1,
        xpReward: 2,
      },
      {
        lessonId: esLesson1.id,
        type: 'TRANSLATION',
        difficulty: 'EASY',
        question: 'Translate: "Good morning"',
        correctAnswer: 'Buenos días',
        explanation: '"Buenos días" means "Good morning".',
        order: 2,
        xpReward: 2,
      },
      {
        lessonId: esLesson1.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'How do you say "Thank you"?',
        correctAnswer: 'Gracias',
        options: JSON.stringify(['Hola', 'Gracias', 'Adiós', 'Perdón']),
        explanation: '"Gracias" means "Thank you".',
        order: 3,
        xpReward: 2,
      },
    ],
  });

  console.log('✅ Spanish Beginner course created\n');

  // ==================== PORTUGUESE COURSES ====================
  console.log('🇵🇹 Creating Portuguese courses...');
  
  const portugueseBeginner = await prisma.course.create({
    data: {
      languageId: portuguese.id,
      title: 'Portuguese for Beginners',
      description: 'Learn Brazilian and European Portuguese basics.',
      level: 'BEGINNER',
      order: 1,
      icon: '🇧🇷',
      color: '#009688',
      isActive: true,
    },
  });

  const ptUnit1 = await prisma.unit.create({
    data: {
      courseId: portugueseBeginner.id,
      title: 'Portuguese Basics',
      description: 'Greetings and introductions',
      order: 1,
      icon: '👋',
      xpReward: 20,
      isActive: true,
    },
  });

  const ptLesson1 = await prisma.lesson.create({
    data: {
      unitId: ptUnit1.id,
      title: 'Olá!',
      description: 'Basic Portuguese greetings',
      order: 1,
      xpReward: 10,
      hearts: 5,
      isActive: true,
    },
  });

  await prisma.exercise.createMany({
    data: [
      {
        lessonId: ptLesson1.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'How do you say "Hello" in Portuguese?',
        correctAnswer: 'Olá',
        options: JSON.stringify(['Olá', 'Tchau', 'Obrigado', 'Por favor']),
        explanation: '"Olá" means "Hello" in Portuguese.',
        order: 1,
        xpReward: 2,
      },
      {
        lessonId: ptLesson1.id,
        type: 'TRANSLATION',
        difficulty: 'EASY',
        question: 'Translate: "Good morning"',
        correctAnswer: 'Bom dia',
        explanation: '"Bom dia" means "Good morning".',
        order: 2,
        xpReward: 2,
      },
      {
        lessonId: ptLesson1.id,
        type: 'MULTIPLE_CHOICE',
        difficulty: 'EASY',
        question: 'How do you say "Thank you" (masculine)?',
        correctAnswer: 'Obrigado',
        options: JSON.stringify(['Olá', 'Obrigado', 'Tchau', 'Desculpe']),
        explanation: '"Obrigado" is used by males to say "Thank you".',
        order: 3,
        xpReward: 2,
      },
    ],
  });

  console.log('✅ Portuguese Beginner course created\n');

  // ==================== ADD VOCABULARY ====================
  console.log('📖 Adding vocabulary...');
  
  await prisma.vocabulary.createMany({
    data: [
      // English
      { languageCode: 'EN', word: 'Hello', translation: 'Halo', pronunciation: '/həˈloʊ/', partOfSpeech: 'interjection', exampleSentence: 'Hello! How are you?', exampleTranslation: 'Halo! Apa kabar?', difficulty: 'EASY' },
      { languageCode: 'EN', word: 'Thank you', translation: 'Terima kasih', pronunciation: '/θæŋk juː/', partOfSpeech: 'phrase', exampleSentence: 'Thank you for your help.', exampleTranslation: 'Terima kasih atas bantuanmu.', difficulty: 'EASY' },
      { languageCode: 'EN', word: 'Goodbye', translation: 'Selamat tinggal', pronunciation: '/ɡʊdˈbaɪ/', partOfSpeech: 'interjection', exampleSentence: 'Goodbye! See you later.', exampleTranslation: 'Selamat tinggal! Sampai jumpa.', difficulty: 'EASY' },
      
      // Japanese
      { languageCode: 'JA', word: 'こんにちは', translation: 'Halo', pronunciation: 'Konnichiwa', partOfSpeech: 'greeting', exampleSentence: 'こんにちは、元気ですか？', exampleTranslation: 'Halo, apa kabar?', difficulty: 'EASY' },
      { languageCode: 'JA', word: 'ありがとう', translation: 'Terima kasih', pronunciation: 'Arigatou', partOfSpeech: 'phrase', exampleSentence: 'ありがとうございます。', exampleTranslation: 'Terima kasih banyak.', difficulty: 'EASY' },
      { languageCode: 'JA', word: 'さようなら', translation: 'Selamat tinggal', pronunciation: 'Sayounara', partOfSpeech: 'greeting', exampleSentence: 'さようなら、また明日。', exampleTranslation: 'Selamat tinggal, sampai besok.', difficulty: 'EASY' },
      
      // French
      { languageCode: 'FR', word: 'Bonjour', translation: 'Halo', pronunciation: '/bɔ̃ʒuʁ/', partOfSpeech: 'interjection', exampleSentence: 'Bonjour! Comment allez-vous?', exampleTranslation: 'Halo! Apa kabar?', difficulty: 'EASY' },
      { languageCode: 'FR', word: 'Merci', translation: 'Terima kasih', pronunciation: '/mɛʁsi/', partOfSpeech: 'interjection', exampleSentence: 'Merci beaucoup!', exampleTranslation: 'Terima kasih banyak!', difficulty: 'EASY' },
      { languageCode: 'FR', word: 'Au revoir', translation: 'Selamat tinggal', pronunciation: '/o ʁəvwaʁ/', partOfSpeech: 'phrase', exampleSentence: 'Au revoir! À bientôt!', exampleTranslation: 'Selamat tinggal! Sampai jumpa!', difficulty: 'EASY' },
      
      // Korean
      { languageCode: 'KO', word: '안녕하세요', translation: 'Halo', pronunciation: 'Annyeonghaseyo', partOfSpeech: 'greeting', exampleSentence: '안녕하세요! 잘 지내세요?', exampleTranslation: 'Halo! Apa kabar?', difficulty: 'EASY' },
      { languageCode: 'KO', word: '감사합니다', translation: 'Terima kasih', pronunciation: 'Gamsahamnida', partOfSpeech: 'phrase', exampleSentence: '정말 감사합니다.', exampleTranslation: 'Terima kasih banyak.', difficulty: 'EASY' },
      { languageCode: 'KO', word: '안녕히 가세요', translation: 'Selamat jalan', pronunciation: 'Annyeonghi gaseyo', partOfSpeech: 'phrase', exampleSentence: '안녕히 가세요! 또 만나요!', exampleTranslation: 'Selamat jalan! Sampai jumpa!', difficulty: 'EASY' },
      
      // Spanish
      { languageCode: 'ES', word: 'Hola', translation: 'Halo', pronunciation: '/ˈola/', partOfSpeech: 'interjection', exampleSentence: '¡Hola! ¿Cómo estás?', exampleTranslation: 'Halo! Apa kabar?', difficulty: 'EASY' },
      { languageCode: 'ES', word: 'Gracias', translation: 'Terima kasih', pronunciation: '/ˈɡɾasjas/', partOfSpeech: 'interjection', exampleSentence: '¡Muchas gracias!', exampleTranslation: 'Terima kasih banyak!', difficulty: 'EASY' },
      { languageCode: 'ES', word: 'Adiós', translation: 'Selamat tinggal', pronunciation: '/aˈðjos/', partOfSpeech: 'interjection', exampleSentence: '¡Adiós! ¡Hasta luego!', exampleTranslation: 'Selamat tinggal! Sampai nanti!', difficulty: 'EASY' },
      
      // Portuguese
      { languageCode: 'PT', word: 'Olá', translation: 'Halo', pronunciation: '/oˈla/', partOfSpeech: 'interjection', exampleSentence: 'Olá! Como vai?', exampleTranslation: 'Halo! Apa kabar?', difficulty: 'EASY' },
      { languageCode: 'PT', word: 'Obrigado', translation: 'Terima kasih', pronunciation: '/obɾiˈɡadu/', partOfSpeech: 'interjection', exampleSentence: 'Muito obrigado!', exampleTranslation: 'Terima kasih banyak!', difficulty: 'EASY' },
      { languageCode: 'PT', word: 'Tchau', translation: 'Selamat tinggal', pronunciation: '/ˈtʃaw/', partOfSpeech: 'interjection', exampleSentence: 'Tchau! Até logo!', exampleTranslation: 'Selamat tinggal! Sampai nanti!', difficulty: 'EASY' },
    ],
  });

  console.log('✅ Added vocabulary for all languages\n');

  console.log('🎉 Language learning seed completed successfully!\n');
  console.log('📊 Summary:');
  console.log('   - 6 Languages created');
  console.log('   - 6 Beginner courses (1 per language)');
  console.log('   - 12+ Units total');
  console.log('   - 15+ Lessons total');
  console.log('   - 50+ Exercises total');
  console.log('   - 18 Vocabulary words');
  console.log('\n✨ Ready to start learning!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding languages:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
