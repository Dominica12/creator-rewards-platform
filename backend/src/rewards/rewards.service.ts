import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Reward, RewardType, RewardStatus } from '../entities/reward.entity';
import { Content, ContentStatus } from '../entities/content.entity';
import { Creator, CreatorTier } from '../entities/creator.entity';
import { CreatorService } from '../creator/creator.service';

@Injectable()
export class RewardService {
  constructor(
    @InjectRepository(Reward)
    private rewardRepository: Repository<Reward>,
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
    private creatorService: CreatorService,
    private configService: ConfigService,
  ) {}

  async calculateContentReward(contentId: string): Promise<number> {
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
      relations: ['creator'],
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const baseReward = this.configService.get<number>('rewards.baseRewardAmount', 1.0);
    const tierMultipliers = this.configService.get('rewards.tierMultipliers');
    const tierMultiplier = tierMultipliers[content.creator.creatorTier] || 1.0;

    // Base calculation factors
    let rewardAmount = baseReward;

    // Engagement multiplier (views, likes, shares, comments)
    const engagementScore = (
      (content.views * 0.01) + 
      (content.likes * 0.1) + 
      (content.shares * 0.2) + 
      (content.comments * 0.15)
    );

    rewardAmount += engagementScore;

    // Content quality bonus (engagement rate)
    if (content.engagementRate > 10) {
      rewardAmount *= 1.5; // 50% bonus for high engagement
    } else if (content.engagementRate > 5) {
      rewardAmount *= 1.2; // 20% bonus for good engagement
    }

    // Creator tier multiplier
    rewardAmount *= tierMultiplier;

    // Content type multiplier
    const contentTypeMultipliers = {
      video: 1.5,
      livestream: 2.0,
      image: 1.0,
      text: 0.8,
      audio: 1.2,
    };

    rewardAmount *= contentTypeMultipliers[content.contentType] || 1.0;

    return Math.round(rewardAmount * 100) / 100; // Round to 2 decimal places
  }

