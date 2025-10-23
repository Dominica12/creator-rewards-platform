import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

export interface SmartContractConfig {
  contractAddress: string;
  abi: any[];
  rpcUrl: string;
  privateKey: string;
}

@Injectable()
export class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.initializeBlockchain();
  }

  private async initializeBlockchain() {
    const rpcUrl = this.configService.get<string>('blockchain.rpcUrl');
    const privateKey = this.configService.get<string>('blockchain.privateKey');
    const contractAddress = this.configService.get<string>('blockchain.contractAddress');
    const contractAbi = this.configService.get<any[]>('blockchain.contractAbi');

    this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(contractAddress, contractAbi, this.wallet);
  }

  // Distribute rewards to creator's wallet
  async distributeReward(creatorWalletAddress: string, amount: string, rewardId: string): Promise<string> {
    try {
      const tx = await this.contract.distributeReward(
        creatorWalletAddress,
        ethers.utils.parseEther(amount),
        rewardId
      );
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      throw new Error(`Blockchain reward distribution failed: ${error.message}`);
    }
  }

  // Stake tokens for creator verification
  async stakeForVerification(creatorAddress: string, stakeAmount: string): Promise<string> {
    try {
      const tx = await this.contract.stakeForVerification(
        creatorAddress,
        ethers.utils.parseEther(stakeAmount)
      );
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      throw new Error(`Staking failed: ${error.message}`);
    }
  }

  // Get creator's total earned rewards from blockchain
  async getCreatorEarnings(creatorAddress: string): Promise<string> {
    try {
      const earnings = await this.contract.getCreatorEarnings(creatorAddress);
      return ethers.utils.formatEther(earnings);
    } catch (error) {
      throw new Error(`Failed to fetch earnings: ${error.message}`);
    }
  }

  // Verify transaction on blockchain
  async verifyTransaction(txHash: string): Promise<boolean> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      return receipt && receipt.status === 1;
    } catch (error) {
      return false;
    }
  }

  // Get platform statistics from smart contract
  async getPlatformStats(): Promise<{
    totalRewardsDistributed: string;
    totalCreators: number;
    totalStaked: string;
  }> {
    try {
      const [totalRewards, totalCreators, totalStaked] = await this.contract.getPlatformStats();

      return {
        totalRewardsDistributed: ethers.utils.formatEther(totalRewards),
        totalCreators: totalCreators.toNumber(),
        totalStaked: ethers.utils.formatEther(totalStaked)
      };
    } catch (error) {
      throw new Error(`Failed to fetch platform stats: ${error.message}`);
    }
  }

  // Add Vibe Coin tokens to the contract for reward distribution
  async addRewardTokens(amount: string): Promise<string> {
    try {
      const tx = await this.contract.addRewardTokens(
        ethers.utils.parseEther(amount)
      );
      
      await tx.wait();
      return tx.hash;
    } catch (error) {
      throw new Error(`Failed to add reward tokens: ${error.message}`);
    }
  }

  // Get the contract's Vibe Coin balance
  async getContractVibeCoinBalance(): Promise<string> {
    try {
      const balance = await this.contract.getContractVibeCoinBalance();
      return ethers.utils.formatEther(balance);
    } catch (error) {
      throw new Error(`Failed to fetch contract balance: ${error.message}`);
    }
  }

  // Get the Vibe Coin contract address
  async getVibeCoinAddress(): Promise<string> {
    try {
      return await this.contract.getVibeCoinAddress();
    } catch (error) {
      throw new Error(`Failed to fetch Vibe Coin address: ${error.message}`);
    }
  }

  // Listen to smart contract events
  async listenToRewardEvents() {
    this.contract.on('RewardDistributed', (creator, amount, rewardId, event) => {
      console.log(`Reward distributed: ${creator} received ${ethers.utils.formatEther(amount)} for reward ${rewardId}`);
      // Emit event to update database or notify frontend
    });

    this.contract.on('CreatorVerified', (creator, stakeAmount, event) => {
      console.log(`Creator verified: ${creator} staked ${ethers.utils.formatEther(stakeAmount)}`);
      // Update creator verification status in database
    });

    this.contract.on('VibeCoinDeposited', (depositor, amount, event) => {
      console.log(`Vibe Coin deposited: ${depositor} added ${ethers.utils.formatEther(amount)} to contract`);
      // Log deposit for platform analytics
    });
  }
}