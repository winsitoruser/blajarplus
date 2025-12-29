import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TutorsModule } from './tutors/tutors.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { ChatModule } from './chat/chat.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AdminModule } from './admin/admin.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { NotificationsModule } from './notifications/notifications.module';

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
    TutorsModule,
    BookingsModule,
    PaymentsModule,
    ChatModule,
    ReviewsModule,
    AdminModule,
    WithdrawalsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
