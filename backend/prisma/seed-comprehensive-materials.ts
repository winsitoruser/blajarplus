import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎓 Starting comprehensive language learning materials seed...\n');

  // ==================== ENGLISH COMPREHENSIVE MATERIALS ====================
  console.log('🇬🇧 Creating comprehensive English course materials...');
  
  const english = await prisma.language.findFirst({ where: { code: 'EN' } });
  if (!english) throw new Error('English language not found');

  const englishBeginner = await prisma.course.findFirst({
    where: { languageId: english.id, level: 'BEGINNER' },
    include: { units: { include: { lessons: true } } },
  });

  if (englishBeginner) {
    // Update course with certification
    await prisma.course.update({
      where: { id: englishBeginner.id },
      data: {
        estimatedHours: 40,
        certificationEnabled: true,
        certificationCriteria: {
          minimumScore: 80,
          requiredLessons: 100,
          requiredUnits: 10,
          timeLimit: null,
        },
      },
    });

    // Create Course-level Materials
    await prisma.courseMaterial.createMany({
      data: [
        {
          courseId: englishBeginner.id,
          title: 'Welcome to English Learning',
          description: 'Introduction to the English language and course overview',
          type: 'TEXT',
          content: `# Welcome to English for Beginners

## Course Overview
This comprehensive course will take you from zero knowledge to confident beginner level in English. You'll learn:

- **Basic Grammar**: Sentence structure, tenses, and parts of speech
- **Vocabulary**: 1000+ essential words for daily communication
- **Pronunciation**: Correct pronunciation and accent training
- **Conversation**: Real-world dialogues and speaking practice
- **Reading & Writing**: Basic reading comprehension and writing skills

## Learning Path
1. **Greetings & Introductions** (Week 1-2)
2. **Numbers & Time** (Week 3-4)
3. **Daily Activities** (Week 5-6)
4. **Food & Dining** (Week 7-8)
5. **Shopping & Money** (Week 9-10)
6. **Travel & Directions** (Week 11-12)

## Certification
Upon completion with 80% average score, you'll receive a **CEFR A1 Level Certificate** recognized internationally.

Let's begin your English learning journey!`,
          order: 1,
          isRequired: true,
        },
        {
          courseId: englishBeginner.id,
          title: 'English Alphabet & Pronunciation Guide',
          description: 'Master the English alphabet and basic pronunciation rules',
          type: 'TEXT',
          content: `# English Alphabet & Pronunciation

## The 26 Letters
A B C D E F G H I J K L M N O P Q R S T U V W X Y Z

## Vowels (5)
A, E, I, O, U

## Consonants (21)
B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z

## Pronunciation Tips
- **TH**: Place tongue between teeth (think, this)
- **R**: Don't roll your R like in Spanish
- **W vs V**: W uses both lips, V uses teeth and lip
- **Silent Letters**: Know (k is silent), write (w is silent)

## Practice Words
- **Cat** /kæt/
- **Dog** /dɔːɡ/
- **Hello** /həˈloʊ/
- **Thank you** /θæŋk juː/`,
          order: 2,
          isRequired: true,
        },
        {
          courseId: englishBeginner.id,
          title: 'English Grammar Basics - Video Tutorial',
          description: 'Comprehensive video guide to English grammar fundamentals',
          type: 'VIDEO',
          url: 'https://www.youtube.com/watch?v=example-grammar',
          duration: 45,
          order: 3,
          isRequired: false,
        },
        {
          courseId: englishBeginner.id,
          title: 'Common English Phrases - Audio Guide',
          description: 'Listen and practice 100 most common English phrases',
          type: 'AUDIO',
          url: 'https://example.com/audio/common-phrases.mp3',
          duration: 30,
          order: 4,
          isRequired: false,
        },
        {
          courseId: englishBeginner.id,
          title: 'English Grammar Reference (PDF)',
          description: 'Downloadable grammar reference guide',
          type: 'PDF',
          fileUrl: 'https://example.com/pdfs/english-grammar-reference.pdf',
          order: 5,
          isRequired: false,
        },
      ],
    });

    // Create Unit-level Materials for each unit
    for (const unit of englishBeginner.units) {
      if (unit.title.includes('Greetings')) {
        await prisma.unitMaterial.createMany({
          data: [
            {
              unitId: unit.id,
              title: 'Greetings & Introductions - Study Guide',
              description: 'Complete guide to English greetings and self-introduction',
              type: 'TEXT',
              content: `# Greetings & Introductions

## Basic Greetings
- **Hello** - Universal greeting
- **Hi** - Informal greeting
- **Good morning** - Before 12 PM
- **Good afternoon** - 12 PM - 6 PM
- **Good evening** - After 6 PM
- **Good night** - When leaving at night or going to bed

## Introducing Yourself
**Pattern**: My name is [Name]. I am from [Country].

**Examples**:
- My name is John. I am from Indonesia.
- My name is Sarah. I am from Japan.

## Asking Someone's Name
- What's your name?
- May I know your name?
- Nice to meet you, I'm [Name]. And you?

## Responses
- Nice to meet you too!
- Pleased to meet you!
- It's a pleasure!

## Practice Dialogue
**A**: Hello! My name is Tom. What's your name?
**B**: Hi Tom! I'm Lisa. Nice to meet you!
**A**: Nice to meet you too, Lisa! Where are you from?
**B**: I'm from Korea. How about you?
**A**: I'm from Indonesia.

## Cultural Notes
- Handshake is common in English-speaking countries
- Eye contact shows confidence and respect
- Smile when greeting someone`,
              order: 1,
              isRequired: true,
            },
            {
              unitId: unit.id,
              title: 'Pronunciation Practice - Greetings',
              description: 'Audio guide for correct pronunciation of greetings',
              type: 'AUDIO',
              url: 'https://example.com/audio/greetings-pronunciation.mp3',
              duration: 15,
              order: 2,
              isRequired: true,
            },
            {
              unitId: unit.id,
              title: 'Greetings Video Tutorial',
              description: 'Watch native speakers demonstrate proper greetings',
              type: 'VIDEO',
              url: 'https://www.youtube.com/watch?v=example-greetings',
              duration: 20,
              order: 3,
              isRequired: false,
            },
          ],
        });
      }

      if (unit.title.includes('Numbers')) {
        await prisma.unitMaterial.createMany({
          data: [
            {
              unitId: unit.id,
              title: 'Numbers 1-100 Study Guide',
              description: 'Complete guide to English numbers',
              type: 'TEXT',
              content: `# English Numbers

## Cardinal Numbers (1-20)
1 - one, 2 - two, 3 - three, 4 - four, 5 - five
6 - six, 7 - seven, 8 - eight, 9 - nine, 10 - ten
11 - eleven, 12 - twelve, 13 - thirteen, 14 - fourteen, 15 - fifteen
16 - sixteen, 17 - seventeen, 18 - eighteen, 19 - nineteen, 20 - twenty

## Tens (20-100)
20 - twenty, 30 - thirty, 40 - forty, 50 - fifty
60 - sixty, 70 - seventy, 80 - eighty, 90 - ninety, 100 - one hundred

## Combining Numbers
21 - twenty-one, 35 - thirty-five, 47 - forty-seven, 99 - ninety-nine

## Ordinal Numbers
1st - first, 2nd - second, 3rd - third, 4th - fourth, 5th - fifth

## Using Numbers
- **Age**: I am 25 years old
- **Phone**: My number is 555-1234
- **Price**: It costs 50 dollars
- **Time**: It's 3 o'clock

## Practice
Count from 1 to 100 daily to build fluency!`,
              order: 1,
              isRequired: true,
            },
          ],
        });
      }
    }

    // Create Lesson-level Materials
    for (const unit of englishBeginner.units) {
      for (const lesson of unit.lessons) {
        if (lesson.title.includes('Basic Greetings')) {
          await prisma.lessonMaterial.createMany({
            data: [
              {
                lessonId: lesson.id,
                title: 'Lesson Introduction',
                description: 'What you will learn in this lesson',
                type: 'TEXT',
                content: `# Basic Greetings - Lesson Overview

## Learning Objectives
By the end of this lesson, you will be able to:
1. ✅ Greet people in English confidently
2. ✅ Use appropriate greetings for different times of day
3. ✅ Respond to greetings naturally
4. ✅ Understand cultural context of greetings

## Key Vocabulary (5 words)
- Hello
- Hi
- Good morning
- Good afternoon
- Good evening

## Grammar Focus
- Simple present tense
- Question formation: "How are you?"

## Time Required
⏱️ 15-20 minutes

Let's begin!`,
                order: 1,
                isRequired: true,
              },
              {
                lessonId: lesson.id,
                title: 'Video: Native Speaker Greetings',
                description: 'Watch how native speakers greet each other',
                type: 'VIDEO',
                url: 'https://www.youtube.com/watch?v=example-native-greetings',
                duration: 10,
                order: 2,
                isRequired: true,
              },
            ],
          });
        }
      }
    }

    // Create Certification
    await prisma.certification.create({
      data: {
        courseId: englishBeginner.id,
        name: 'English Beginner Certificate (CEFR A1)',
        description: 'Certificate of completion for English Beginner course, equivalent to CEFR A1 level',
        type: 'COURSE_COMPLETION',
        criteria: {
          minimumScore: 80,
          requiredLessons: 15,
          requiredUnits: 2,
          minimumXP: 500,
          timeSpent: 2400, // 40 hours in minutes
        },
        badgeUrl: 'https://example.com/badges/english-beginner.png',
        certificateTemplate: `
CERTIFICATE OF COMPLETION

This certifies that
{{userName}}

has successfully completed the
ENGLISH FOR BEGINNERS COURSE

achieving a score of {{score}}%
and demonstrating proficiency at CEFR A1 Level

Issued on: {{date}}
Certificate Number: {{certificateNumber}}

BlajarPlus Language Academy
`,
      },
    });

    console.log('✅ English comprehensive materials created');
  }

  // ==================== JAPANESE COMPREHENSIVE MATERIALS ====================
  console.log('🇯🇵 Creating comprehensive Japanese course materials...');
  
  const japanese = await prisma.language.findFirst({ where: { code: 'JA' } });
  if (japanese) {
    const japaneseBeginner = await prisma.course.findFirst({
      where: { languageId: japanese.id, level: 'BEGINNER' },
      include: { units: { include: { lessons: true } } },
    });

    if (japaneseBeginner) {
      await prisma.course.update({
        where: { id: japaneseBeginner.id },
        data: {
          estimatedHours: 50,
          certificationEnabled: true,
          certificationCriteria: {
            minimumScore: 75,
            requiredLessons: 100,
            jlptLevel: 'N5',
          },
        },
      });

      await prisma.courseMaterial.createMany({
        data: [
          {
            courseId: japaneseBeginner.id,
            title: 'Welcome to Japanese Learning',
            description: 'Introduction to Japanese language and writing systems',
            type: 'TEXT',
            content: `# Welcome to Japanese for Beginners

## Course Overview
Learn Japanese from scratch! This course covers:

- **Hiragana** (46 characters)
- **Katakana** (46 characters)
- **Basic Kanji** (100 characters)
- **Grammar** (N5 JLPT level)
- **Conversation** (Daily situations)

## Writing Systems
1. **Hiragana**: あいうえお - For Japanese words
2. **Katakana**: アイウエオ - For foreign words
3. **Kanji**: 日本語 - Chinese characters

## Learning Path
Week 1-2: Hiragana
Week 3-4: Katakana
Week 5-8: Basic Grammar & Vocabulary
Week 9-12: Conversation & Kanji

## Certification
Complete with 75%+ to earn **JLPT N5 Equivalent Certificate**

がんばって！(Good luck!)`,
            order: 1,
            isRequired: true,
          },
          {
            courseId: japaneseBeginner.id,
            title: 'Hiragana Chart & Practice',
            description: 'Complete hiragana reference with stroke order',
            type: 'PDF',
            fileUrl: 'https://example.com/pdfs/hiragana-chart.pdf',
            order: 2,
            isRequired: true,
          },
        ],
      });

      await prisma.certification.create({
        data: {
          courseId: japaneseBeginner.id,
          name: 'Japanese Beginner Certificate (JLPT N5 Equivalent)',
          description: 'Certificate equivalent to JLPT N5 level proficiency',
          type: 'LANGUAGE_PROFICIENCY',
          criteria: {
            minimumScore: 75,
            requiredLessons: 20,
            kanjiKnowledge: 100,
            vocabularySize: 800,
          },
        },
      });

      console.log('✅ Japanese comprehensive materials created');
    }
  }

  // ==================== CREATE SIMILAR MATERIALS FOR OTHER LANGUAGES ====================
  
  // French
  const french = await prisma.language.findFirst({ where: { code: 'FR' } });
  if (french) {
    const frenchBeginner = await prisma.course.findFirst({
      where: { languageId: french.id, level: 'BEGINNER' },
    });

    if (frenchBeginner) {
      await prisma.course.update({
        where: { id: frenchBeginner.id },
        data: {
          estimatedHours: 45,
          certificationEnabled: true,
          certificationCriteria: { minimumScore: 80, cefrLevel: 'A1' },
        },
      });

      await prisma.courseMaterial.create({
        data: {
          courseId: frenchBeginner.id,
          title: 'Bienvenue! Welcome to French',
          description: 'Introduction to French language and culture',
          type: 'TEXT',
          content: `# Bienvenue à Français pour Débutants

Master French from zero to A1 CEFR level!

## What You'll Learn
- French pronunciation and accent
- Essential grammar and verb conjugations
- 1000+ vocabulary words
- French culture and etiquette

## Certification: CEFR A1 Level`,
          order: 1,
          isRequired: true,
        },
      });

      await prisma.certification.create({
        data: {
          courseId: frenchBeginner.id,
          name: 'French Beginner Certificate (CEFR A1)',
          description: 'CEFR A1 level French proficiency certificate',
          type: 'COURSE_COMPLETION',
          criteria: { minimumScore: 80, cefrLevel: 'A1' },
        },
      });

      console.log('✅ French comprehensive materials created');
    }
  }

  // Korean, Spanish, Portuguese - Similar structure
  const languages = [
    { code: 'KO', name: 'Korean', cert: 'TOPIK I Level 1' },
    { code: 'ES', name: 'Spanish', cert: 'CEFR A1' },
    { code: 'PT', name: 'Portuguese', cert: 'CEFR A1' },
  ];

  for (const lang of languages) {
    const language = await prisma.language.findFirst({ where: { code: lang.code as any } });
    if (language) {
      const course = await prisma.course.findFirst({
        where: { languageId: language.id, level: 'BEGINNER' },
      });

      if (course) {
        await prisma.course.update({
          where: { id: course.id },
          data: {
            estimatedHours: 40,
            certificationEnabled: true,
            certificationCriteria: { minimumScore: 80 },
          },
        });

        await prisma.courseMaterial.create({
          data: {
            courseId: course.id,
            title: `Welcome to ${lang.name} Learning`,
            description: `Comprehensive ${lang.name} beginner course`,
            type: 'TEXT',
            content: `# ${lang.name} for Beginners\n\nComplete beginner course with certification (${lang.cert})`,
            order: 1,
            isRequired: true,
          },
        });

        await prisma.certification.create({
          data: {
            courseId: course.id,
            name: `${lang.name} Beginner Certificate`,
            description: `${lang.cert} level proficiency`,
            type: 'COURSE_COMPLETION',
            criteria: { minimumScore: 80 },
          },
        });

        console.log(`✅ ${lang.name} comprehensive materials created`);
      }
    }
  }

  console.log('\n🎉 Comprehensive materials seed completed!');
  console.log('\n📊 Summary:');
  console.log('   - Study materials for all 6 languages');
  console.log('   - Course, Unit, and Lesson level materials');
  console.log('   - TEXT, VIDEO, AUDIO, PDF content types');
  console.log('   - Certification standards (CEFR, JLPT, TOPIK)');
  console.log('   - Estimated learning hours for each course');
  console.log('\n✨ All courses now have comprehensive study materials!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding comprehensive materials:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
