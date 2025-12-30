import { Controller, Get, Post, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LanguageLearningService } from './language-learning.service';

@ApiTags('Language Learning')
@Controller('language-learning')
export class LanguageLearningController {
  constructor(private readonly languageLearningService: LanguageLearningService) {}

  // ==================== LANGUAGES ====================

  @Get('languages')
  @ApiOperation({ summary: 'Get all available languages' })
  async getAllLanguages() {
    return this.languageLearningService.getAllLanguages();
  }

  @Get('languages/:id')
  @ApiOperation({ summary: 'Get language details with courses' })
  async getLanguageById(@Param('id') id: string) {
    return this.languageLearningService.getLanguageById(id);
  }

  // ==================== COURSES ====================

  @Get('languages/:languageId/courses')
  @ApiOperation({ summary: 'Get courses for a language' })
  async getCoursesByLanguage(
    @Param('languageId') languageId: string,
    @Query('userId') userId?: string,
  ) {
    return this.languageLearningService.getCoursesByLanguage(languageId, userId);
  }

  @Get('courses/:id')
  @ApiOperation({ summary: 'Get course details' })
  async getCourseById(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ) {
    return this.languageLearningService.getCourseById(id, userId);
  }

  // ==================== UNITS ====================

  @Get('units/:id')
  @ApiOperation({ summary: 'Get unit details with lessons' })
  async getUnitById(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ) {
    return this.languageLearningService.getUnitById(id, userId);
  }

  // ==================== LESSONS ====================

  @Get('lessons/:id')
  @ApiOperation({ summary: 'Get lesson details with exercises' })
  async getLessonById(
    @Param('id') id: string,
    @Query('userId') userId?: string,
  ) {
    return this.languageLearningService.getLessonById(id, userId);
  }

  @Post('lessons/:id/start')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start a lesson' })
  async startLesson(@Param('id') id: string, @Req() req) {
    return this.languageLearningService.startLesson(req.user.id, id);
  }

