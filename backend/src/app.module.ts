import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// import { TutorsModule } from './tutors/tutors.module';
// import { BookingsModule } from './bookings/bookings.module';
// import { PaymentsModule } from './payments/payments.module';
// import { ChatModule } from './chat/chat.module';
// import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Core modules
    PrismaModule,
    AuthModule,
    UsersModule,
    // TutorsModule, // Temporarily disabled due to TypeScript errors
    // BookingsModule, // Temporarily disabled due to TypeScript errors
    // PaymentsModule, // Temporarily disabled due to TypeScript errors
    // ChatModule, // Temporarily disabled due to TypeScript errors
    // ReviewsModule, // Temporarily disabled due to TypeScript errors
  ],
})
export class AppModule {}
