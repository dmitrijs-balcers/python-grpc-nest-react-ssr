"""gRPC interceptor for protovalidate validation."""

import logging
from typing import Callable, Any

import grpc

# Setup protovalidate module aliases
from src.utils import protovalidate_setup  # noqa: F401

from protovalidate import validate, ValidationError

logger = logging.getLogger(__name__)


class ValidationInterceptor(grpc.ServerInterceptor):
    """Interceptor that validates incoming gRPC requests using protovalidate."""
    
    def __init__(self):
        """Initialize the validation interceptor."""
        logger.info("🔒 ValidationInterceptor initialized")

    def intercept_service(
        self,
        continuation: Callable,
        handler_call_details: grpc.HandlerCallDetails,
    ) -> grpc.RpcMethodHandler:
        """Intercept gRPC service calls to validate requests."""
        logger.info(f"🔍 Intercepting service call: {handler_call_details.method}")
        
        # Get the original handler
        handler = continuation(handler_call_details)
        
        if handler is None:
            return None
        
        # Wrap the handler with validation
        if handler.unary_unary:
            return self._wrap_unary_unary(handler)
        elif handler.unary_stream:
            return self._wrap_unary_stream(handler)
        elif handler.stream_unary:
            return self._wrap_stream_unary(handler)
        elif handler.stream_stream:
            return self._wrap_stream_stream(handler)
        
        return handler

    def _validate_request(self, request: Any, context: grpc.ServicerContext) -> bool:
        """Validate a request message using protovalidate.
        
        Args:
            request: The request message to validate
            context: The gRPC context
            
        Returns:
            True if validation passes, False otherwise
        """
        try:
            logger.info(f"Validating request: {type(request).__name__}")
            validate(request)
            logger.info("Validation passed")
            return True
        except ValidationError as e:
            logger.warning(f"Validation failed for {type(request).__name__}: {e}")
            context.abort(
                grpc.StatusCode.INVALID_ARGUMENT,
                f"Validation failed: {e}"
            )
            return False

    def _wrap_unary_unary(self, handler: grpc.RpcMethodHandler) -> grpc.RpcMethodHandler:
        """Wrap unary-unary handler with validation."""
        original_handler = handler.unary_unary

        def wrapper(request: Any, context: grpc.ServicerContext) -> Any:
            if not self._validate_request(request, context):
                return None
            return original_handler(request, context)

        return grpc.unary_unary_rpc_method_handler(
            wrapper,
            request_deserializer=handler.request_deserializer,
            response_serializer=handler.response_serializer,
        )

    def _wrap_unary_stream(self, handler: grpc.RpcMethodHandler) -> grpc.RpcMethodHandler:
        """Wrap unary-stream handler with validation."""
        original_handler = handler.unary_stream

        def wrapper(request: Any, context: grpc.ServicerContext) -> Any:
            if not self._validate_request(request, context):
                return None
            return original_handler(request, context)

        return grpc.unary_stream_rpc_method_handler(
            wrapper,
            request_deserializer=handler.request_deserializer,
            response_serializer=handler.response_serializer,
        )

    def _wrap_stream_unary(self, handler: grpc.RpcMethodHandler) -> grpc.RpcMethodHandler:
        """Wrap stream-unary handler with validation."""
        original_handler = handler.stream_unary

        def wrapper(request_iterator: Any, context: grpc.ServicerContext) -> Any:
            # Validate each request in the stream
            def validated_iterator():
                for request in request_iterator:
                    if not self._validate_request(request, context):
                        return
                    yield request
            
            return original_handler(validated_iterator(), context)

        return grpc.stream_unary_rpc_method_handler(
            wrapper,
            request_deserializer=handler.request_deserializer,
            response_serializer=handler.response_serializer,
        )

    def _wrap_stream_stream(self, handler: grpc.RpcMethodHandler) -> grpc.RpcMethodHandler:
        """Wrap stream-stream handler with validation."""
        original_handler = handler.stream_stream

        def wrapper(request_iterator: Any, context: grpc.ServicerContext) -> Any:
            # Validate each request in the stream
            def validated_iterator():
                for request in request_iterator:
                    if not self._validate_request(request, context):
                        return
                    yield request
            
            return original_handler(validated_iterator(), context)

        return grpc.stream_stream_rpc_method_handler(
            wrapper,
            request_deserializer=handler.request_deserializer,
            response_serializer=handler.response_serializer,
        )
