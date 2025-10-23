import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Content, ContentStatus } from '../entities/content.entity';
import { CreateContentDto, UpdateContentDto, UpdateContentStatsDto } from './dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  async create(createContentDto: CreateContentDto): Promise<Content> {
    const content = this.contentRepository.create(createContentDto);
    return this.contentRepository.save(content);
  }

  async findAll(creatorId?: string, status?: ContentStatus): Promise<Content[]> {
    const query = this.contentRepository.createQueryBuilder('content')
      .leftJoinAndSelect('content.creator', 'creator')
      .leftJoinAndSelect('creator.user', 'user');

    if (creatorId) {
      query.where('content.creatorId = :creatorId', { creatorId });
    }

    if (status) {
      query.andWhere('content.status = :status', { status });
    }

    return query.orderBy('content.createdAt', 'DESC').getMany();
  }

  async findById(id: string): Promise<Content> {
    const content = await this.contentRepository.findOne({
      where: { id },
      relations: ['creator', 'creator.user', 'engagements', 'rewards'],
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async findByCreator(creatorId: string): Promise<Content[]> {
    return this.contentRepository.find({
      where: { creatorId },
      relations: ['creator'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByPlatform(platform: string, creatorId?: string): Promise<Content[]> {
    const query = this.contentRepository.createQueryBuilder('content')
      .where('content.platform = :platform', { platform });

    if (creatorId) {
      query.andWhere('content.creatorId = :creatorId', { creatorId });
    }

    return query.orderBy('content.createdAt', 'DESC').getMany();
  }

  async update(id: string, updateContentDto: UpdateContentDto, requestingUserId: string): Promise<Content> {
    const content = await this.findById(id);
    
    // Check if user owns this content (unless admin)
    if (content.creator.userId !== requestingUserId) {
      throw new ForbiddenException('You can only update your own content');
    }

    Object.assign(content, updateContentDto);
    return this.contentRepository.save(content);
  }

  async updateStatus(id: string, status: ContentStatus): Promise<Content> {
    const content = await this.findById(id);
    content.status = status;
    
    if (status === ContentStatus.PUBLISHED) {
      content.publishedAt = new Date();
    }

    return this.contentRepository.save(content);
  }

  async updateStats(id: string, statsDto: UpdateContentStatsDto): Promise<Content> {
    const content = await this.findById(id);
    
    if (statsDto.views) content.views += statsDto.views;
    if (statsDto.likes) content.likes += statsDto.likes;
    if (statsDto.shares) content.shares += statsDto.shares;
    if (statsDto.comments) content.comments += statsDto.comments;

    // Calculate engagement rate
    if (content.views > 0) {
      content.engagementRate = ((content.likes + content.shares + (content.comments * 2)) / content.views) * 100;
    }

    content.lastAnalyzedAt = new Date();

    return this.contentRepository.save(content);
  }

  async remove(id: string, requestingUserId: string): Promise<void> {
    const content = await this.findById(id);
    
    // Check if user owns this content (unless admin)
    if (content.creator.userId !== requestingUserId) {
      throw new ForbiddenException('You can only delete your own content');
    }

    await this.contentRepository.remove(content);
  }

  async getTopContent(limit: number = 10, timeframe?: 'day' | 'week' | 'month'): Promise<Content[]> {
    const query = this.contentRepository.createQueryBuilder('content')
      .leftJoinAndSelect('content.creator', 'creator')
      .leftJoinAndSelect('creator.user', 'user')
      .where('content.status = :status', { status: ContentStatus.PUBLISHED });

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

      query.andWhere('content.publishedAt >= :startDate', { startDate });
    }

    return query
      .orderBy('content.engagementRate', 'DESC')
      .addOrderBy('content.views', 'DESC')
      .take(limit)
      .getMany();
  }

  async getContentAnalytics(creatorId: string, timeframe?: 'day' | 'week' | 'month') {
    const query = this.contentRepository.createQueryBuilder('content')
      .where('content.creatorId = :creatorId', { creatorId })
      .andWhere('content.status = :status', { status: ContentStatus.PUBLISHED });

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

      query.andWhere('content.publishedAt >= :startDate', { startDate });
    }

    const content = await query.getMany();

    const totalContent = content.length;
    const totalViews = content.reduce((sum, item) => sum + item.views, 0);
    const totalLikes = content.reduce((sum, item) => sum + item.likes, 0);
    const totalShares = content.reduce((sum, item) => sum + item.shares, 0);
    const totalComments = content.reduce((sum, item) => sum + item.comments, 0);
    const avgEngagementRate = content.length > 0 
      ? content.reduce((sum, item) => sum + item.engagementRate, 0) / content.length 
      : 0;

    return {
      totalContent,
      totalViews,
      totalLikes,
      totalShares,
      totalComments,
      avgEngagementRate: Number(avgEngagementRate.toFixed(2)),
      topContent: content.sort((a, b) => b.engagementRate - a.engagementRate).slice(0, 5),
    };
  }

  async searchContent(query: string): Promise<Content[]> {
    return this.contentRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.creator', 'creator')
      .leftJoinAndSelect('creator.user', 'user')
      .where('content.title ILIKE :query', { query: `%${query}%` })
      .orWhere('content.description ILIKE :query', { query: `%${query}%` })
      .orWhere('content.tags::text ILIKE :query', { query: `%${query}%` })
      .andWhere('content.status = :status', { status: ContentStatus.PUBLISHED })
      .orderBy('content.engagementRate', 'DESC')
      .getMany();
  }
}