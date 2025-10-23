import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BlockchainService } from './blockchain.service';
import { SmartContractService } from './smart-contract.service';
import { BlockchainController } from './blockchain.controller';
import { RewardModule } from '../rewards/rewards.module';
import { CreatorModule } from '../creator/creator.module';
import blockchainConfig from '../config/blockchain.config';

@Module({
  imports: [
    ConfigModule.forFeature(blockchainConfig),
    RewardModule, 
    CreatorModule
  ],
  providers: [BlockchainService, SmartContractService],
  controllers: [BlockchainController],
  exports: [BlockchainService, SmartContractService],
})
export class BlockchainModule {}