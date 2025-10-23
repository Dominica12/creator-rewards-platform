# Creator Rewards Platform

A blockchain-powered platform that empowers African creators by linking their social media activity with direct on-chain payouts using **Vibe Coin** tokens.

## 🌟 Overview

The Creator Rewards Platform connects social media engagement to cryptocurrency rewards, providing African creators with:

- **Direct Payments**: Receive Vibe Coin tokens for content creation and engagement
- **Verification System**: Stake-based creator verification for platform trust
- **Transparent Rewards**: All transactions recorded on blockchain for full transparency
- **Social Integration**: Connect multiple social media platforms
- **Analytics Dashboard**: Track earnings, engagement, and platform statistics

## 🏗️ Architecture

### Frontend
- **Framework**: React.js with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Blockchain**: ethers.js for Web3 integration

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Caching**: Redis for performance optimization
- **Authentication**: JWT with Passport.js
- **API Documentation**: Swagger/OpenAPI

### Blockchain
- **Smart Contract**: Solidity ^0.8.19
- **Token Integration**: Vibe Coin (existing ERC20 token)
- **Security**: OpenZeppelin security standards
- **Networks**: Ethereum mainnet/testnets

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- Redis server
- Ethereum wallet with testnet ETH
- Vibe Coin token contract address

### 1. Clone Repository

```bash
git clone https://github.com/your-org/creator-rewards-platform.git
cd creator-rewards-platform
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Update .env with your configuration

# Start database and Redis
# (ensure PostgreSQL and Redis are running)

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

### 3. Deploy Smart Contract

```bash
# Configure blockchain environment in .env
VIBE_COIN_ADDRESS=0x... # Existing Vibe Coin contract
BLOCKCHAIN_PRIVATE_KEY=0x... # Your deployment wallet
BLOCKCHAIN_RPC_URL=https://goerli.infura.io/v3/YOUR_PROJECT_ID

# Deploy to testnet
npm run blockchain:deploy:testnet

# Deploy to mainnet (when ready)
npm run blockchain:deploy:mainnet
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Update with your API endpoints and contract addresses

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=creator_rewards

# Blockchain
BLOCKCHAIN_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
SMART_CONTRACT_ADDRESS=0x... # Your deployed contract
VIBE_COIN_ADDRESS=0x... # Existing Vibe Coin token
BLOCKCHAIN_PRIVATE_KEY=0x... # Platform wallet private key

# JWT
JWT_SECRET=your-super-secret-jwt-key

# External APIs
YOUTUBE_API_KEY=your_youtube_api_key
INSTAGRAM_API_KEY=your_instagram_api_key
TWITTER_API_KEY=your_twitter_api_key
```

#### Frontend (.env)
```bash
REACT_APP_API_URL=http://localhost:3000
REACT_APP_CONTRACT_ADDRESS=0x... # Your deployed contract
REACT_APP_VIBE_COIN_ADDRESS=0x... # Vibe Coin token
REACT_APP_CHAIN_ID=1 # Ethereum mainnet
```

## 💰 Vibe Coin Integration

### Smart Contract Features

The platform integrates with existing Vibe Coin token for:

1. **Reward Distribution**: Direct Vibe Coin payments to creators
2. **Staking Verification**: Creators stake Vibe Coin for platform verification
3. **Platform Funding**: Add Vibe Coin to reward pool
4. **Balance Management**: Track contract and creator balances

### Key Functions

```solidity
// Distribute Vibe Coin rewards to creators
function distributeReward(address creator, uint256 amount, string rewardId)

// Creators stake Vibe Coin for verification
function stakeForVerification(uint256 amount)

// Platform adds Vibe Coin to reward pool
function addRewardTokens(uint256 amount)

