import GrpcClient from './grpc/client';
import { UserService } from './services/user.service';

/**
 * Main entry point for the Node.js gRPC client service
 */
async function main() {
  console.log('🚀 Starting Node.js gRPC Client Service');
  console.log('======================================\n');

  // Initialize gRPC client
  const grpcClient = new GrpcClient('localhost:50051');
  
  try {
    await grpcClient.initialize();
    
    // Create user service
    const userService = new UserService(grpcClient);
    
    console.log('\n📋 Testing gRPC Methods:\n');
    
    // 1. List existing users
    console.log('1️⃣  Listing existing users...');
    const { users: initialUsers, totalCount: initialCount } = await userService.listUsers(1, 10);
    console.log(`   ✅ Found ${initialCount} users:`);
    initialUsers.forEach(user => {
      console.log(`      - ${user.name} (${user.email}) [ID: ${user.id}]`);
    });
    
    // 2. Get a specific user
    console.log('\n2️⃣  Getting user with ID 1...');
    const user1 = await userService.getUser(1);
    console.log(`   ✅ User found: ${user1.name} (${user1.email})`);
    console.log(`      Created at: ${new Date(Number(user1.createdAt) * 1000).toISOString()}`);
    
    // 3. Create a new user
    console.log('\n3️⃣  Creating a new user...');
    const newUser = await userService.createUser('Alice Johnson', 'alice@example.com');
    console.log(`   ✅ User created successfully!`);
    console.log(`      ID: ${newUser.id}`);
    console.log(`      Name: ${newUser.name}`);
    console.log(`      Email: ${newUser.email}`);
    
    // 4. List users again to see the new user
    console.log('\n4️⃣  Listing all users again...');
    const { users: finalUsers, totalCount: finalCount } = await userService.listUsers(1, 10);
    console.log(`   ✅ Now we have ${finalCount} users:`);
    finalUsers.forEach(user => {
      console.log(`      - ${user.name} (${user.email}) [ID: ${user.id}]`);
    });
    
    // 5. Test error handling - try to get non-existent user
    console.log('\n5️⃣  Testing error handling (getting non-existent user)...');
    try {
      await userService.getUser(999);
    } catch (error: any) {
      console.log(`   ✅ Error caught successfully: ${error.message}`);
    }
    
    console.log('\n✅ All tests completed successfully!');
    console.log('======================================\n');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error(`   gRPC Error Code: ${error.code}`);
    }
    if (error.details) {
      console.error(`   Details: ${error.details}`);
    }
    process.exit(1);
  } finally {
    // Clean up
    grpcClient.close();
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: any) => {
  console.error('❌ Unhandled Promise Rejection:', error.message);
  process.exit(1);
});

// Run the main function
main().catch(error => {
  console.error('❌ Fatal Error:', error);
  process.exit(1);
});
