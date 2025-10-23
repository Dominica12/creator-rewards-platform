import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SmartContractService } from './smart-contract.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../entities/user.entity';

export class ProcessRewardDto {
  rewardId: string;
}

export class VerifyCreatorDto {
  creatorId: string;
  stakeAmount: string;
}

@ApiTags('Blockchain')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('blockchain')
export class BlockchainController {
  constructor(private smartContractService: SmartContractService) {}

  @ApiOperation({ summary: 'Process reward payment through smart contract (Admin only)' })
  @ApiResponse({ status: 200, description: 'Reward payment processed successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post('process-reward')
  async processRewardPayment(@Body() dto: ProcessRewardDto) {
    return this.smartContractService.processRewardPayment(dto.rewardId);
  }

  @ApiOperation({ summary: 'Verify creator on blockchain (Admin only)' })
  @ApiResponse({ status: 200, description: 'Creator verification processed successfully' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @Post('verify-creator')
  async verifyCreator(@Body() dto: VerifyCreatorDto) {
    return this.smartContractService.verifyCreatorOnChain(dto.creatorId, dto.stakeAmount);
  }

  @ApiOperation({ summary: 'Sync creator earnings from blockchain' })
  @ApiResponse({ status: 200, description: 'Creator earnings synced successfully' })
  @Post('sync-earnings/:creatorId')
  async syncCreatorEarnings(@Param('creatorId') creatorId: string) {
    await this.smartContractService.syncCreatorEarnings(creatorId);
    return { message: 'Earnings synced successfully' };
  }

  @ApiOperation({ summary: 'Get platform blockchain statistics' })
  @ApiResponse({ status: 200, description: 'Blockchain statistics retrieved successfully' })
  @Get('stats')
  async getPlatformStats() {
    return this.smartContractService.getPlatformBlockchainStats();
  }

  @ApiOperation({ summary: 'Verify transaction on blockchain' })
  @ApiResponse({ status: 200, description: 'Transaction verification result' })
  @Get('verify-transaction/:txHash')
  async verifyTransaction(@Param('txHash') txHash: string) {
    const isValid = await this.smartContractService.verifyRewardTransaction(txHash);
    return {
      transactionHash: txHash,
      isValid,
      message: isValid ? 'Transaction verified' : 'Transaction not found or failed'
    };
  }
}