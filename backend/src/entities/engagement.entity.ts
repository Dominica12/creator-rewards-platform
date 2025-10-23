import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Content } from './content.entity';

export enum EngagementType {
  VIEW = 'view',
  LIKE = 'like',
  SHARE = 'share',
  COMMENT = 'comment',
  SUBSCRIBE = 'subscribe',
  FOLLOW = 'follow',
}

@Entity('engagements')
@Index(['userId'])
@Index(['contentId'])
@Index(['engagementType'])
@Index(['createdAt'])
export class Engagement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string; // Can be null for anonymous engagements

  @Column()
  contentId: string;

  @Column({
    type: 'enum',
    enum: EngagementType,
  })
  engagementType: EngagementType;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  referrer: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  // Relations
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Content, (content) => content.engagements)
  @JoinColumn({ name: 'contentId' })
  content: Content;
}