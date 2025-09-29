"""Main entry point for the gRPC server."""

import logging
import signal
import sys
import time
from concurrent import futures

import grpc

# Setup protovalidate module aliases BEFORE importing proto files
from src.utils import protovalidate_setup  # noqa: F401

# Import our service implementation
from src.api.example_service import ExampleServiceServicer
from src.interceptors import ValidationInterceptor

# Import generated gRPC code
from proto_generated import example_service_pb2_grpc

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def serve():
    """Start the gRPC server."""
    # Create gRPC server with validation interceptor
    interceptors = [ValidationInterceptor()]
    server = grpc.server(
        futures.ThreadPoolExecutor(max_workers=10),
        interceptors=interceptors
    )
    
    # Add our service to the server
    example_service_servicer = ExampleServiceServicer()
    example_service_pb2_grpc.add_ExampleServiceServicer_to_server(
        example_service_servicer, server
    )
    
    # Configure server address
    listen_addr = '[::]:50051'
    server.add_insecure_port(listen_addr)
    
    # Start server
    server.start()
    logger.info(f"🚀 gRPC server started on {listen_addr}")
    logger.info("📋 Available services:")
    logger.info("  - ExampleService (GetUser, CreateUser, ListUsers)")
    logger.info("🔍 Use grpcurl or a gRPC client to test the service")
    logger.info("💡 Example: grpcurl -plaintext localhost:50051 list")
    
    # Handle graceful shutdown
    def signal_handler(signum, frame):
        logger.info("🛑 Received shutdown signal, stopping server...")
        server.stop(0)
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    try:
        # Keep the server running
        while True:
            time.sleep(86400)  # Sleep for a day
    except KeyboardInterrupt:
        logger.info("🛑 Server interrupted by user")
        server.stop(0)


def main():
    """Main function."""
    logger.info("🐍 Starting Python gRPC backend server...")
    serve()


if __name__ == "__main__":
    main()