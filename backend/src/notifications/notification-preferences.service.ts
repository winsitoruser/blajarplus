import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  soundAlerts: boolean;
  bookingCreated: boolean;
  bookingConfirmed: boolean;
  bookingCancelled: boolean;
  paymentSuccess: boolean;
  messageReceived: boolean;
  reviewReceived: boolean;
  walletCredited: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: true,
  soundAlerts: true,
  bookingCreated: true,
  bookingConfirmed: true,
  bookingCancelled: true,
  paymentSuccess: true,
  messageReceived: true,
  reviewReceived: true,
  walletCredited: true,
};

@Injectable()
export class NotificationPreferencesService {
  constructor(private prisma: PrismaService) {}

  async getPreferences(userId: string): Promise<NotificationPreferences> {
    // TODO: Add notificationPreferences field to User model in Prisma schema
    // For now, return default preferences
    return DEFAULT_PREFERENCES;
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>,
  ): Promise<NotificationPreferences> {
    // TODO: Add notificationPreferences field to User model in Prisma schema
    // For now, return merged preferences
    const currentPrefs = await this.getPreferences(userId);
    return { ...currentPrefs, ...preferences };
  }

  async shouldSendEmail(userId: string, notificationType: string): Promise<boolean> {
    const prefs = await this.getPreferences(userId);
    return prefs.emailNotifications && (prefs as any)[notificationType] !== false;
  }

  async shouldSendPush(userId: string, notificationType: string): Promise<boolean> {
    const prefs = await this.getPreferences(userId);
    return prefs.pushNotifications && (prefs as any)[notificationType] !== false;
  }

  async shouldPlaySound(userId: string): Promise<boolean> {
    const prefs = await this.getPreferences(userId);
    return prefs.soundAlerts;
  }
}
