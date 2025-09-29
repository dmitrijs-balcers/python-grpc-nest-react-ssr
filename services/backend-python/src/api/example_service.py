"""Example gRPC service implementation."""

import logging
from typing import Iterator
import grpc
from concurrent import futures

# Import generated gRPC code
from proto_generated import example_service_pb2
from proto_generated import example_service_pb2_grpc

logger = logging.getLogger(__name__)


class ExampleServiceServicer(example_service_pb2_grpc.ExampleServiceServicer):
    """Implementation of ExampleService gRPC service."""

    def __init__(self):
        # In-memory storage for demo purposes
        self.users = {
            1: example_service_pb2.User(
                id=1,
                name="John Doe",
                email="john@example.com",
                created_at=1640995200,  # 2022-01-01 timestamp
                updated_at=1640995200
            ),
            2: example_service_pb2.User(
                id=2,
                name="Jane Smith",
                email="jane@example.com",
                created_at=1640995200,
                updated_at=1640995200
            )
        }
        self.next_user_id = 3

    def GetUser(self, request: example_service_pb2.GetUserRequest, context: grpc.ServicerContext) -> example_service_pb2.GetUserResponse:
        """Get a user by ID."""
        logger.info(f"GetUser called with user_id: {request.user_id}")
        
        user = self.users.get(request.user_id)
        if user is None:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details(f"User with ID {request.user_id} not found")
            return example_service_pb2.GetUserResponse()
        
        return example_service_pb2.GetUserResponse(user=user)

    def CreateUser(self, request: example_service_pb2.CreateUserRequest, context: grpc.ServicerContext) -> example_service_pb2.CreateUserResponse:
        """Create a new user."""
        logger.info(f"CreateUser called with name: {request.name}, email: {request.email}")
        
        # Validation is now handled by ValidationInterceptor
        
        # Check if email already exists
        for user in self.users.values():
            if user.email == request.email:
                context.set_code(grpc.StatusCode.ALREADY_EXISTS)
                context.set_details(f"User with email {request.email} already exists")
                return example_service_pb2.CreateUserResponse()
        
        # Create new user
        import time
        current_time = int(time.time())
        
        new_user = example_service_pb2.User(
            id=self.next_user_id,
            name=request.name,
            email=request.email,
            created_at=current_time,
            updated_at=current_time
        )
        
        self.users[self.next_user_id] = new_user
        self.next_user_id += 1
        
        return example_service_pb2.CreateUserResponse(user=new_user)

    def ListUsers(self, request: example_service_pb2.ListUsersRequest, context: grpc.ServicerContext) -> example_service_pb2.ListUsersResponse:
        """List users with pagination."""
        logger.info(f"ListUsers called with page: {request.page}, page_size: {request.page_size}")
        
        # Validation is now handled by ValidationInterceptor
        # Default values if not set
        page = request.page if request.page > 0 else 1
        page_size = request.page_size if request.page_size > 0 else 10
        
        # Get all users as a list
        all_users = list(self.users.values())
        total_count = len(all_users)
        
        # Calculate pagination
        start_index = (page - 1) * page_size
        end_index = start_index + page_size
        
        # Get paginated users
        paginated_users = all_users[start_index:end_index]
        
        return example_service_pb2.ListUsersResponse(
            users=paginated_users,
            total_count=total_count
        )