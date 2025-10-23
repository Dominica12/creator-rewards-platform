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
import { User } from './user.entity';
import { Content } from './content.entity';
import { Reward } from './reward.entity';

export enum CreatorStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  VERIFIED = 'verified',
}

export enum CreatorTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

@Entity('creators')
@Index(['userId'], { unique: true })
@Index(['creatorTier'])
@Index(['status'])
export class Creator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ unique: true })
  creatorCode: string;

  @Column({
    type: 'enum',
    enum: CreatorStatus,
    default: CreatorStatus.PENDING_VERIFICATION,
  })
  status: CreatorStatus;

  @Column({
    type: 'enum',
    enum: CreatorTier,
    default: CreatorTier.BRONZE,
  })
  creatorTier: CreatorTier;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalEarnings: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  pendingEarnings: number;

  @Column({ type: 'int', default: 0 })
  totalContent: number;

  @Column({ type: 'int', default: 0 })
  totalViews: number;

  @Column({ type: 'int', default: 0 })
  totalLikes: number;

  @Column({ type: 'int', default: 0 })
  totalShares: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  engagementRate: number;

  @Column({ type: 'jsonb', nullable: true })
  socialMediaLinks: {
    youtube?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    facebook?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  contentCategories: string[];

  @Column({ type: 'jsonb', nullable: true })
  analytics: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastActiveAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.creators)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Content, (content) => content.creator)
  content: Content[];

  @OneToMany(() => Reward, (reward) => reward.creator)
  rewards: Reward[];
}