import { Injectable } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { RewardService } from '../rewards/rewards.service';
import { CreatorService } from '../creator/creator.service';

@Injectable()
export class SmartContractService {
  constructor(
    private blockchainService: BlockchainService,
    private rewardService: RewardService,
    private creatorService: CreatorService,
  ) {}

  // Process reward payment through smart contract
  async processRewardPayment(rewardId: string): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      const reward = await this.rewardService.findById(rewardId);
      const creator = await this.creatorService.findById(reward.creatorId);

      // Ensure creator has a wallet address
      if (!creator.user.metadata?.walletAddress) {
        throw new Error('Creator wallet address not found');
      }

      // Distribute reward through smart contract
      const txHash = await this.blockchainService.distributeReward(
        creator.user.metadata.walletAddress,
        reward.amount.toString(),
        rewardId
      );

      // Update reward status in database
      await this.rewardService.markAsPaid(rewardId, txHash);

      return {
        success: true,
        transactionHash: txHash
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify creator through blockchain staking
  async verifyCreatorOnChain(creatorId: string, stakeAmount: string): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      const creator = await this.creatorService.findById(creatorId);

      if (!creator.user.metadata?.walletAddress) {
        throw new Error('Creator wallet address not found');
      }

      const txHash = await this.blockchainService.stakeForVerification(
        creator.user.metadata.walletAddress,
        stakeAmount
      );

      // Update creator verification status
      await this.creatorService.updateStatus(creatorId, 'verified' as any);

      return {
        success: true,
        transactionHash: txHash
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Sync blockchain earnings with database
  async syncCreatorEarnings(creatorId: string): Promise<void> {
    try {
      const creator = await this.creatorService.findById(creatorId);
      
      if (creator.user.metadata?.walletAddress) {
        const blockchainEarnings = await this.blockchainService.getCreatorEarnings(
          creator.user.metadata.walletAddress
        );

        // Update creator's blockchain earnings in metadata
        const updatedMetadata = {
          ...creator.user.metadata,
          blockchainEarnings: parseFloat(blockchainEarnings)
        };

        await this.creatorService.update(creatorId, {
          analytics: updatedMetadata
        });
      }
    } catch (error) {
      console.error(`Failed to sync earnings for creator ${creatorId}:`, error);
    }
  }

  // Get platform blockchain statistics
  async getPlatformBlockchainStats() {
    try {
      return await this.blockchainService.getPlatformStats();
    } catch (error) {
      throw new Error(`Failed to fetch blockchain stats: ${error.message}`);
    }
  }

  // Add Vibe Coin tokens to contract for reward distribution
  async addRewardTokensToContract(amount: string): Promise<{
    success: boolean;
    transactionHash?: string;
    error?: string;
  }> {
    try {
      const txHash = await this.blockchainService.addRewardTokens(amount);
      
      return {
        success: true,
        transactionHash: txHash
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get contract's current Vibe Coin balance
  async getContractBalance(): Promise<{
    success: boolean;
    balance?: string;
    error?: string;
  }> {
    try {
      const balance = await this.blockchainService.getContractVibeCoinBalance();
      
      return {
        success: true,
        balance
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get the Vibe Coin token address used by the contract
  async getVibeCoinAddress(): Promise<{
    success: boolean;
    address?: string;
    error?: string;
  }> {
    try {
      const address = await this.blockchainService.getVibeCoinAddress();
      
      return {
        success: true,
        address
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify a transaction exists on blockchain
  async verifyRewardTransaction(transactionHash: string): Promise<boolean> {
    try {
      return await this.blockchainService.verifyTransaction(transactionHash);
    } catch (error) {
      console.error('Transaction verification failed:', error);
      return false;
    }
  }
}