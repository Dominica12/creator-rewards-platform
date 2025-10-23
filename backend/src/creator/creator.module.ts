import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { Creator } from '../entities/creator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Creator])],
  controllers: [CreatorController],
  providers: [CreatorService],
  exports: [CreatorService],
})
export class CreatorModule {}