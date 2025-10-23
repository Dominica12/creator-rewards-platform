import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardService } from './rewards.service';
import { RewardController } from './rewards.controller';
import { Reward } from '../entities/reward.entity';
import { Content } from '../entities/content.entity';
import { CreatorModule } from '../creator/creator.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reward, Content]),
    CreatorModule,
  ],
  controllers: [RewardController],
  providers: [RewardService],
  exports: [RewardService],
})
export class RewardModule {}