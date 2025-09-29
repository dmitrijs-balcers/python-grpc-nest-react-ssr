import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users/users.service';
import { renderApp } from './views/render';

@Controller()
export class AppController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  async root(@Res() res: Response) {
    try {
      const { users, totalCount } = await this.usersService.getUsers(1, 100);
      
      const html = renderApp({
        users: users.map(u => ({
          id: u.id || 0,
          name: u.name || '',
          surname: u.surname || '',
          email: u.email || '',
          createdAt: Number(u.createdAt || 0),
          updatedAt: Number(u.updatedAt || 0),
        })),
        totalCount,
        error: null,
      });
      
      res.send(html);
    } catch (error: any) {
      console.error('Failed to fetch users:', error.message);
      
      const html = renderApp({
        users: [],
        totalCount: 0,
        error: 'Unable to connect to gRPC backend. Make sure the Python service is running on port 50051.',
      });
      
      res.send(html);
    }
  }
}
