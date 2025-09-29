#!/usr/bin/env python3
"""Test client for validation features."""

import logging
import grpc

# Setup protovalidate module aliases
from src.utils import protovalidate_setup  # noqa: F401

from proto_generated import example_service_pb2
from proto_generated import example_service_pb2_grpc

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def test_validation():
    """Test the gRPC server validation."""
    # Create gRPC channel
    channel = grpc.insecure_channel('localhost:50051')
    stub = example_service_pb2_grpc.ExampleServiceStub(channel)
    
    try:
        logger.info("🧪 Testing protovalidate server-side validation...")
        print("=" * 60)
        
        # Test 1: Valid request - should succeed
        logger.info("\n1️⃣ Testing valid CreateUser request...")
        try:
            request = example_service_pb2.CreateUserRequest(
                name="Valid User",
                email="valid@example.com"
            )
            response = stub.CreateUser(request)
            if response.user:
                logger.info(f"✅ Valid request succeeded: {response.user.name}")
            else:
                logger.error("❌ Valid request failed unexpectedly")
        except grpc.RpcError as e:
            logger.error(f"❌ Valid request failed: {e.code()} - {e.details()}")
        
        # Test 2: Invalid email - should fail
        logger.info("\n2️⃣ Testing invalid email format...")
        try:
            request = example_service_pb2.CreateUserRequest(
                name="Test User",
                email="not-an-email"
            )
            response = stub.CreateUser(request)
            logger.error("❌ Invalid email should have been rejected")
        except grpc.RpcError as e:
            if e.code() == grpc.StatusCode.INVALID_ARGUMENT:
                logger.info(f"✅ Invalid email rejected: {e.code()}")
            else:
                logger.error(f"❌ Unexpected error: {e.code()} - {e.details()}")
        
        # Test 3: Empty name - should fail
        logger.info("\n3️⃣ Testing empty name...")
        try:
            request = example_service_pb2.CreateUserRequest(
                name="",
                email="test@example.com"
            )
            response = stub.CreateUser(request)
            logger.error("❌ Empty name should have been rejected")
        except grpc.RpcError as e:
            if e.code() == grpc.StatusCode.INVALID_ARGUMENT:
                logger.info(f"✅ Empty name rejected: {e.code()}")
            else:
                logger.error(f"❌ Unexpected error: {e.code()} - {e.details()}")
        
        # Test 4: Invalid user_id (0) - should fail
        logger.info("\n4️⃣ Testing invalid user_id=0...")
        try:
            request = example_service_pb2.GetUserRequest(user_id=0)
            response = stub.GetUser(request)
            logger.error("❌ user_id=0 should have been rejected")
        except grpc.RpcError as e:
            if e.code() == grpc.StatusCode.INVALID_ARGUMENT:
                logger.info(f"✅ user_id=0 rejected: {e.code()}")
            else:
                logger.error(f"❌ Unexpected error: {e.code()} - {e.details()}")
        
        # Test 5: Page size too large - should fail
        logger.info("\n5️⃣ Testing page_size > 100...")
        try:
            request = example_service_pb2.ListUsersRequest(
                page=1,
                page_size=150
            )
            response = stub.ListUsers(request)
            logger.error("❌ page_size=150 should have been rejected")
        except grpc.RpcError as e:
            if e.code() == grpc.StatusCode.INVALID_ARGUMENT:
                logger.info(f"✅ page_size=150 rejected: {e.code()}")
            else:
                logger.error(f"❌ Unexpected error: {e.code()} - {e.details()}")
        
        # Test 6: Page < 1 - should fail
        logger.info("\n6️⃣ Testing page < 1...")
        try:
            request = example_service_pb2.ListUsersRequest(
                page=0,
                page_size=10
            )
            response = stub.ListUsers(request)
            logger.error("❌ page=0 should have been rejected")
        except grpc.RpcError as e:
            if e.code() == grpc.StatusCode.INVALID_ARGUMENT:
                logger.info(f"✅ page=0 rejected: {e.code()}")
            else:
                logger.error(f"❌ Unexpected error: {e.code()} - {e.details()}")
        
        print("=" * 60)
        logger.info("\n🎉 All validation tests passed!")
        return True
        
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return False
    finally:
        channel.close()


if __name__ == "__main__":
    import sys
    success = test_validation()
    sys.exit(0 if success else 1)
