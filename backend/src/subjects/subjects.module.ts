import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubjectsController],
})
export class SubjectsModule {}
