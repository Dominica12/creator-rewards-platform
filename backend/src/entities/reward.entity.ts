import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Creator } from './creator.entity';
import { Content } from './content.entity';

export enum RewardType {
  CONTENT_CREATION = 'content_creation',
  ENGAGEMENT_BONUS = 'engagement_bonus',
  MILESTONE_ACHIEVEMENT = 'milestone_achievement',
  REFERRAL_BONUS = 'referral_bonus',
  QUALITY_BONUS = 'quality_bonus',
  CONSISTENCY_BONUS = 'consistency_bonus',
}

export enum RewardStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('rewards')
@Index(['creatorId'])
@Index(['userId'])
@Index(['contentId'])
@Index(['rewardType'])
@Index(['status'])
@Index(['createdAt'])
export class Reward {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  creatorId: string;

  @Column({ nullable: true })
  contentId: string; // Can be null for non-content rewards

  @Column({
    type: 'enum',
    enum: RewardType,
  })
  rewardType: RewardType;

  @Column({
    type: 'enum',
    enum: RewardStatus,
    default: RewardStatus.PENDING,
  })
  status: RewardStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  criteria: Record<string, any>; // Criteria that triggered this reward

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  transactionReference: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Creator, (creator) => creator.rewards)
  @JoinColumn({ name: 'creatorId' })
  creator: Creator;

  @ManyToOne(() => Content, (content) => content.rewards, { nullable: true })
  @JoinColumn({ name: 'contentId' })
  content: Content;
}