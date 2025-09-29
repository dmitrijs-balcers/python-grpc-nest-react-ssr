# Node.js TypeScript gRPC Client Service

This service connects to the Python gRPC backend and provides a TypeScript interface for interacting with the ExampleService.

## Features

- ✅ **Auto-generated TypeScript types** from proto files
- ✅ **Type-safe gRPC client** with full IntelliSense support
- ✅ **Promise-based API** for easier async/await usage
- ✅ **Service layer** with high-level business logic methods
- ✅ **Error handling** with proper gRPC error codes

## Project Structure

```
src/
├── grpc/
│   ├── client.ts              # gRPC client initialization and management
│   └── generated/             # Auto-generated TypeScript types (DO NOT EDIT)
│       ├── example_service.ts
│       └── example/
│           ├── ExampleService.ts
│           ├── User.ts
│           ├── GetUserRequest.ts
│           ├── GetUserResponse.ts
│           ├── CreateUserRequest.ts
│           ├── CreateUserResponse.ts
│           ├── ListUsersRequest.ts
│           └── ListUsersResponse.ts
├── services/
│   └── user.service.ts        # High-level service methods
└── index.ts                   # Main entry point with examples
```

## Setup

### Prerequisites

- Node.js 20+ installed
- Python gRPC backend running on `localhost:50051`

### Installation

```bash
# Install dependencies
npm install

# Generate TypeScript types from proto files
npm run generate-proto
```

## Usage

### Running the Demo

The demo script connects to the Python gRPC server and demonstrates all available operations:

```bash
# Run with ts-node (generates types automatically)
npm run dev

# Or build and run
npm run build
npm start
```

### Using in Your Code

```typescript
import GrpcClient from './grpc/client';
import { UserService } from './services/user.service';

async function example() {
  // Initialize client
  const grpcClient = new GrpcClient('localhost:50051');
  await grpcClient.initialize();
  
  // Create service
  const userService = new UserService(grpcClient);
  
  // Get a user
  const user = await userService.getUser(1);
  console.log(user.name, user.email);
  
  // Create a user
  const newUser = await userService.createUser('John Doe', 'john@example.com');
  console.log(`Created user with ID: ${newUser.id}`);
  
  // List users
  const { users, totalCount } = await userService.listUsers(1, 10);
  console.log(`Total users: ${totalCount}`);
  users.forEach(u => console.log(u.name));
  
  // Cleanup
  grpcClient.close();
}
```

## Available Scripts

- `npm run dev` - Run the service in development mode (auto-generates types)
- `npm run build` - Build TypeScript to JavaScript (auto-generates types)
- `npm start` - Run the compiled service
- `npm run generate-proto` - Generate TypeScript types from proto files
- `npm run lint` - Type-check without emitting files

## Proto Type Generation

TypeScript types are automatically generated from the proto files using `proto-loader-gen-types`. The generation happens automatically before:
- Running `npm run dev`
- Running `npm run build`

You can also manually trigger generation:

```bash
npm run generate-proto
```

The generated files are located in `src/grpc/generated/` and should **NOT** be manually edited.

## API Reference

### GrpcClient

Main client class for managing the gRPC connection.

**Methods:**
- `initialize()` - Initialize the gRPC client and load proto definitions
- `getClient()` - Get the underlying gRPC client instance
- `isInitialized()` - Check if client is initialized
- `close()` - Close the gRPC connection

### UserService

High-level service for user operations.

**Methods:**
- `getUser(userId: number)` - Get a user by ID
- `createUser(name: string, email: string)` - Create a new user
- `listUsers(page?: number, pageSize?: number)` - List users with pagination

## Error Handling

The service properly handles gRPC errors:

```typescript
try {
  const user = await userService.getUser(999);
} catch (error) {
  console.error(error.message);  // "User with ID 999 not found"
  console.error(error.code);     // gRPC error code (e.g., 5 for NOT_FOUND)
  console.error(error.details);  // Detailed error message from server
}
```

## Connection Configuration

By default, the client connects to `localhost:50051`. To change this:

```typescript
const grpcClient = new GrpcClient('your-host:your-port');
```

## Development Notes

- The proto file is located at `../../shared/proto/example_service.proto`
- Generated types use `@grpc/proto-loader` for optimal TypeScript support
- All gRPC calls are converted to Promises using Node.js `util.promisify`
- The service uses insecure credentials (no TLS) - suitable for local development

## Troubleshooting

### "gRPC client not initialized"

Make sure to call `await grpcClient.initialize()` before using the client.

### Connection errors

Ensure the Python gRPC backend is running on the specified host and port:

```bash
# In the Python backend directory
poetry run python src/main.py
```

### Type generation issues

If types are not being generated correctly, try:

```bash
rm -rf src/grpc/generated
npm run generate-proto
```
