/**
 * gRPC Client for connecting to the Python backend
 * 
 * Note: This is a simplified implementation for demo purposes.
 * In production, you'd typically use gRPC-Web or a REST proxy.
 */

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: number;
  updated_at: number;
}

export interface ListUsersRequest {
  page: number;
  page_size: number;
}

export interface ListUsersResponse {
  users: User[];
  total_count: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}

export interface GetUserRequest {
  user_id: number;
}

/**
 * Mock gRPC client that simulates the Python backend
 * In a real implementation, this would use gRPC-Web or connect through a proxy
 */
export class GrpcClient {
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:8080') {
    this.baseUrl = baseUrl;
  }

  /**
   * List users with pagination
   */
  async listUsers(request: ListUsersRequest): Promise<ListUsersResponse> {
    // Simulate API call - in real implementation, this would be a gRPC-Web call
    try {
      const response = await fetch(`${this.baseUrl}/api/users?page=${request.page}&page_size=${request.page_size}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      // Fallback to mock data for demo
      console.warn('Using mock data (gRPC server not connected via web proxy):', error);
      return this.getMockUsers(request);
    }
  }

  /**
   * Get a specific user by ID
   */
  async getUser(request: GetUserRequest): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users/${request.user_id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      // Fallback to mock data
      console.warn('Using mock data (gRPC server not connected via web proxy):', error);
      const mockData = this.getMockUsers({ page: 1, page_size: 100 });
      return mockData.users.find(u => u.id === request.user_id) || null;
    }
  }

  /**
   * Create a new user
   */
  async createUser(request: CreateUserRequest): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      // Fallback to mock creation
      console.warn('Using mock data (gRPC server not connected via web proxy):', error);
      return {
        id: Math.floor(Math.random() * 1000) + 100,
        name: request.name,
        email: request.email,
        created_at: Math.floor(Date.now() / 1000),
        updated_at: Math.floor(Date.now() / 1000),
      };
    }
  }

  /**
   * Mock data for development/demo purposes
   */
  private getMockUsers(request: ListUsersRequest): ListUsersResponse {
    const allUsers: User[] = [
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        created_at: 1640995200,
        updated_at: 1640995200,
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@example.com", 
        created_at: 1640995200,
        updated_at: 1640995200,
      },
      {
        id: 3,
        name: "Bob Johnson",
        email: "bob@example.com",
        created_at: 1641081600,
        updated_at: 1641081600,
      },
    ];

    const startIndex = (request.page - 1) * request.page_size;
    const endIndex = startIndex + request.page_size;
    const users = allUsers.slice(startIndex, endIndex);

    return {
      users,
      total_count: allUsers.length,
    };
  }
}

// Export singleton instance
export const grpcClient = new GrpcClient();