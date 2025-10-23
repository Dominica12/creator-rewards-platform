import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../entities/user.entity';
import { Creator } from '../entities/creator.entity';
import { Content } from '../entities/content.entity';
import { Engagement } from '../entities/engagement.entity';
import { Reward } from '../entities/reward.entity';
import { Transaction } from '../entities/transaction.entity';
import { AuditLog } from '../entities/audit-log.entity';

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'password'),
  database: configService.get<string>('DB_NAME', 'creator_rewards'),
  entities: [User, Creator, Content, Engagement, Reward, Transaction, AuditLog],
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', true), // Set to false in production
  logging: configService.get<boolean>('DB_LOGGING', false),
  ssl: configService.get<boolean>('DB_SSL', false) ? { rejectUnauthorized: false } : false,
});