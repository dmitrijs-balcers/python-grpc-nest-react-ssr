# Quick Start Guide - Node.js gRPC Client

## Prerequisites
- Node.js 20+ installed
- Python gRPC backend running

## Installation

```bash
cd services/backend-nodejs
npm install
```

## Run the Demo

```bash
# Make sure Python backend is running first
cd services/backend-python
poetry run python src/main.py

# In another terminal, run the Node.js client
cd services/backend-nodejs
npm run dev
```

## Example Output

```
🚀 Starting Node.js gRPC Client Service
======================================

📁 Loading proto file from: /path/to/shared/proto/example_service.proto
✅ gRPC client initialized and connected to localhost:50051

📋 Testing gRPC Methods:

1️⃣  Listing existing users...
   ✅ Found 2 users:
      - John Doe (john@example.com) [ID: 1]
      - Jane Smith (jane@example.com) [ID: 2]

2️⃣  Getting user with ID 1...
   ✅ User found: John Doe (john@example.com)
      Created at: 2022-01-01T00:00:00.000Z

3️⃣  Creating a new user...
   ✅ User created successfully!
      ID: 3
      Name: Alice Johnson
      Email: alice@example.com

4️⃣  Listing all users again...
   ✅ Now we have 3 users:
      - John Doe (john@example.com) [ID: 1]
      - Jane Smith (jane@example.com) [ID: 2]
      - Alice Johnson (alice@example.com) [ID: 3]

5️⃣  Testing error handling (getting non-existent user)...
   ✅ Error caught successfully: 5 NOT_FOUND: User with ID 999 not found

✅ All tests completed successfully!
```

## Available Commands

```bash
npm run dev          # Run in development mode (auto-generates types)
npm run build        # Build for production (auto-generates types)
npm start            # Run compiled JavaScript
npm run generate-proto  # Manually generate TypeScript types
npm run lint         # Type-check without building
```

## Code Example

```typescript
import GrpcClient from './grpc/client';
import { UserService } from './services/user.service';

async function main() {
  // 1. Initialize client
  const grpcClient = new GrpcClient('localhost:50051');
  await grpcClient.initialize();
  
  // 2. Create service
  const userService = new UserService(grpcClient);
  
  // 3. Use the service
  const user = await userService.getUser(1);
  console.log(user);
  
  // 4. Cleanup
  grpcClient.close();
}

main();
```

## Files Created

- `src/grpc/client.ts` - gRPC client wrapper
- `src/services/user.service.ts` - Service layer with business logic
- `src/index.ts` - Demo application
- `src/grpc/generated/*` - Auto-generated TypeScript types
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `README.md` - Full documentation

## Key Features

✅ Auto-generated TypeScript types from proto files
✅ Type-safe gRPC client with IntelliSense
✅ Promise-based API (no callbacks)
✅ Automatic type generation before dev/build
✅ Comprehensive error handling
✅ Full demo showing all operations

## Troubleshooting

**Connection refused?**
- Make sure Python gRPC backend is running on port 50051

**Type errors?**
- Run `npm run generate-proto` to regenerate types

**Module not found?**
- Run `npm install` to install dependencies
