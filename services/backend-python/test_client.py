#!/usr/bin/env python3
"""Test client for the gRPC server."""

import logging
import sys
import grpc

# Setup protovalidate module aliases
from src.utils import protovalidate_setup  # noqa: F401

from proto_generated import example_service_pb2
from proto_generated import example_service_pb2_grpc

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_grpc_server():
    """Test the gRPC server functionality."""
    # Create gRPC channel
    channel = grpc.insecure_channel('localhost:50051')
    stub = example_service_pb2_grpc.ExampleServiceStub(channel)
    
    try:
        logger.info("🔍 Testing gRPC server...")
        
        # Test 1: List existing users
        logger.info("1️⃣ Testing ListUsers...")
        list_request = example_service_pb2.ListUsersRequest(page=1, page_size=10)
        list_response = stub.ListUsers(list_request)
        logger.info(f"Found {list_response.total_count} users:")
        for user in list_response.users:
            logger.info(f"  - {user.name} ({user.email}) ID: {user.id}")
        
        # Test 2: Get specific user
        logger.info("\n2️⃣ Testing GetUser...")
        get_request = example_service_pb2.GetUserRequest(user_id=1)
        get_response = stub.GetUser(get_request)
        if get_response.user:
            user = get_response.user
            logger.info(f"Retrieved user: {user.name} ({user.email})")
        else:
            logger.error("User not found!")
        
        # Test 3: Create new user
        logger.info("\n3️⃣ Testing CreateUser...")
        create_request = example_service_pb2.CreateUserRequest(
            name="Test User",
            email="test@example.com"
        )
        create_response = stub.CreateUser(create_request)
        if create_response.user:
            user = create_response.user
            logger.info(f"Created user: {user.name} ({user.email}) ID: {user.id}")
        else:
            logger.error("Failed to create user!")
        
        # Test 4: List users again to see the new one
        logger.info("\n4️⃣ Testing ListUsers after creation...")
        list_response = stub.ListUsers(list_request)
        logger.info(f"Now have {list_response.total_count} users:")
        for user in list_response.users:
            logger.info(f"  - {user.name} ({user.email}) ID: {user.id}")
        
        # Test 5: Try to get non-existent user
        logger.info("\n5️⃣ Testing GetUser with invalid ID...")
        try:
            get_request = example_service_pb2.GetUserRequest(user_id=999)
            get_response = stub.GetUser(get_request)
            logger.error("Should have failed!")
        except grpc.RpcError as e:
            logger.info(f"✅ Correctly handled error: {e.code()} - {e.details()}")
        
        logger.info("\n✅ All tests completed successfully!")
        
    except grpc.RpcError as e:
        logger.error(f"❌ gRPC error: {e.code()} - {e.details()}")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return False
    finally:
        channel.close()
    
    return True


if __name__ == "__main__":
    success = test_grpc_server()
    sys.exit(0 if success else 1)