  async createContentReward(contentId: string): Promise<Reward> {
    const content = await this.contentRepository.findOne({
      where: { id: contentId },
      relations: ['creator', 'creator.user'],
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    const amount = await this.calculateContentReward(contentId);

    const reward = this.rewardRepository.create({
      userId: content.creator.userId,
      creatorId: content.creatorId,
      contentId: contentId,
      rewardType: RewardType.CONTENT_CREATION,
      amount,
      description: `Content creation reward for "${content.title}"`,
      criteria: {
        views: content.views,
        likes: content.likes,
        shares: content.shares,
        comments: content.comments,
        engagementRate: content.engagementRate,
        creatorTier: content.creator.creatorTier,
      },
    });

    const savedReward = await this.rewardRepository.save(reward);

    // Update creator pending earnings
    await this.creatorService.updateEarnings(content.creatorId, amount, true);

    return savedReward;
  }

  async createMilestoneReward(creatorId: string, milestone: string, amount: number): Promise<Reward> {
    const creator = await this.creatorService.findById(creatorId);

    const reward = this.rewardRepository.create({
      userId: creator.userId,
      creatorId: creatorId,
      rewardType: RewardType.MILESTONE_ACHIEVEMENT,
      amount,
      description: `Milestone achievement: ${milestone}`,
      criteria: { milestone },
    });

    const savedReward = await this.rewardRepository.save(reward);

    // Update creator pending earnings
    await this.creatorService.updateEarnings(creatorId, amount, true);

    return savedReward;
  }

  async createEngagementBonus(creatorId: string, amount: number, period: string): Promise<Reward> {
    const creator = await this.creatorService.findById(creatorId);

    const reward = this.rewardRepository.create({
      userId: creator.userId,
      creatorId: creatorId,
      rewardType: RewardType.ENGAGEMENT_BONUS,
      amount,
      description: `Engagement bonus for ${period}`,
      criteria: { period },
    });

    const savedReward = await this.rewardRepository.save(reward);

    // Update creator pending earnings
    await this.creatorService.updateEarnings(creatorId, amount, true);

    return savedReward;
  }

  async findAll(creatorId?: string, status?: RewardStatus): Promise<Reward[]> {
    const query = this.rewardRepository.createQueryBuilder('reward')
      .leftJoinAndSelect('reward.creator', 'creator')
      .leftJoinAndSelect('creator.user', 'user')
      .leftJoinAndSelect('reward.content', 'content');

    if (creatorId) {
      query.where('reward.creatorId = :creatorId', { creatorId });
    }

    if (status) {
      query.andWhere('reward.status = :status', { status });
    }

    return query.orderBy('reward.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Reward> {
    const reward = await this.rewardRepository.findOne({
      where: { id },
      relations: ['creator', 'creator.user', 'content'],
    });

    if (!reward) {
      throw new NotFoundException('Reward not found');
    }

    return reward;
  }

  async findByCreator(creatorId: string): Promise<Reward[]> {
    return this.rewardRepository.find({
      where: { creatorId },
      relations: ['content'],
      order: { createdAt: 'DESC' },
    });
  }

  async approveReward(id: string): Promise<Reward> {
    const reward = await this.findById(id);
    
    reward.status = RewardStatus.APPROVED;
    reward.approvedAt = new Date();

    return this.rewardRepository.save(reward);
  }

  async markAsPaid(id: string, transactionReference?: string): Promise<Reward> {
    const reward = await this.findById(id);
    
    reward.status = RewardStatus.PAID;
    reward.paidAt = new Date();
    
    if (transactionReference) {
      reward.transactionReference = transactionReference;
    }

    const savedReward = await this.rewardRepository.save(reward);

    // Move from pending to total earnings
    await this.creatorService.updateEarnings(reward.creatorId, reward.amount, false);

    return savedReward;
  }

  async rejectReward(id: string, reason?: string): Promise<Reward> {
    const reward = await this.findById(id);
    
    reward.status = RewardStatus.REJECTED;
    
    if (reason) {
      reward.metadata = { ...reward.metadata, rejectionReason: reason };
    }

    const savedReward = await this.rewardRepository.save(reward);

    // Remove from pending earnings
    await this.creatorService.updateEarnings(reward.creatorId, -reward.amount, true);

    return savedReward;
  }

  async getRewardAnalytics(creatorId?: string, timeframe?: 'day' | 'week' | 'month') {
    const query = this.rewardRepository.createQueryBuilder('reward');

    if (creatorId) {
      query.where('reward.creatorId = :creatorId', { creatorId });
    }

    if (timeframe) {
      const now = new Date();
      let startDate: Date;

      switch (timeframe) {
        case 'day':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      query.andWhere('reward.createdAt >= :startDate', { startDate });
    }

    const rewards = await query.getMany();

    const totalRewards = rewards.length;
    const totalAmount = rewards.reduce((sum, reward) => sum + reward.amount, 0);
    const paidRewards = rewards.filter(r => r.status === RewardStatus.PAID);
    const pendingRewards = rewards.filter(r => r.status === RewardStatus.PENDING);
    const approvedRewards = rewards.filter(r => r.status === RewardStatus.APPROVED);

    const rewardsByType = rewards.reduce((acc, reward) => {
      acc[reward.rewardType] = (acc[reward.rewardType] || 0) + reward.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalRewards,
      totalAmount: Math.round(totalAmount * 100) / 100,
      paidAmount: Math.round(paidRewards.reduce((sum, r) => sum + r.amount, 0) * 100) / 100,
      pendingAmount: Math.round(pendingRewards.reduce((sum, r) => sum + r.amount, 0) * 100) / 100,
      approvedAmount: Math.round(approvedRewards.reduce((sum, r) => sum + r.amount, 0) * 100) / 100,
      rewardsByType,
      recentRewards: rewards.slice(0, 10),
    };
  }

  async processAutomaticRewards(): Promise<void> {
    // This method would be called by a cron job to automatically process rewards
    // For content that meets certain criteria
    
    const publishedContent = await this.contentRepository.find({
      where: { 
        status: ContentStatus.PUBLISHED,
        rewardAmount: 0, // Haven't been rewarded yet
      },
      relations: ['creator'],
    });

    for (const content of publishedContent) {
      // Only reward content that has some engagement
      if (content.views > 10 || content.likes > 1) {
        await this.createContentReward(content.id);
        
        // Update content to mark as rewarded
        content.rewardAmount = await this.calculateContentReward(content.id);
        await this.contentRepository.save(content);
      }
    }
  }
}