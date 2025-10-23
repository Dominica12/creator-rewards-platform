export interface BlockchainConfig {
  rpcUrl: string;
  contractAddress: string;
  vibeCoinAddress: string;
  privateKey: string;
  contractAbi: any[];
  network: string;
  gasLimit: number;
  gasPrice: number;
}