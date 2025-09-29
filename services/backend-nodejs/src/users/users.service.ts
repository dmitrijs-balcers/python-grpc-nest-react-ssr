import { Injectable } from '@nestjs/common';
import { UserService } from '../services/user.service';

@Injectable()
export class UsersService {
  constructor(private readonly userService: UserService) {}

  async getUsers(page: number, pageSize: number) {
    return await this.userService.listUsers(page, pageSize);
  }

  async getUser(id: number) {
    return await this.userService.getUser(id);
  }

  async createUser(name: string, email: string) {
    return await this.userService.createUser(name, email);
  }
}
