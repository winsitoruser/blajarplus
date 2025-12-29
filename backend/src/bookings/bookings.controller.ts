import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, CancelBookingDto, QueryBookingDto } from './dto';

@ApiTags('bookings')
@Controller('bookings')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new booking' })
  createBooking(@Req() req, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my bookings' })
  getMyBookings(@Req() req, @Query() dto: QueryBookingDto) {
    return this.bookingsService.getMyBookings(req.user.id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  getBookingById(@Req() req, @Param('id') id: string) {
    return this.bookingsService.getBookingById(req.user.id, id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update booking' })
  updateBooking(@Req() req, @Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingsService.updateBooking(req.user.id, id, dto);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancel booking' })
  cancelBooking(@Req() req, @Param('id') id: string, @Body() dto: CancelBookingDto) {
    return this.bookingsService.cancelBooking(req.user.id, id, dto);
  }

  @Put(':id/confirm')
  @ApiOperation({ summary: 'Confirm booking (tutor only)' })
  confirmBooking(@Req() req, @Param('id') id: string) {
    return this.bookingsService.confirmBooking(req.user.id, id);
  }

  @Put(':id/complete')
  @ApiOperation({ summary: 'Mark booking as completed' })
  completeBooking(@Req() req, @Param('id') id: string) {
    return this.bookingsService.completeBooking(req.user.id, id);
  }
}
