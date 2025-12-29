import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, MidtransNotificationDto } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private midtransServerKey: string;
  private midtransClientKey: string;
  private midtransIsProduction: boolean;
  private midtransApiUrl: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.midtransServerKey = this.config.get('MIDTRANS_SERVER_KEY') || '';
    this.midtransClientKey = this.config.get('MIDTRANS_CLIENT_KEY') || '';
    this.midtransIsProduction = this.config.get('MIDTRANS_IS_PRODUCTION') === 'true';
    this.midtransApiUrl = this.midtransIsProduction
      ? 'https://api.midtrans.com/v2'
      : 'https://api.sandbox.midtrans.com/v2';
  }

  async createPayment(studentId: string, dto: CreatePaymentDto) {
    // Verify booking exists and belongs to student
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        student: true,
        tutor: {
          include: {
            user: true,
          },
        },
        subject: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.studentId !== studentId) {
      throw new ForbiddenException('You can only pay for your own bookings');
    }

    // Check if booking is pending
    if (booking.status !== 'pending') {
      throw new BadRequestException('Can only pay for pending bookings');
    }

    // Check if payment already exists
    const existingPayment = await this.prisma.paymentTransaction.findFirst({
      where: {
        bookingId: dto.bookingId,
        status: { in: ['pending', 'paid'] },
      },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already exists for this booking');
    }

    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${booking.id.substring(0, 8)}`;

    // Create payment record
    const payment = await this.prisma.paymentTransaction.create({
      data: {
        bookingId: dto.bookingId,
        amount: booking.totalAmount,
        paymentMethod: dto.paymentMethod,
        status: 'pending',
        orderId,
      },
      include: {
        booking: {
          include: {
            student: true,
            tutor: {
              include: {
                user: true,
              },
            },
            subject: true,
          },
        },
      },
    });

    // Create Midtrans transaction
    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: booking.totalAmount,
      },
      customer_details: {
        first_name: booking.student.fullName,
        email: booking.student.email,
        phone: booking.student.phone || '',
      },
      item_details: [
        {
          id: booking.subject.id,
          price: booking.totalAmount,
          quantity: 1,
          name: `Les ${booking.subject.name} dengan ${booking.tutor.user.fullName}`,
        },
      ],
      callbacks: {
        finish: dto.callbackUrl || `${this.config.get('FRONTEND_URL')}/payment/success`,
      },
    };

    try {
      // Call Midtrans Snap API
      const snapToken = await this.createMidtransTransaction(midtransPayload);

      // Update payment with snap token
      await this.prisma.paymentTransaction.update({
        where: { id: payment.id },
        data: { snapToken },
      });

      return {
        ...payment,
        snapToken,
        midtransClientKey: this.midtransClientKey,
      };
    } catch (error) {
      // If Midtrans fails, delete payment record
      await this.prisma.paymentTransaction.delete({
        where: { id: payment.id },
      });
      throw new BadRequestException('Failed to create payment: ' + error.message);
    }
  }

  async handleMidtransNotification(dto: MidtransNotificationDto) {
    // Verify signature
    const isValid = this.verifySignature(dto);
    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }

    // Find payment by order ID
    const payment = await this.prisma.paymentTransaction.findUnique({
      where: { orderId: dto.order_id },
      include: {
        booking: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Update payment status based on transaction status
    let newStatus = payment.status;
    let bookingStatus = payment.booking.status;

    switch (dto.transaction_status) {
      case 'capture':
      case 'settlement':
        newStatus = 'paid';
        bookingStatus = 'confirmed';
        break;
      case 'pending':
        newStatus = 'pending';
        break;
      case 'deny':
      case 'expire':
      case 'cancel':
        newStatus = 'failed';
        bookingStatus = 'cancelled';
        break;
      case 'refund':
        newStatus = 'refunded';
        break;
    }

    // Update payment
    await this.prisma.paymentTransaction.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        paidAt: newStatus === 'paid' ? new Date() : null,
        midtransTransactionId: dto.transaction_id,
      },
    });

    // Update booking status if payment is successful
    if (newStatus === 'paid' && payment.booking.status === 'pending') {
      await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: bookingStatus },
      });
    }

    // If payment failed, cancel booking
    if (newStatus === 'failed' && payment.booking.status === 'pending') {
      await this.prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'cancelled' },
      });
    }

    return { message: 'Notification processed successfully' };
  }

  async getPaymentById(userId: string, paymentId: string) {
    const payment = await this.prisma.paymentTransaction.findUnique({
      where: { id: paymentId },
      include: {
        booking: {
          include: {
            student: true,
            tutor: {
              include: {
                user: true,
              },
            },
            subject: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    // Check access rights
    if (payment.booking.studentId !== userId && payment.booking.tutor.userId !== userId) {
      throw new ForbiddenException('You can only view your own payments');
    }

    return payment;
  }

  async getPaymentByOrderId(orderId: string) {
    const payment = await this.prisma.paymentTransaction.findUnique({
      where: { orderId },
      include: {
        booking: {
          include: {
            student: true,
            tutor: {
              include: {
                user: true,
              },
            },
            subject: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async requestRefund(userId: string, paymentId: string, reason: string) {
    const payment = await this.prisma.paymentTransaction.findUnique({
      where: { id: paymentId },
      include: {
        booking: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.booking.studentId !== userId) {
      throw new ForbiddenException('You can only request refund for your own payments');
    }

    if (payment.status !== 'paid') {
      throw new BadRequestException('Can only refund paid payments');
    }

    if (payment.booking.status !== 'cancelled') {
      throw new BadRequestException('Booking must be cancelled first');
    }

    // Update payment status to refund_pending
    const updated = await this.prisma.paymentTransaction.update({
      where: { id: paymentId },
      data: {
        status: 'refund_pending',
      },
      include: {
        booking: {
          include: {
            student: true,
            tutor: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    // In production, call Midtrans refund API here
    // For now, just return the updated payment

    return updated;
  }

  private async createMidtransTransaction(payload: any): Promise<string> {
    // In production, call Midtrans Snap API
    // For development/testing, return mock snap token
    
    if (!this.midtransServerKey) {
      // Mock response for development
      return `mock-snap-token-${Date.now()}`;
    }

    try {
      const response = await fetch(`${this.midtransApiUrl}/charge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(this.midtransServerKey + ':').toString('base64')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.status_message || 'Midtrans API error');
      }

      return data.token;
    } catch (error) {
      throw new Error('Failed to create Midtrans transaction: ' + error.message);
    }
  }

  private verifySignature(dto: MidtransNotificationDto): boolean {
    // In production, verify Midtrans signature
    // For development, always return true if no server key configured
    
    if (!this.midtransServerKey) {
      return true; // Skip verification in development
    }

    const { order_id, transaction_status, signature_key } = dto;
    const serverKey = this.midtransServerKey;
    
    const hash = crypto
      .createHash('sha512')
      .update(`${order_id}${transaction_status}${serverKey}`)
      .digest('hex');

    return hash === signature_key;
  }
}
