import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import GrpcClient from '../grpc/client';
import { UserService } from '../services/user.service';

@Module({
  providers: [GrpcClient, UserService, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
