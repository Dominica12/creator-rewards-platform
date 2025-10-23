# Creator Rewards Platform - Backend API

A comprehensive NestJS-based backend API for the Creator Rewards Platform that manages creator content tracking, engagement analytics, and reward distribution.

## 🚀 Features

- **User Management**: Registration, authentication, and profile management
- **Creator Profiles**: Creator onboarding, verification, and tier management
- **Content Tracking**: Multi-platform content monitoring and analytics
- **Engagement Analytics**: Real-time engagement tracking and metrics
- **Reward System**: Automated reward calculation and distribution
- **Fraud Prevention**: Built-in security and fraud detection mechanisms
- **API Documentation**: Comprehensive Swagger/OpenAPI documentation
- **Database Integration**: PostgreSQL with TypeORM
- **Caching**: Redis integration for performance optimization
- **Security**: JWT authentication, rate limiting, and input validation

## 🛠 Tech Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Cache**: Redis
- **Authentication**: JWT + Passport
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Security**: bcrypt, throttling, CORS

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Redis (v6 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd creator-rewards-platform/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=creator_rewards
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h
   
   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb creator_rewards
   
   # Run migrations (auto-sync enabled in development)
   npm run start:dev
   ```

## 🚀 Running the Application

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Watch Mode
```bash
npm run start:debug
```

## 📚 API Documentation

Once the application is running, visit:
- **Swagger UI**: http://localhost:3000/api/docs
- **API Base URL**: http://localhost:3000/api/v1

## 🏗 Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── dto/               # Data transfer objects
│   ├── auth.controller.ts # Auth endpoints
│   ├── auth.service.ts    # Auth business logic
│   ├── jwt.strategy.ts    # JWT authentication strategy
│   ├── local.strategy.ts  # Local authentication strategy
│   └── auth.module.ts     # Auth module configuration
├── user/                  # User management module
│   ├── user.controller.ts # User endpoints
│   ├── user.service.ts    # User business logic
│   └── user.module.ts     # User module configuration
├── creator/               # Creator management module
│   ├── dto/               # Creator DTOs
│   ├── creator.controller.ts # Creator endpoints
│   ├── creator.service.ts    # Creator business logic
│   └── creator.module.ts     # Creator module configuration
├── entities/              # Database entities
│   ├── user.entity.ts     # User entity
│   ├── creator.entity.ts  # Creator entity
│   ├── content.entity.ts  # Content entity
│   ├── engagement.entity.ts # Engagement entity
│   ├── reward.entity.ts   # Reward entity
│   ├── transaction.entity.ts # Transaction entity
│   └── audit-log.entity.ts   # Audit log entity
├── config/               # Configuration files
│   ├── database.config.ts # Database configuration
│   └── configuration.ts   # Application configuration
├── app.module.ts         # Root application module
└── main.ts              # Application entry point
```

## 🗄 Database Schema

### Core Entities

- **Users**: User accounts and authentication
- **Creators**: Creator profiles and statistics
- **Content**: Content items across platforms
- **Engagements**: User interactions with content
- **Rewards**: Reward calculations and distributions
- **Transactions**: Payment and financial records
- **AuditLogs**: System activity tracking

## 🔐 Authentication

The API uses JWT-based authentication:

1. **Register**: `POST /api/v1/auth/register`
2. **Login**: `POST /api/v1/auth/login`
3. **Profile**: `GET /api/v1/auth/profile` (requires Bearer token)

### Example Usage

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","username":"testuser","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token in subsequent requests
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🎯 Key API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/profile` - Get current user profile
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Users
- `GET /api/v1/users` - Get all users (Admin)
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/profile` - Update current user profile
- `POST /api/v1/users/:id/verify-email` - Verify user email

### Creators
- `POST /api/v1/creators` - Register as creator
- `GET /api/v1/creators` - Get all creators (Admin)
- `GET /api/v1/creators/me` - Get current creator profile
- `GET /api/v1/creators/top` - Get top creators
- `GET /api/v1/creators/search` - Search creators
- `PATCH /api/v1/creators/:id/status` - Update creator status (Admin)
- `PATCH /api/v1/creators/:id/tier` - Update creator tier (Admin)

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📊 Monitoring and Logging

- **Health Check**: `GET /api/v1/health`
- **Metrics**: Built-in request logging
- **Rate Limiting**: 100 requests per minute per IP
- **Audit Logging**: All significant actions logged

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: class-validator decorators
- **Rate Limiting**: Request throttling
- **CORS Protection**: Configurable origins
- **SQL Injection Prevention**: TypeORM parameterized queries

## 🚀 Deployment

### Docker (Future Enhancement)
```bash
# Build image
docker build -t creator-rewards-api .

# Run container
docker run -p 3000:3000 creator-rewards-api
```

### Environment Variables for Production
```env
NODE_ENV=production
DB_SYNCHRONIZE=false
DB_LOGGING=false
JWT_SECRET=your-production-secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the codebase for implementation details
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
