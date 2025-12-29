import { Controller, Get, Post, Body, Param, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto';

@ApiTags('withdrawals')
@Controller('withdrawals')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class WithdrawalsController {
  constructor(private withdrawalsService: WithdrawalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create withdrawal request' })
  createWithdrawal(@Req() req, @Body() dto: CreateWithdrawalDto) {
    return this.withdrawalsService.createWithdrawal(req.user.id, dto);
  }

  @Get('my-withdrawals')
  @ApiOperation({ summary: 'Get my withdrawal history' })
  getMyWithdrawals(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.withdrawalsService.getMyWithdrawals(req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get withdrawal by ID' })
  getWithdrawalById(@Req() req, @Param('id') id: string) {
    return this.withdrawalsService.getWithdrawalById(req.user.id, id);
  }
}
