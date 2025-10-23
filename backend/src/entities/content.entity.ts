import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Creator } from './creator.entity';
import { Engagement } from './engagement.entity';
import { Reward } from './reward.entity';

export enum ContentType {
  VIDEO = 'video',
  IMAGE = 'image',
  TEXT = 'text',
  AUDIO = 'audio',
  LIVESTREAM = 'livestream',
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  PENDING_REVIEW = 'pending_review',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

export enum Platform {
  YOUTUBE = 'youtube',
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
  TWITTER = 'twitter',
  FACEBOOK = 'facebook',
  PLATFORM_NATIVE = 'platform_native',
}

@Entity('content')
@Index(['creatorId'])
@Index(['platform'])
@Index(['status'])
@Index(['contentType'])
@Index(['publishedAt'])
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  creatorId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  contentType: ContentType;

  @Column({
    type: 'enum',
    enum: Platform,
  })
  platform: Platform;

  @Column({
    type: 'enum',
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  status: ContentStatus;

  @Column({ nullable: true })
  externalId: string; // ID from external platform

  @Column({ nullable: true })
  externalUrl: string; // URL to content on external platform

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  contentUrl: string;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'int', default: 0 })
  likes: number;

  @Column({ type: 'int', default: 0 })
  shares: number;

  @Column({ type: 'int', default: 0 })
  comments: number;

  @Column({ type: 'int', nullable: true })
  duration: number; // in seconds for video/audio

  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true })
  categories: string[];

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  engagementRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  rewardAmount: number;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastAnalyzedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Creator, (creator) => creator.content)
  @JoinColumn({ name: 'creatorId' })
  creator: Creator;

  @OneToMany(() => Engagement, (engagement) => engagement.content)
  engagements: Engagement[];

  @OneToMany(() => Reward, (reward) => reward.content)
  rewards: Reward[];
}