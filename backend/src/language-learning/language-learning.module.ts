import { Module } from '@nestjs/common';
import { LanguageLearningController } from './language-learning.controller';
import { LanguageLearningService } from './language-learning.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GamificationModule } from '../gamification/gamification.module';

@Module({
  imports: [PrismaModule, GamificationModule],
  controllers: [LanguageLearningController],
  providers: [LanguageLearningService],
  exports: [LanguageLearningService],
})
export class LanguageLearningModule {}
