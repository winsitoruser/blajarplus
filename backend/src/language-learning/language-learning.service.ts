import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GamificationService } from '../gamification/gamification.service';
import { LanguageCode, ProficiencyLevel, ExerciseType } from '@prisma/client';

@Injectable()
export class LanguageLearningService {
  constructor(
    private prisma: PrismaService,
    private gamificationService: GamificationService,
  ) {}

  // ==================== LANGUAGES ====================
  
  async getAllLanguages() {
    return this.prisma.language.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { courses: true },
        },
      },
    });
  }

  async getLanguageById(id: string) {
    const language = await this.prisma.language.findUnique({
      where: { id },
      include: {
        courses: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            _count: {
              select: { units: true },
            },
          },
        },
      },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    return language;
  }

  // ==================== COURSES ====================

  async getCoursesByLanguage(languageId: string, userId?: string) {
    const courses = await this.prisma.course.findMany({
      where: { 
        languageId,
        isActive: true,
      },
      orderBy: { order: 'asc' },
      include: {
        units: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            _count: {
              select: { lessons: true },
            },
          },
        },
      },
    });

    if (userId) {
      // Include user progress
      const coursesWithProgress = await Promise.all(
        courses.map(async (course) => {
          const progress = await this.prisma.userCourseProgress.findUnique({
            where: {
              userId_courseId: { userId, courseId: course.id },
            },
          });

          return {
            ...course,
            userProgress: progress,
          };
        })
      );

      return coursesWithProgress;
    }

    return courses;
  }

  async getCourseById(id: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        language: true,
        units: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              where: { isActive: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (userId) {
      const progress = await this.prisma.userCourseProgress.findUnique({
        where: {
          userId_courseId: { userId, courseId: id },
        },
      });

      return { ...course, userProgress: progress };
    }

    return course;
  }

  // ==================== UNITS ====================

  async getUnitById(id: string, userId?: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id },
      include: {
        course: {
          include: { language: true },
        },
        lessons: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    if (userId) {
      const progress = await this.prisma.userUnitProgress.findUnique({
        where: {
          userId_unitId: { userId, unitId: id },
        },
      });

      // Get lesson progress for each lesson
      const lessonsWithProgress = await Promise.all(
        unit.lessons.map(async (lesson) => {
          const lessonProgress = await this.prisma.userLessonProgress.findUnique({
            where: {
              userId_lessonId: { userId, lessonId: lesson.id },
            },
          });

          return {
            ...lesson,
            userProgress: lessonProgress,
          };
        })
      );

      return {
        ...unit,
        lessons: lessonsWithProgress,
        userProgress: progress,
      };
    }

    return unit;
  }

  // ==================== LESSONS ====================

  async getLessonById(id: string, userId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        unit: {
          include: {
            course: {
              include: { language: true },
            },
          },
        },
        exercises: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            type: true,
            difficulty: true,
            question: true,
            questionAudio: true,
            questionImage: true,
            correctAnswer: true,
            options: true,
            explanation: true,
            hints: true,
            order: true,
            xpReward: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (userId) {
      const progress = await this.prisma.userLessonProgress.findUnique({
        where: {
          userId_lessonId: { userId, lessonId: id },
        },
      });

      return { ...lesson, userProgress: progress };
    }

    return lesson;
  }

  async startLesson(userId: string, lessonId: string) {
    // Check if lesson exists
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { unit: true },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Create or get lesson progress
    const progress = await this.prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      create: {
        userId,
        lessonId,
        heartsRemaining: lesson.hearts,
        attempts: 1,
      },
      update: {
        attempts: { increment: 1 },
        heartsRemaining: lesson.hearts, // Reset hearts
      },
    });

    // Unlock unit if not already unlocked
    await this.prisma.userUnitProgress.upsert({
      where: {
        userId_unitId: { userId, unitId: lesson.unitId },
      },
      create: {
        userId,
        unitId: lesson.unitId,
        isUnlocked: true,
      },
      update: {
        isUnlocked: true,
      },
    });

    return progress;
  }

  // ==================== EXERCISES ====================

  async submitAnswer(
    userId: string,
    exerciseId: string,
    userAnswer: string,
    timeSpent: number = 0,
    hintsUsed: number = 0,
  ) {
    // Get exercise with correct answer
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: {
        lesson: {
          include: { unit: { include: { course: true } } },
        },
      },
    });

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    // Check if answer is correct
    const isCorrect = this.checkAnswer(exercise.correctAnswer, userAnswer, exercise.type);

    // Calculate XP earned
    let xpEarned = 0;
    if (isCorrect) {
      xpEarned = exercise.xpReward;
      // Reduce XP if hints were used
      if (hintsUsed > 0) {
        xpEarned = Math.max(1, Math.floor(xpEarned * (1 - hintsUsed * 0.2)));
      }
    }

    // Save answer
    const answer = await this.prisma.userExerciseAnswer.create({
      data: {
        userId,
        exerciseId,
        userAnswer,
        isCorrect,
        timeSpent,
        hintsUsed,
        xpEarned,
      },
    });

    // Update lesson progress
    const lessonProgress = await this.prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId: exercise.lessonId },
      },
    });

    if (lessonProgress) {
      if (!isCorrect) {
        // Decrease hearts
        await this.prisma.userLessonProgress.update({
          where: { id: lessonProgress.id },
          data: {
            heartsRemaining: Math.max(0, lessonProgress.heartsRemaining - 1),
          },
        });
      }

      // Add XP to lesson progress
      if (xpEarned > 0) {
        await this.prisma.userLessonProgress.update({
          where: { id: lessonProgress.id },
          data: {
            totalXpEarned: { increment: xpEarned },
          },
        });
      }
    }

    // Award XP through gamification system
    if (xpEarned > 0) {
      await this.gamificationService.addXp(userId, xpEarned, 'language_exercise');
      
      // Update language progress
      await this.updateLanguageProgress(userId, exercise.lesson.unit.course.languageId, xpEarned);
    }

    return {
      ...answer,
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation,
      xpEarned,
    };
  }

  private checkAnswer(correctAnswer: string, userAnswer: string, type: ExerciseType): boolean {
    const normalize = (str: string) => str.toLowerCase().trim();
    
    switch (type) {
      case 'MULTIPLE_CHOICE':
      case 'MATCHING':
        return normalize(correctAnswer) === normalize(userAnswer);
      
      case 'FILL_IN_BLANK':
      case 'TRANSLATION':
        // Allow some flexibility for translations
        const correct = normalize(correctAnswer);
        const user = normalize(userAnswer);
        return correct === user || correct.includes(user) || user.includes(correct);
      
      case 'SENTENCE_BUILDING':
        // Check if words match (order might vary)
        const correctWords = normalize(correctAnswer).split(/\s+/).sort();
        const userWords = normalize(userAnswer).split(/\s+/).sort();
        return JSON.stringify(correctWords) === JSON.stringify(userWords);
      
      default:
        return normalize(correctAnswer) === normalize(userAnswer);
    }
  }

  async completeLesson(userId: string, lessonId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        exercises: true,
        unit: { include: { course: true } },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Get all user answers for this lesson
    const answers = await this.prisma.userExerciseAnswer.findMany({
      where: {
        userId,
        exerciseId: { in: lesson.exercises.map(e => e.id) },
      },
    });

    // Calculate score
    const totalExercises = lesson.exercises.length;
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / totalExercises) * 100);

    // Update lesson progress
    const progress = await this.prisma.userLessonProgress.update({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      data: {
        isCompleted: true,
        completedAt: new Date(),
        score,
        totalXpEarned: { increment: lesson.xpReward },
      },
    });

    // Award lesson completion XP
    await this.gamificationService.addXp(userId, lesson.xpReward, 'lesson_complete');
    await this.updateLanguageProgress(userId, lesson.unit.course.languageId, lesson.xpReward);

    // Check if unit is completed
    await this.checkUnitCompletion(userId, lesson.unitId);

    // Update daily goal
    await this.updateDailyGoal(userId, lesson.xpReward, 1);

    return progress;
  }

  private async checkUnitCompletion(userId: string, unitId: string) {
    const unit = await this.prisma.unit.findUnique({
      where: { id: unitId },
      include: { lessons: true, course: true },
    });

    if (!unit) return;

    // Check if all lessons are completed
    const lessonProgress = await this.prisma.userLessonProgress.findMany({
      where: {
        userId,
        lessonId: { in: unit.lessons.map(l => l.id) },
      },
    });

    const allCompleted = unit.lessons.every(lesson =>
      lessonProgress.some(p => p.lessonId === lesson.id && p.isCompleted)
    );

    if (allCompleted) {
      // Calculate stars based on average score
      const avgScore = lessonProgress.reduce((sum, p) => sum + p.score, 0) / lessonProgress.length;
      const stars = avgScore >= 90 ? 3 : avgScore >= 70 ? 2 : 1;

      await this.prisma.userUnitProgress.update({
        where: {
          userId_unitId: { userId, unitId },
        },
        data: {
          isCompleted: true,
          completedAt: new Date(),
          stars,
          totalXpEarned: { increment: unit.xpReward },
        },
      });

      // Award unit completion XP
      await this.gamificationService.addXp(userId, unit.xpReward, 'unit_complete');
      await this.updateLanguageProgress(userId, unit.course.languageId, unit.xpReward);

      // Check if course is completed
      await this.checkCourseCompletion(userId, unit.courseId);
    }
  }

  private async checkCourseCompletion(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { units: true },
    });

    if (!course) return;

    const unitProgress = await this.prisma.userUnitProgress.findMany({
      where: {
        userId,
        unitId: { in: course.units.map(u => u.id) },
      },
    });

    const allCompleted = course.units.every(unit =>
      unitProgress.some(p => p.unitId === unit.id && p.isCompleted)
    );

    if (allCompleted) {
      const totalXp = unitProgress.reduce((sum, p) => sum + p.totalXpEarned, 0);

      await this.prisma.userCourseProgress.upsert({
        where: {
          userId_courseId: { userId, courseId },
        },
        create: {
          userId,
          courseId,
          isCompleted: true,
          completedAt: new Date(),
          totalXpEarned: totalXp,
        },
        update: {
          isCompleted: true,
          completedAt: new Date(),
          totalXpEarned: totalXp,
        },
      });

      // Award achievement for course completion
      await this.gamificationService.addXp(userId, 100, 'course_complete');
    }
  }

  private async updateLanguageProgress(userId: string, languageId: string, xpEarned: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const progress = await this.prisma.userLanguageProgress.upsert({
      where: {
        userId_languageId: { userId, languageId },
      },
      create: {
        userId,
        languageId,
        totalXp: xpEarned,
        streak: 1,
        lastPracticeAt: new Date(),
      },
      update: {
        totalXp: { increment: xpEarned },
        lastPracticeAt: new Date(),
      },
    });

    // Update streak
    const lastPractice = new Date(progress.lastPracticeAt || 0);
    lastPractice.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Continue streak
      await this.prisma.userLanguageProgress.update({
        where: { id: progress.id },
        data: { streak: { increment: 1 } },
      });
    } else if (daysDiff > 1) {
      // Reset streak
      await this.prisma.userLanguageProgress.update({
        where: { id: progress.id },
        data: { streak: 1 },
      });
    }

    return progress;
  }

  private async updateDailyGoal(userId: string, xpEarned: number, lessonsCompleted: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await this.prisma.userDailyGoal.upsert({
      where: {
        userId_date: { userId, date: today },
      },
      create: {
        userId,
        date: today,
        xpEarned,
        lessonsCompleted,
      },
      update: {
        xpEarned: { increment: xpEarned },
        lessonsCompleted: { increment: lessonsCompleted },
      },
    });

    // Check if goal is completed
    const goal = await this.prisma.userDailyGoal.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
    });

    if (goal && goal.xpEarned >= goal.xpGoal && goal.lessonsCompleted >= goal.lessonsGoal) {
      await this.prisma.userDailyGoal.update({
        where: { id: goal.id },
        data: { isCompleted: true },
      });
    }
  }

  // ==================== USER PROGRESS ====================

  async getUserProgress(userId: string) {
    const languageProgress = await this.prisma.userLanguageProgress.findMany({
      where: { userId },
      include: {
        language: true,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyGoal = await this.prisma.userDailyGoal.findUnique({
      where: {
        userId_date: { userId, date: today },
      },
    });

    return {
      languages: languageProgress,
      dailyGoal: dailyGoal || {
        xpGoal: 20,
        xpEarned: 0,
        lessonsGoal: 3,
        lessonsCompleted: 0,
        isCompleted: false,
      },
    };
  }

  async getVocabulary(languageCode: LanguageCode, difficulty?: string) {
    return this.prisma.vocabulary.findMany({
      where: {
        languageCode,
        ...(difficulty && { difficulty: difficulty as any }),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async getVocabularyByLanguage(languageCode: string, difficulty?: string) {
    const where: any = { languageCode };
    if (difficulty) {
      where.difficulty = difficulty;
    }
    return this.prisma.vocabulary.findMany({
      where,
      orderBy: { word: 'asc' },
    });
  }

  // ==================== MATERIALS ====================

  async getCourseMaterials(courseId: string, userId?: string) {
    const materials = await this.prisma.courseMaterial.findMany({
      where: { courseId, isActive: true },
      orderBy: { order: 'asc' },
    });
    if (userId) {
      const materialsWithProgress = await Promise.all(
        materials.map(async (material) => {
          const progress = await this.prisma.userMaterialProgress.findFirst({
            where: { userId, courseMaterialId: material.id },
          });
          return { ...material, userProgress: progress };
        })
      );
      return materialsWithProgress;
    }
    return materials;
  }

  async getUnitMaterials(unitId: string, userId?: string) {
    const materials = await this.prisma.unitMaterial.findMany({
      where: { unitId, isActive: true },
      orderBy: { order: 'asc' },
    });
    if (userId) {
      const materialsWithProgress = await Promise.all(
        materials.map(async (material) => {
          const progress = await this.prisma.userMaterialProgress.findFirst({
            where: { userId, unitMaterialId: material.id },
          });
          return { ...material, userProgress: progress };
        })
      );
      return materialsWithProgress;
    }
    return materials;
  }

  async getLessonMaterials(lessonId: string, userId?: string) {
    const materials = await this.prisma.lessonMaterial.findMany({
      where: { lessonId, isActive: true },
      orderBy: { order: 'asc' },
    });
    if (userId) {
      const materialsWithProgress = await Promise.all(
        materials.map(async (material) => {
          const progress = await this.prisma.userMaterialProgress.findFirst({
            where: { userId, lessonMaterialId: material.id },
          });
          return { ...material, userProgress: progress };
        })
      );
      return materialsWithProgress;
    }
    return materials;
  }

  async updateMaterialProgress(userId: string, materialId: string, materialType: 'course' | 'unit' | 'lesson', progress: number, timeSpent: number) {
    const data: any = { userId, progress, timeSpent, lastAccessedAt: new Date() };
    if (materialType === 'course') data.courseMaterialId = materialId;
    else if (materialType === 'unit') data.unitMaterialId = materialId;
    else data.lessonMaterialId = materialId;
    if (progress >= 100) {
      data.isCompleted = true;
      data.completedAt = new Date();
    }
    const existing = await this.prisma.userMaterialProgress.findFirst({
      where: {
        userId,
        ...(materialType === 'course' && { courseMaterialId: materialId }),
        ...(materialType === 'unit' && { unitMaterialId: materialId }),
        ...(materialType === 'lesson' && { lessonMaterialId: materialId }),
      },
    });
    if (existing) {
      return this.prisma.userMaterialProgress.update({ where: { id: existing.id }, data });
    }
    return this.prisma.userMaterialProgress.create({ data });
  }

  // ==================== CERTIFICATIONS ====================

  async getCourseCertifications(courseId: string) {
    return this.prisma.certification.findMany({ where: { courseId, isActive: true } });
  }

  async checkCertificationEligibility(userId: string, certificationId: string) {
    const certification = await this.prisma.certification.findUnique({
      where: { id: certificationId },
      include: { course: true },
    });
    if (!certification) throw new NotFoundException('Certification not found');
    const criteria = certification.criteria as any;
    const courseProgress = await this.prisma.userCourseProgress.findUnique({
      where: { userId_courseId: { userId, courseId: certification.courseId } },
    });
    if (!courseProgress) return { eligible: false, reason: 'Course not started' };
    const checks = {
      minimumScore: courseProgress.averageScore >= (criteria.minimumScore || 0),
      requiredLessons: courseProgress.completedLessons >= (criteria.requiredLessons || 0),
      minimumXP: courseProgress.totalXpEarned >= (criteria.minimumXP || 0),
    };
    return {
      eligible: Object.values(checks).every(v => v),
      checks,
      currentProgress: { score: courseProgress.averageScore, lessonsCompleted: courseProgress.completedLessons, xpEarned: courseProgress.totalXpEarned },
      requirements: criteria,
    };
  }

  async issueCertification(userId: string, certificationId: string) {
    const eligibility = await this.checkCertificationEligibility(userId, certificationId);
    if (!eligibility.eligible) throw new BadRequestException('User is not eligible for this certification');
    const certification = await this.prisma.certification.findUnique({ where: { id: certificationId } });
    const certificateNumber = `CERT-${Date.now()}-${userId.substring(0, 8).toUpperCase()}`;
    const userCert = await this.prisma.userCertification.create({
      data: { userId, certificationId, certificateNumber, score: eligibility.currentProgress?.score },
      include: { certification: true },
    });
    await this.gamificationService.addXp(userId, 100, 'certification_earned', `Earned ${certification?.name}`);
    return userCert;
  }

  async getUserCertifications(userId: string) {
    return this.prisma.userCertification.findMany({
      where: { userId, isRevoked: false },
      include: { certification: { include: { course: { include: { language: true } } } } },
      orderBy: { earnedAt: 'desc' },
    });
  }

  // ==================== LEARNING PATHS ====================

  async createLearningPath(userId: string, courseId: string, targetDate?: Date, hoursPerWeek: number = 5) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { units: { include: { lessons: true } } },
    });
    if (!course) throw new NotFoundException('Course not found');
    const learningPath = await this.prisma.learningPath.create({
      data: { userId, courseId, targetDate, hoursPerWeek, status: 'NOT_STARTED' },
    });
    const milestones = [];
    const weeksNeeded = Math.ceil((course.estimatedHours || 40) / hoursPerWeek);
    const weeksBetweenMilestones = Math.ceil(weeksNeeded / course.units.length);
    for (let i = 0; i < course.units.length; i++) {
      const unit = course.units[i];
      const milestoneDate = new Date();
      milestoneDate.setDate(milestoneDate.getDate() + (i + 1) * weeksBetweenMilestones * 7);
      milestones.push({
        learningPathId: learningPath.id,
        title: `Complete ${unit.title}`,
        description: `Finish all lessons in ${unit.title}`,
        targetDate: milestoneDate,
        unitId: unit.id,
        order: i + 1,
      });
    }
    await this.prisma.learningMilestone.createMany({ data: milestones });
    return this.getLearningPath(learningPath.id);
  }

  async getLearningPath(learningPathId: string) {
    return this.prisma.learningPath.findUnique({
      where: { id: learningPathId },
      include: { course: { include: { language: true, units: true } }, milestones: { orderBy: { order: 'asc' } } },
    });
  }

  async getUserLearningPaths(userId: string) {
    return this.prisma.learningPath.findMany({
      where: { userId },
      include: { course: { include: { language: true } }, milestones: { orderBy: { order: 'asc' }, take: 3 } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ==================== ADMIN CRUD OPERATIONS ====================

  // Course Materials CRUD
  async createCourseMaterial(data: any) {
    return this.prisma.courseMaterial.create({ data });
  }

  async updateCourseMaterial(id: string, data: any) {
    return this.prisma.courseMaterial.update({ where: { id }, data });
  }

  async deleteCourseMaterial(id: string) {
    return this.prisma.courseMaterial.delete({ where: { id } });
  }

  // Unit Materials CRUD
  async createUnitMaterial(data: any) {
    return this.prisma.unitMaterial.create({ data });
  }

  async updateUnitMaterial(id: string, data: any) {
    return this.prisma.unitMaterial.update({ where: { id }, data });
  }

  async deleteUnitMaterial(id: string) {
    return this.prisma.unitMaterial.delete({ where: { id } });
  }

  // Lesson Materials CRUD
  async createLessonMaterial(data: any) {
    return this.prisma.lessonMaterial.create({ data });
  }

  async updateLessonMaterial(id: string, data: any) {
    return this.prisma.lessonMaterial.update({ where: { id }, data });
  }

  async deleteLessonMaterial(id: string) {
    return this.prisma.lessonMaterial.delete({ where: { id } });
  }

  // Analytics
  async getAnalytics() {
    const totalUsers = await this.prisma.user.count();
    const totalCourses = await this.prisma.course.count();
    const totalLessons = await this.prisma.lesson.count();
    const totalMaterials = await this.prisma.courseMaterial.count() + 
                          await this.prisma.unitMaterial.count() + 
                          await this.prisma.lessonMaterial.count();

    const activeLearners = await this.prisma.userCourseProgress.groupBy({
      by: ['userId'],
      where: { lastAccessedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    });

    const certifications = await this.prisma.userCertification.count();
    
    const topCourses = await this.prisma.userCourseProgress.groupBy({
      by: ['courseId'],
      _count: { userId: true },
      orderBy: { _count: { userId: 'desc' } },
      take: 5,
    });

    const completionRate = await this.prisma.userCourseProgress.aggregate({
      _avg: { completionPercentage: true },
    });

    return {
      totalUsers,
      totalCourses,
      totalLessons,
      totalMaterials,
      activeLearnersWeek: activeLearners.length,
      totalCertifications: certifications,
      topCourses,
      averageCompletionRate: completionRate._avg.completionPercentage || 0,
    };
  }

  async getCourseAnalytics(courseId: string) {
    const enrollments = await this.prisma.userCourseProgress.count({ where: { courseId } });
    const completions = await this.prisma.userCourseProgress.count({ 
      where: { courseId, isCompleted: true } 
    });
    
    const avgScore = await this.prisma.userCourseProgress.aggregate({
      where: { courseId },
      _avg: { averageScore: true },
    });

    const materialProgress = await this.prisma.userMaterialProgress.groupBy({
      by: ['courseMaterialId'],
      where: { courseMaterialId: { not: null } },
      _count: { userId: true },
      _avg: { progress: true },
    });

    return {
      enrollments,
      completions,
      completionRate: enrollments > 0 ? (completions / enrollments) * 100 : 0,
      averageScore: avgScore._avg.averageScore || 0,
      materialProgress,
    };
  }
}
