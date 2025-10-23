import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Creator, CreatorStatus, CreatorTier } from '../entities/creator.entity';
import { CreateCreatorDto, UpdateCreatorDto } from './dto';

@Injectable()
export class CreatorService {
  constructor(
    @InjectRepository(Creator)
    private creatorRepository: Repository<Creator>,
  ) {}

  async create(createCreatorDto: CreateCreatorDto): Promise<Creator> {
    const existingCreator = await this.creatorRepository.findOne({
      where: { userId: createCreatorDto.userId },
    });

    if (existingCreator) {
      throw new ConflictException('User is already a creator');
    }

    const creatorCode = await this.generateCreatorCode();
    const creator = this.creatorRepository.create({
      ...createCreatorDto,
      creatorCode,
    });

    return this.creatorRepository.save(creator);
  }

  async findAll(): Promise<Creator[]> {
    return this.creatorRepository.find({
      relations: ['user'],
    });
  }

  async findById(id: string): Promise<Creator> {
    const creator = await this.creatorRepository.findOne({
      where: { id },
      relations: ['user', 'content', 'rewards'],
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    return creator;
  }

  async findByUserId(userId: string): Promise<Creator> {
    const creator = await this.creatorRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    return creator;
  }

  async findByCreatorCode(creatorCode: string): Promise<Creator> {
    const creator = await this.creatorRepository.findOne({
      where: { creatorCode },
      relations: ['user'],
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    return creator;
  }

  async update(id: string, updateCreatorDto: UpdateCreatorDto): Promise<Creator> {
    const creator = await this.findById(id);
    Object.assign(creator, updateCreatorDto);
    return this.creatorRepository.save(creator);
  }

  async updateStatus(id: string, status: CreatorStatus): Promise<Creator> {
    const creator = await this.findById(id);
    creator.status = status;
    
    if (status === CreatorStatus.VERIFIED) {
      creator.verifiedAt = new Date();
    }

    return this.creatorRepository.save(creator);
  }

  async updateTier(id: string, tier: CreatorTier): Promise<Creator> {
    const creator = await this.findById(id);
    creator.creatorTier = tier;
    return this.creatorRepository.save(creator);
  }

  async updateEarnings(id: string, amount: number, isPending: boolean = false): Promise<Creator> {
    const creator = await this.findById(id);
    
    if (isPending) {
      creator.pendingEarnings += amount;
    } else {
      creator.totalEarnings += amount;
      creator.pendingEarnings = Math.max(0, creator.pendingEarnings - amount);
    }

    return this.creatorRepository.save(creator);
  }

  async updateStats(id: string, stats: {
    views?: number;
    likes?: number;
    shares?: number;
    content?: number;
  }): Promise<Creator> {
    const creator = await this.findById(id);
    
    if (stats.views) creator.totalViews += stats.views;
    if (stats.likes) creator.totalLikes += stats.likes;
    if (stats.shares) creator.totalShares += stats.shares;
    if (stats.content) creator.totalContent += stats.content;

    // Calculate engagement rate
    if (creator.totalViews > 0) {
      creator.engagementRate = 
        ((creator.totalLikes + creator.totalShares + (creator.totalViews * 0.1)) / creator.totalViews) * 100;
    }

    creator.lastActiveAt = new Date();
    
    return this.creatorRepository.save(creator);
  }

  async remove(id: string): Promise<void> {
    const creator = await this.findById(id);
    await this.creatorRepository.remove(creator);
  }

  private async generateCreatorCode(): Promise<string> {
    let code: string = '';
    let exists = true;

    while (exists) {
      code = 'CR' + Math.random().toString(36).substr(2, 8).toUpperCase();
      const existing = await this.creatorRepository.findOne({
        where: { creatorCode: code },
      });
      exists = !!existing;
    }

    return code;
  }

  async getTopCreators(limit: number = 10): Promise<Creator[]> {
    return this.creatorRepository.find({
      where: { status: CreatorStatus.VERIFIED },
      order: { totalEarnings: 'DESC' },
      take: limit,
      relations: ['user'],
    });
  }

  async searchCreators(query: string): Promise<Creator[]> {
    return this.creatorRepository
      .createQueryBuilder('creator')
      .leftJoinAndSelect('creator.user', 'user')
      .where('user.username ILIKE :query', { query: `%${query}%` })
      .orWhere('user.firstName ILIKE :query', { query: `%${query}%` })
      .orWhere('user.lastName ILIKE :query', { query: `%${query}%` })
      .orWhere('creator.creatorCode ILIKE :query', { query: `%${query}%` })
      .getMany();
  }
}