  @Post('lessons/:id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete a lesson' })
  async completeLesson(@Param('id') id: string, @Req() req) {
    return this.languageLearningService.completeLesson(req.user.id, id);
  }

  // ==================== EXERCISES ====================

  @Post('exercises/:id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit answer for an exercise' })
  async submitAnswer(
    @Param('id') id: string,
    @Body() body: { answer: string; timeSpent?: number; hintsUsed?: number },
    @Req() req,
  ) {
    return this.languageLearningService.submitAnswer(
      req.user.id,
      id,
      body.answer,
      body.timeSpent,
      body.hintsUsed,
    );
  }

  // ==================== USER PROGRESS ====================

  @Get('progress')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user language learning progress' })
  async getUserProgress(@Req() req) {
    return this.languageLearningService.getUserProgress(req.user.id);
  }

  // ==================== VOCABULARY ====================

  @Get('vocabulary/:languageCode')
  @ApiOperation({ summary: 'Get vocabulary by language code' })
  getVocabulary(
    @Param('languageCode') languageCode: string,
    @Query('difficulty') difficulty?: string,
  ) {
    return this.languageLearningService.getVocabularyByLanguage(languageCode, difficulty);
  }

  // ==================== MATERIALS ====================

  @Get('courses/:courseId/materials')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get course materials' })
  getCourseMaterials(
    @Param('courseId') courseId: string,
    @Req() req,
  ) {
    return this.languageLearningService.getCourseMaterials(courseId, req.user.id);
  }

  @Get('units/:unitId/materials')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get unit materials' })
  getUnitMaterials(
    @Param('unitId') unitId: string,
    @Req() req,
  ) {
    return this.languageLearningService.getUnitMaterials(unitId, req.user.id);
  }

  @Get('lessons/:lessonId/materials')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get lesson materials' })
  getLessonMaterials(
    @Param('lessonId') lessonId: string,
    @Req() req,
  ) {
    return this.languageLearningService.getLessonMaterials(lessonId, req.user.id);
  }

  @Post('materials/:materialId/progress')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update material progress' })
  updateMaterialProgress(
    @Param('materialId') materialId: string,
    @Body() body: { materialType: 'course' | 'unit' | 'lesson'; progress: number; timeSpent: number },
    @Req() req,
  ) {
    return this.languageLearningService.updateMaterialProgress(
      req.user.id,
      materialId,
      body.materialType,
      body.progress,
      body.timeSpent,
    );
  }

  // ==================== CERTIFICATIONS ====================

  @Get('courses/:courseId/certifications')
  @ApiOperation({ summary: 'Get course certifications' })
  getCourseCertifications(@Param('courseId') courseId: string) {
    return this.languageLearningService.getCourseCertifications(courseId);
  }

  @Get('certifications/:certificationId/eligibility')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Check certification eligibility' })
  checkCertificationEligibility(
    @Param('certificationId') certificationId: string,
    @Req() req,
  ) {
    return this.languageLearningService.checkCertificationEligibility(req.user.id, certificationId);
  }

  @Post('certifications/:certificationId/issue')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Issue certification to user' })
  issueCertification(
    @Param('certificationId') certificationId: string,
    @Req() req,
  ) {
    return this.languageLearningService.issueCertification(req.user.id, certificationId);
  }

  @Get('certifications/my')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user certifications' })
  getUserCertifications(@Req() req) {
    return this.languageLearningService.getUserCertifications(req.user.id);
  }

  // ==================== LEARNING PATHS ====================

  @Post('learning-paths')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create learning path' })
  createLearningPath(
    @Body() body: { courseId: string; targetDate?: string; hoursPerWeek?: number },
    @Req() req,
  ) {
    return this.languageLearningService.createLearningPath(
      req.user.id,
      body.courseId,
      body.targetDate ? new Date(body.targetDate) : undefined,
      body.hoursPerWeek,
    );
  }

  @Get('learning-paths')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user learning paths' })
  getUserLearningPaths(@Req() req) {
    return this.languageLearningService.getUserLearningPaths(req.user.id);
  }

  @Get('learning-paths/:learningPathId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get learning path details' })
  getLearningPath(@Param('learningPathId') learningPathId: string) {
    return this.languageLearningService.getLearningPath(learningPathId);
  }

  // ==================== ADMIN CRUD OPERATIONS ====================

  @Post('admin/course-materials')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create course material (Admin)' })
  createCourseMaterial(@Body() data: any) {
    return this.languageLearningService.createCourseMaterial(data);
  }

  @Put('admin/course-materials/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update course material (Admin)' })
  updateCourseMaterial(@Param('id') id: string, @Body() data: any) {
    return this.languageLearningService.updateCourseMaterial(id, data);
  }

  @Delete('admin/course-materials/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete course material (Admin)' })
  deleteCourseMaterial(@Param('id') id: string) {
    return this.languageLearningService.deleteCourseMaterial(id);
  }

  @Post('admin/unit-materials')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create unit material (Admin)' })
  createUnitMaterial(@Body() data: any) {
    return this.languageLearningService.createUnitMaterial(data);
  }

  @Put('admin/unit-materials/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update unit material (Admin)' })
  updateUnitMaterial(@Param('id') id: string, @Body() data: any) {
    return this.languageLearningService.updateUnitMaterial(id, data);
  }

  @Delete('admin/unit-materials/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete unit material (Admin)' })
  deleteUnitMaterial(@Param('id') id: string) {
    return this.languageLearningService.deleteUnitMaterial(id);
  }

  @Post('admin/lesson-materials')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create lesson material (Admin)' })
  createLessonMaterial(@Body() data: any) {
    return this.languageLearningService.createLessonMaterial(data);
  }

  @Put('admin/lesson-materials/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update lesson material (Admin)' })
  updateLessonMaterial(@Param('id') id: string, @Body() data: any) {
    return this.languageLearningService.updateLessonMaterial(id, data);
  }

  @Delete('admin/lesson-materials/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete lesson material (Admin)' })
  deleteLessonMaterial(@Param('id') id: string) {
    return this.languageLearningService.deleteLessonMaterial(id);
  }

  // ==================== ANALYTICS ====================

  @Get('admin/analytics')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get platform analytics (Admin)' })
  getAnalytics() {
    return this.languageLearningService.getAnalytics();
  }

  @Get('admin/analytics/course/:courseId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get course analytics (Admin)' })
  getCourseAnalytics(@Param('courseId') courseId: string) {
    return this.languageLearningService.getCourseAnalytics(courseId);
  }
}
