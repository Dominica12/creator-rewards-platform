import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Creator Rewards Platform API! 🚀 Visit /api/docs for documentation.';
  }
}
