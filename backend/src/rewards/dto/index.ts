import { IsString, IsOptional, IsNumber, IsEnum, IsUUID } from 'class-validator';
import { RewardType, RewardStatus } from '../../entities/reward.entity';

export class CreateRewardDto {
  @IsUUID()
  creatorId: string;

  @IsOptional()
  @IsUUID()
  contentId?: string;

  @IsEnum(RewardType)
  rewardType: RewardType;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  criteria?: Record<string, any>;
}

export class UpdateRewardStatusDto {
  @IsEnum(RewardStatus)
  status: RewardStatus;

  @IsOptional()
  @IsString()
  transactionReference?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class CreateMilestoneRewardDto {
  @IsUUID()
  creatorId: string;

  @IsString()
  milestone: string;

  @IsNumber()
  amount: number;
}

export class CreateEngagementBonusDto {
  @IsUUID()
  creatorId: string;

  @IsNumber()
  amount: number;

  @IsString()
  period: string;
}