// Check creator's total earnings
function getCreatorEarnings(address creator) returns (uint256)
```

## 📱 Features

### For Creators
- **Multi-Platform Integration**: Connect YouTube, Instagram, TikTok, Twitter, Facebook
- **Automated Rewards**: Earn Vibe Coin for content creation and engagement
- **Verification System**: Stake Vibe Coin to become verified creator
- **Analytics Dashboard**: Track earnings, engagement metrics, and performance
- **Instant Payouts**: Direct blockchain transfers to your wallet

### For Platform Administrators
- **Creator Management**: Approve, verify, and manage creator accounts
- **Reward Configuration**: Set reward rates and criteria
- **Analytics**: Platform-wide statistics and performance metrics
- **Blockchain Integration**: Monitor contract balance and transactions
- **Content Moderation**: Review and moderate creator content

### For Sponsors/Brands
- **Creator Discovery**: Find and connect with verified creators
- **Campaign Management**: Launch targeted marketing campaigns
- **Performance Tracking**: Monitor campaign effectiveness
- **Direct Payments**: Pay creators directly in Vibe Coin
- **Transparent Metrics**: Access real engagement data

## 🔐 Security

### Smart Contract Security
- **OpenZeppelin Standards**: Using battle-tested security libraries
- **Access Control**: Role-based permissions for platform operations
- **Balance Validation**: Ensure sufficient funds before transfers
- **Event Logging**: All transactions emit events for transparency

### Backend Security
- **JWT Authentication**: Secure API access with JWT tokens
- **Rate Limiting**: Prevent API abuse with throttling
- **Input Validation**: Comprehensive validation using class-validator
- **SQL Injection Protection**: TypeORM prevents SQL injection
- **CORS Configuration**: Proper cross-origin resource sharing setup

### Frontend Security
- **Wallet Integration**: Secure Web3 wallet connections
- **Private Key Management**: Never store private keys in frontend
- **API Security**: Secure communication with backend
- **XSS Protection**: React's built-in XSS protection

## 🧪 Testing

### Smart Contract Testing
```bash
cd backend

# Compile contracts
npm run blockchain:compile

# Run contract tests
npm run blockchain:test

# Start local blockchain for testing
npm run blockchain:node
```

### Backend Testing
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Frontend Testing
```bash
cd frontend

# Unit tests
npm run test

# E2E tests with Cypress
npm run cypress:open
```

## 📊 API Documentation

The backend provides comprehensive REST APIs documented with Swagger:

- **Development**: http://localhost:3000/api/docs
- **Production**: https://your-domain.com/api/docs

### Key Endpoints

```
POST /auth/login - User authentication
POST /auth/register - User registration
GET /creators - List all creators
POST /creators/:id/verify - Verify creator with staking
POST /rewards/:id/distribute - Distribute reward to creator
GET /platform/stats - Platform statistics
GET /creators/:id/earnings - Creator earnings
POST /platform/add-tokens - Add Vibe Coin to reward pool
```

## 🚀 Deployment

### Production Deployment

1. **Prepare Environment**
   ```bash
   # Set production environment variables
   NODE_ENV=production
   DATABASE_URL=your_production_database_url
   REDIS_URL=your_production_redis_url
   ```

2. **Deploy Smart Contract**
   ```bash
   npm run blockchain:deploy:mainnet
   # Update environment with deployed contract address
   ```

3. **Deploy Backend**
   ```bash
   # Build application
   npm run build
   
   # Deploy to your preferred platform (AWS, GCP, Heroku, etc.)
   ```

4. **Deploy Frontend**
   ```bash
   # Build for production
   npm run build
   
   # Deploy to CDN or static hosting (Vercel, Netlify, AWS S3, etc.)
   ```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🔗 Social Media Integration

### Supported Platforms
- **YouTube**: Video analytics, subscriber growth, engagement metrics
- **Instagram**: Post engagement, story views, follower growth
- **TikTok**: Video views, likes, shares, comments
- **Twitter**: Tweet engagement, retweets, likes, followers
- **Facebook**: Page likes, post engagement, reach metrics

### Integration Setup
1. Obtain API keys from each platform
2. Configure OAuth for user authorization
3. Set up webhooks for real-time data
4. Implement reward calculation algorithms

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Vibe Coin Integration Guide](VIBE_COIN_INTEGRATION.md)
- [API Documentation](http://localhost:3000/api/docs)
- [Smart Contract Documentation](./contracts/README.md)

### Community
- **Discord**: [Join our community](https://discord.gg/your-invite)
- **Telegram**: [Join discussion](https://t.me/your-channel)
- **Twitter**: [@CreatorRewardsPlatform](https://twitter.com/your-handle)

### Issues and Bug Reports
- GitHub Issues: [Report bugs or request features](https://github.com/your-org/creator-rewards-platform/issues)
- Email Support: support@creator-rewards-platform.com

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Core platform development
- ✅ Vibe Coin integration
- ✅ Basic social media integrations
- ✅ Creator verification system

### Phase 2 (Q2 2024)
- 🔄 Advanced analytics dashboard
- 🔄 Mobile application
- 🔄 Additional blockchain networks
- 🔄 Enhanced creator tools

### Phase 3 (Q3 2024)
- 📅 Brand/sponsor marketplace
- 📅 NFT integration for content
- 📅 Advanced AI content analysis
- 📅 Cross-platform campaign management

### Phase 4 (Q4 2024)
- 📅 Decentralized governance
- 📅 Creator token economies
- 📅 Advanced DeFi integrations
- 📅 Global expansion

---

**Built with ❤️ for African creators**

*Empowering the next generation of content creators through blockchain technology and fair reward distribution.*