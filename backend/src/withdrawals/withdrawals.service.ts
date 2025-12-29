import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWithdrawalDto } from './dto';

@Injectable()
export class WithdrawalsService {
  constructor(private prisma: PrismaService) {}

  async createWithdrawal(userId: string, dto: CreateWithdrawalDto) {
    // Get tutor profile
    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found');
    }

    // Calculate available balance
    const completedBookings = await this.prisma.booking.findMany({
      where: {
        tutorId: tutorProfile.id,
        status: 'completed',
      },
    });

    const totalEarnings = completedBookings.reduce((sum, booking) => {
      return sum + Number(booking.totalAmount);
    }, 0);

    const netEarnings = totalEarnings * 0.85; // After 15% commission

    // Get total withdrawn
    const withdrawals = await this.prisma.withdrawal.findMany({
      where: {
        tutorId: tutorProfile.id,
        status: { in: ['approved', 'pending'] },
      },
    });

    const totalWithdrawn = withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const availableBalance = netEarnings - totalWithdrawn;

    // Validate withdrawal amount
    if (dto.amount < 50000) {
      throw new BadRequestException('Minimum withdrawal amount is Rp 50,000');
    }

    if (dto.amount > availableBalance) {
      throw new BadRequestException(`Insufficient balance. Available: Rp ${availableBalance.toLocaleString('id-ID')}`);
    }

    // Create withdrawal request
    const withdrawal = await this.prisma.withdrawal.create({
      data: {
        tutorId: tutorProfile.id,
        amount: dto.amount,
        bankName: dto.bankName,
        bankAccountNumber: dto.bankAccountNumber,
        bankAccountName: dto.bankAccountName,
        status: 'pending',
      },
      include: {
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // TODO: Send notification to admin
    // await this.notificationService.notifyAdmin('new_withdrawal', withdrawal);

    return withdrawal;
  }

  async getMyWithdrawals(userId: string, page = 1, limit = 20) {
    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found');
    }

    const skip = (page - 1) * limit;

    const [withdrawals, total] = await Promise.all([
      this.prisma.withdrawal.findMany({
        where: {
          tutorId: tutorProfile.id,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.withdrawal.count({
        where: {
          tutorId: tutorProfile.id,
        },
      }),
    ]);

    return {
      data: withdrawals,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getWithdrawalById(userId: string, withdrawalId: string) {
    const tutorProfile = await this.prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutorProfile) {
      throw new NotFoundException('Tutor profile not found');
    }

    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal not found');
    }

    if (withdrawal.tutorId !== tutorProfile.id) {
      throw new ForbiddenException('Access denied');
    }

    return withdrawal;
  }
}
