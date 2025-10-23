import { registerAs } from '@nestjs/config';

export default registerAs('blockchain', () => ({
  rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545',
  contractAddress: process.env.SMART_CONTRACT_ADDRESS || '',
  vibeCoinAddress: process.env.VIBE_COIN_ADDRESS || '',
  privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || '',
  contractAbi: JSON.parse(process.env.CONTRACT_ABI || '[]'),
  network: process.env.BLOCKCHAIN_NETWORK || 'ethereum',
  gasLimit: parseInt(process.env.GAS_LIMIT || '500000'),
  gasPrice: parseInt(process.env.GAS_PRICE || '20'),
}));