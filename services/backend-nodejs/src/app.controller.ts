import { Controller, Get, Render } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Render('index')
  async root() {
    try {
      const { users, totalCount } = await this.usersService.getUsers(1, 100);
      
      return {
        users,
        totalCount,
        error: null,
      };
    } catch (error: any) {
      console.error('Failed to fetch users:', error.message);
      
      return {
        users: [],
        totalCount: 0,
        error: 'Unable to connect to gRPC backend. Make sure the Python service is running on port 50051.',
      };
    }
  }
}
