// Extended methods for LanguageLearningService
// Add these methods to the existing language-learning.service.ts file

  // ==================== VOCABULARY ====================

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

  async updateMaterialProgress(
    userId: string,
    materialId: string,
    materialType: 'course' | 'unit' | 'lesson',
    progress: number,
    timeSpent: number,
  ) {
    const data: any = {
      userId,
      progress,
      timeSpent,
      lastAccessedAt: new Date(),
    };

    if (materialType === 'course') {
      data.courseMaterialId = materialId;
    } else if (materialType === 'unit') {
      data.unitMaterialId = materialId;
    } else {
      data.lessonMaterialId = materialId;
    }

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
      return this.prisma.userMaterialProgress.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.userMaterialProgress.create({ data });
  }

  // ==================== CERTIFICATIONS ====================

  async getCourseCertifications(courseId: string) {
    return this.prisma.certification.findMany({
      where: { courseId, isActive: true },
    });
  }

  async checkCertificationEligibility(userId: string, certificationId: string) {
    const certification = await this.prisma.certification.findUnique({
      where: { id: certificationId },
      include: { course: true },
    });

    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    const criteria = certification.criteria as any;
    const courseProgress = await this.prisma.userCourseProgress.findUnique({
      where: {
        userId_courseId: { userId, courseId: certification.courseId },
      },
    });

    if (!courseProgress) {
      return { eligible: false, reason: 'Course not started' };
    }

    const checks = {
      minimumScore: courseProgress.averageScore >= (criteria.minimumScore || 0),
      requiredLessons: courseProgress.completedLessons >= (criteria.requiredLessons || 0),
      minimumXP: courseProgress.totalXpEarned >= (criteria.minimumXP || 0),
    };

    const eligible = Object.values(checks).every(v => v);

    return {
      eligible,
      checks,
      currentProgress: {
        score: courseProgress.averageScore,
        lessonsCompleted: courseProgress.completedLessons,
        xpEarned: courseProgress.totalXpEarned,
      },
      requirements: criteria,
    };
  }

  async issueCertification(userId: string, certificationId: string) {
    const eligibility = await this.checkCertificationEligibility(userId, certificationId);

    if (!eligibility.eligible) {
      throw new BadRequestException('User is not eligible for this certification');
    }

    const certification = await this.prisma.certification.findUnique({
      where: { id: certificationId },
    });

    const certificateNumber = `CERT-${Date.now()}-${userId.substring(0, 8).toUpperCase()}`;

    const userCert = await this.prisma.userCertification.create({
      data: {
        userId,
        certificationId,
        certificateNumber,
        score: eligibility.currentProgress?.score,
      },
      include: {
        certification: true,
      },
    });

    // Award achievement XP
    await this.gamificationService.addXp(
      userId,
      100,
      'certification_earned',
      `Earned ${certification?.name}`,
    );

    return userCert;
  }

  async getUserCertifications(userId: string) {
    return this.prisma.userCertification.findMany({
      where: { userId, isRevoked: false },
      include: {
        certification: {
          include: { course: { include: { language: true } } },
        },
      },
      orderBy: { earnedAt: 'desc' },
    });
  }

  // ==================== LEARNING PATHS ====================

  async createLearningPath(
    userId: string,
    courseId: string,
    targetDate?: Date,
    hoursPerWeek: number = 5,
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { units: { include: { lessons: true } } },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const learningPath = await this.prisma.learningPath.create({
      data: {
        userId,
        courseId,
        targetDate,
        hoursPerWeek,
        status: 'NOT_STARTED',
      },
    });

    // Create milestones for each unit
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
      include: {
        course: { include: { language: true, units: true } },
        milestones: { orderBy: { order: 'asc' } },
      },
    });
  }

  async getUserLearningPaths(userId: string) {
    return this.prisma.learningPath.findMany({
      where: { userId },
      include: {
        course: { include: { language: true } },
        milestones: {
          orderBy: { order: 'asc' },
          take: 3,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLearningPathProgress(userId: string, courseId: string) {
    const learningPath = await this.prisma.learningPath.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: { milestones: true },
    });

    if (!learningPath) return;

    const courseProgress = await this.prisma.userCourseProgress.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (!courseProgress) return;

    let status = learningPath.status;
    if (courseProgress.isCompleted) {
      status = 'COMPLETED';
    } else if (courseProgress.completedLessons > 0) {
      status = 'IN_PROGRESS';
    }

    await this.prisma.learningPath.update({
      where: { id: learningPath.id },
      data: { status },
    });

    // Update milestones
    for (const milestone of learningPath.milestones) {
      if (milestone.unitId) {
        const unitProgress = await this.prisma.userUnitProgress.findUnique({
          where: {
            userId_unitId: { userId, unitId: milestone.unitId },
          },
        });

        if (unitProgress?.isCompleted && !milestone.isCompleted) {
          await this.prisma.learningMilestone.update({
            where: { id: milestone.id },
            data: {
              isCompleted: true,
              completedAt: new Date(),
            },
          });
        }
      }
    }
  }
