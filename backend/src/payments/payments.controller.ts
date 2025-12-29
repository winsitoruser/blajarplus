import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, MidtransNotificationDto } from './dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment for booking' })
  createPayment(@Req() req, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(req.user.id, dto);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Midtrans payment webhook (no auth)' })
  handleWebhook(@Body() dto: MidtransNotificationDto) {
    return this.paymentsService.handleMidtransNotification(dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  getPaymentById(@Req() req, @Param('id') id: string) {
    return this.paymentsService.getPaymentById(req.user.id, id);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payment by order ID (public for callback)' })
  getPaymentByOrderId(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentByOrderId(orderId);
  }

  @Post(':id/refund')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Request refund for payment' })
  requestRefund(@Req() req, @Param('id') id: string, @Body('reason') reason: string) {
    return this.paymentsService.requestRefund(req.user.id, id, reason);
  }
}
