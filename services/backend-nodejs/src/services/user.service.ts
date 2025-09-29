import { Injectable } from '@nestjs/common';
import { promisify } from 'util';
import GrpcClient from '../grpc/client';
import { GetUserRequest } from '../grpc/generated/example/GetUserRequest';
import { CreateUserRequest } from '../grpc/generated/example/CreateUserRequest';
import { ListUsersRequest } from '../grpc/generated/example/ListUsersRequest';
import { User__Output } from '../grpc/generated/example/User';
import { GetUserResponse__Output } from '../grpc/generated/example/GetUserResponse';
import { CreateUserResponse__Output } from '../grpc/generated/example/CreateUserResponse';
import { ListUsersResponse__Output } from '../grpc/generated/example/ListUsersResponse';

/**
 * User Service - Provides high-level methods to interact with the gRPC backend
 */
@Injectable()
export class UserService {
  constructor(private readonly grpcClient: GrpcClient) {}

  /**
   * Get a user by ID
   * @param userId - The ID of the user to retrieve
   * @returns Promise with user data
   */
  async getUser(userId: number): Promise<User__Output> {
    const client = this.grpcClient.getClient();
    const getUserAsync = promisify(client.GetUser.bind(client));
    
    const request: GetUserRequest = { userId: userId };
    const response = await getUserAsync(request) as GetUserResponse__Output;
    
    if (!response.user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return response.user;
  }

  /**
   * Create a new user
   * @param name - User's name
   * @param email - User's email
   * @returns Promise with created user data
   */
  async createUser(name: string, email: string): Promise<User__Output> {
    const client = this.grpcClient.getClient();
    const createUserAsync = promisify(client.CreateUser.bind(client));
    
    const request: CreateUserRequest = { name, email };
    const response = await createUserAsync(request) as CreateUserResponse__Output;
    
    if (!response.user) {
      throw new Error('Failed to create user');
    }
    
    return response.user;
  }

  /**
   * List users with pagination
   * @param page - Page number (default: 1)
   * @param pageSize - Number of users per page (default: 10)
   * @returns Promise with list of users and total count
   */
  async listUsers(page: number = 1, pageSize: number = 10): Promise<{
    users: User__Output[];
    totalCount: number;
  }> {
    const client = this.grpcClient.getClient();
    const listUsersAsync = promisify(client.ListUsers.bind(client));
    
    const request: ListUsersRequest = { page, pageSize: pageSize };
    const response = await listUsersAsync(request) as ListUsersResponse__Output;
    
    return {
      users: response.users || [],
      totalCount: response.totalCount || 0,
    };
  }
}
