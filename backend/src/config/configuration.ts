export const config = () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    name: process.env.DB_NAME || 'creator_rewards',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    ssl: process.env.DB_SSL === 'true',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
  },
  app: {
    environment: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  rewards: {
    baseRewardAmount: parseFloat(process.env.BASE_REWARD_AMOUNT || '1.0'),
    tierMultipliers: {
      bronze: 1.0,
      silver: 1.5,
      gold: 2.0,
      platinum: 3.0,
    },
  },
  blockchain: {
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_PROJECT_ID',
    contractAddress: process.env.SMART_CONTRACT_ADDRESS || '',
    vibeCoinAddress: process.env.VIBE_COIN_ADDRESS || '',
    privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY || '',
    contractAbi: JSON.parse(process.env.CONTRACT_ABI || '[]'),
    network: process.env.BLOCKCHAIN_NETWORK || 'ethereum',
    gasLimit: parseInt(process.env.GAS_LIMIT || '500000', 10),
    gasPrice: process.env.GAS_PRICE || '20',
  },
});