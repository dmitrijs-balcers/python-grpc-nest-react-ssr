#!/usr/bin/env python3
"""Health check script for the gRPC server."""

import grpc
import sys
import time

# Add proto_generated to path
sys.path.append('proto_generated')
import example_service_pb2
import example_service_pb2_grpc


def health_check():
    """Perform a simple health check on the gRPC server."""
    try:
        # Create channel with timeout
        channel = grpc.insecure_channel('localhost:50051')
        
        # Wait for channel to be ready (with timeout)
        grpc.channel_ready_future(channel).result(timeout=5)
        
        # Try a simple request
        stub = example_service_pb2_grpc.ExampleServiceStub(channel)
        request = example_service_pb2.ListUsersRequest(page=1, page_size=1)
        response = stub.ListUsers(request, timeout=5)
        
        print("✅ gRPC server is healthy")
        print(f"📊 Server has {response.total_count} users")
        channel.close()
        return True
        
    except grpc.RpcError as e:
        print(f"❌ gRPC server error: {e.code()} - {e.details()}")
        return False
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False


if __name__ == "__main__":
    print("🏥 Checking gRPC server health...")
    success = health_check()
    sys.exit(0 if success else 1)