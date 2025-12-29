import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export enum NotificationType {
  BOOKING_CREATED = 'booking_created',
  BOOKING_CONFIRMED = 'booking_confirmed',
  BOOKING_CANCELLED = 'booking_cancelled',
  BOOKING_COMPLETED = 'booking_completed',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  NEW_MESSAGE = 'new_message',
  NEW_REVIEW = 'new_review',
  TUTOR_VERIFIED = 'tutor_verified',
  TUTOR_REJECTED = 'tutor_rejected',
  WITHDRAWAL_APPROVED = 'withdrawal_approved',
  WITHDRAWAL_REJECTED = 'withdrawal_rejected',
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    data?: any,
  ) {
    return this.prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ? JSON.stringify(data) : null,
      },
    });
  }

  async getMyNotifications(userId: string, page = 1, limit = 20, unreadOnly = false) {
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (unreadOnly) {
      where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: notifications.map(n => ({
        ...n,
        data: n.data ? JSON.parse(n.data as string) : null,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return { count };
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { message: 'All notifications marked as read' };
  }

  // Helper methods for creating specific notifications
  async notifyBookingCreated(tutorUserId: string, bookingId: string, studentName: string) {
    return this.createNotification(
      tutorUserId,
      NotificationType.BOOKING_CREATED,
      'Booking Baru',
      `${studentName} telah membuat booking. Silakan konfirmasi.`,
      { bookingId },
    );
  }

  async notifyBookingConfirmed(studentUserId: string, bookingId: string, tutorName: string) {
    return this.createNotification(
      studentUserId,
      NotificationType.BOOKING_CONFIRMED,
      'Booking Dikonfirmasi',
      `${tutorName} telah mengkonfirmasi booking Anda.`,
      { bookingId },
    );
  }

  async notifyBookingCompleted(userId: string, bookingId: string) {
    return this.createNotification(
      userId,
      NotificationType.BOOKING_COMPLETED,
      'Kelas Selesai',
      'Kelas telah selesai. Jangan lupa berikan review!',
      { bookingId },
    );
  }

  async notifyPaymentSuccess(userId: string, paymentId: string, amount: number) {
    return this.createNotification(
      userId,
      NotificationType.PAYMENT_SUCCESS,
      'Pembayaran Berhasil',
      `Pembayaran sebesar Rp ${amount.toLocaleString('id-ID')} berhasil.`,
      { paymentId },
    );
  }

  async notifyNewMessage(userId: string, senderId: string, senderName: string) {
    return this.createNotification(
      userId,
      NotificationType.NEW_MESSAGE,
      'Pesan Baru',
      `${senderName} mengirim pesan baru.`,
      { senderId },
    );
  }

  async notifyNewReview(tutorUserId: string, reviewId: string, rating: number) {
    return this.createNotification(
      tutorUserId,
      NotificationType.NEW_REVIEW,
      'Review Baru',
      `Anda mendapat review baru dengan rating ${rating} bintang.`,
      { reviewId },
    );
  }

  async notifyTutorVerified(tutorUserId: string) {
    return this.createNotification(
      tutorUserId,
      NotificationType.TUTOR_VERIFIED,
      'Profile Diverifikasi',
      'Selamat! Profile tutor Anda telah diverifikasi. Anda sekarang bisa menerima booking.',
      {},
    );
  }

  async notifyTutorRejected(tutorUserId: string, reason: string) {
    return this.createNotification(
      tutorUserId,
      NotificationType.TUTOR_REJECTED,
      'Profile Ditolak',
      `Profile tutor Anda ditolak. Alasan: ${reason}`,
      {},
    );
  }

  async notifyWithdrawalApproved(tutorUserId: string, amount: number) {
    return this.createNotification(
      tutorUserId,
      NotificationType.WITHDRAWAL_APPROVED,
      'Penarikan Disetujui',
      `Penarikan dana sebesar Rp ${amount.toLocaleString('id-ID')} telah disetujui dan akan diproses.`,
      {},
    );
  }

  async notifyWithdrawalRejected(tutorUserId: string, reason: string) {
    return this.createNotification(
      tutorUserId,
      NotificationType.WITHDRAWAL_REJECTED,
      'Penarikan Ditolak',
      `Penarikan dana ditolak. Alasan: ${reason}`,
      {},
    );
  }
}
