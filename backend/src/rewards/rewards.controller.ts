import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RewardService } from './rewards.service';
import { 
  CreateRewardDto, 
  UpdateRewardStatusDto, 
  CreateMilestoneRewardDto, 
  CreateEngagementBonusDto 
} from './dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities/user.entity';
import { RewardStatus } from '../entities/reward.entity';

@ApiTags('Rewards')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @ApiOperation({ summary: 'Create manual reward (Admin only)' })
  @ApiResponse({ status: 201, description: 'Reward created successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createRewardDto: CreateRewardDto) {
    // This would be implemented for manual reward creation
    // return this.rewardService.createManualReward(createRewardDto);
  }

  @ApiOperation({ summary: 'Create content reward' })
  @ApiResponse({ status: 201, description: 'Content reward created successfully' })
  @Post('content/:contentId')
  createContentReward(@Param('contentId') contentId: string) {
    return this.rewardService.createContentReward(contentId);
  }

  @ApiOperation({ summary: 'Create milestone reward (Admin only)' })
  @ApiResponse({ status: 201, description: 'Milestone reward created successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post('milestone')
  createMilestoneReward(@Body() createMilestoneDto: CreateMilestoneRewardDto) {
    return this.rewardService.createMilestoneReward(
      createMilestoneDto.creatorId,
      createMilestoneDto.milestone,
      createMilestoneDto.amount,
    );
  }

  @ApiOperation({ summary: 'Create engagement bonus (Admin only)' })
  @ApiResponse({ status: 201, description: 'Engagement bonus created successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post('engagement-bonus')
  createEngagementBonus(@Body() createBonusDto: CreateEngagementBonusDto) {
    return this.rewardService.createEngagementBonus(
      createBonusDto.creatorId,
      createBonusDto.amount,
      createBonusDto.period,
    );
  }

  @ApiOperation({ summary: 'Get all rewards with optional filters' })
  @ApiResponse({ status: 200, description: 'Rewards retrieved successfully' })
  @ApiQuery({ name: 'creatorId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: RewardStatus })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  findAll(
    @Query('creatorId') creatorId?: string,
    @Query('status') status?: RewardStatus,
  ) {
    return this.rewardService.findAll(creatorId, status);
  }

  @ApiOperation({ summary: 'Get current creator rewards' })
  @ApiResponse({ status: 200, description: 'Creator rewards retrieved successfully' })
  @Get('my-rewards')
  getMyRewards(@Request() req) {
    return this.rewardService.findByCreator(req.user.creator.id);
  }

  @ApiOperation({ summary: 'Get reward analytics' })
  @ApiResponse({ status: 200, description: 'Reward analytics retrieved successfully' })
  @ApiQuery({ name: 'creatorId', required: false, type: String })
  @ApiQuery({ name: 'timeframe', required: false, enum: ['day', 'week', 'month'] })
  @Get('analytics')
  getRewardAnalytics(
    @Request() req,
    @Query('creatorId') creatorId?: string,
    @Query('timeframe') timeframe?: 'day' | 'week' | 'month',
  ) {
    // Admin can view all analytics, creators can only view their own
    const targetCreatorId = req.user.role === UserRole.ADMIN ? creatorId : req.user.creator?.id;
    return this.rewardService.getRewardAnalytics(targetCreatorId, timeframe);
  }

  @ApiOperation({ summary: 'Calculate content reward amount' })
  @ApiResponse({ status: 200, description: 'Reward amount calculated successfully' })
  @Get('calculate/:contentId')
  calculateReward(@Param('contentId') contentId: string) {
    return this.rewardService.calculateContentReward(contentId);
  }

  @ApiOperation({ summary: 'Get reward by ID' })
  @ApiResponse({ status: 200, description: 'Reward retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rewardService.findById(id);
  }

  @ApiOperation({ summary: 'Update reward status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Reward status updated successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateRewardStatusDto,
  ) {
    switch (updateStatusDto.status) {
      case RewardStatus.APPROVED:
        return this.rewardService.approveReward(id);
      case RewardStatus.PAID:
        return this.rewardService.markAsPaid(id, updateStatusDto.transactionReference);
      case RewardStatus.REJECTED:
        return this.rewardService.rejectReward(id, updateStatusDto.reason);
      default:
        throw new Error('Invalid status update');
    }
  }

  @ApiOperation({ summary: 'Approve reward (Admin only)' })
  @ApiResponse({ status: 200, description: 'Reward approved successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id/approve')
  approveReward(@Param('id') id: string) {
    return this.rewardService.approveReward(id);
  }

  @ApiOperation({ summary: 'Mark reward as paid (Admin only)' })
  @ApiResponse({ status: 200, description: 'Reward marked as paid successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id/pay')
  markAsPaid(
    @Param('id') id: string,
    @Body('transactionReference') transactionReference?: string,
  ) {
    return this.rewardService.markAsPaid(id, transactionReference);
  }

  @ApiOperation({ summary: 'Reject reward (Admin only)' })
  @ApiResponse({ status: 200, description: 'Reward rejected successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id/reject')
  rejectReward(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.rewardService.rejectReward(id, reason);
  }

  @ApiOperation({ summary: 'Process automatic rewards (Admin only)' })
  @ApiResponse({ status: 200, description: 'Automatic rewards processed successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post('process-automatic')
  processAutomaticRewards() {
    return this.rewardService.processAutomaticRewards();
  }
}