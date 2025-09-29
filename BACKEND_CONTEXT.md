# Backend Context Documentation

## Project Overview
- **Type**: Python gRPC Microservice
- **Framework**: gRPC with Python 3.9+
- **Package Manager**: Poetry
- **Location**: `services/backend-python/`

## Architecture

### Core Services
- **Main Service**: `ExampleService` - User management gRPC service
- **Server Location**: `src/main.py`
- **Service Implementation**: `src/api/example_service.py`
- **Server Port**: `50051` (gRPC)
- **Protocol**: gRPC (not HTTP REST)

### gRPC Service Definition
**File**: `shared/proto/example_service.proto`

**Available RPCs:**
1. `GetUser(GetUserRequest) -> GetUserResponse` - Retrieve user by ID
2. `CreateUser(CreateUserRequest) -> CreateUserResponse` - Create new user
3. `ListUsers(ListUsersRequest) -> ListUsersResponse` - List users with pagination

**Data Model:**
```protobuf
message User {
  int32 id = 1;
  string name = 2;
  string email = 3;
  int64 created_at = 4;
  int64 updated_at = 5;
}
```

### Generated Code
- **Location**: `services/backend-python/proto_generated/`
- **Files**: 
  - `example_service_pb2.py` - Message classes
  - `example_service_pb2_grpc.py` - Service stubs and servicer classes

## Current Implementation Details

### Data Storage
- **Type**: In-memory storage (not persistent)
- **Location**: `ExampleServiceServicer.__init__()` method
- **Initial Data**: 2 demo users (John Doe, Jane Smith)
- **Auto-increment**: `next_user_id` starts at 3

### Service Logic
**GetUser:**
- Returns user by ID
- Returns `NOT_FOUND` status if user doesn't exist

**CreateUser:**
- Validates name and email are provided
- Checks for duplicate email addresses
- Returns `ALREADY_EXISTS` if email exists
- Returns `INVALID_ARGUMENT` for missing fields

**ListUsers:**
- Supports pagination (page, page_size)
- Default page_size: 10, max: 100
- Returns total_count for pagination UI

### Error Handling
- Uses proper gRPC status codes:
  - `NOT_FOUND` - User doesn't exist
  - `ALREADY_EXISTS` - Duplicate email
  - `INVALID_ARGUMENT` - Missing required fields

## Dependencies & Configuration

### Poetry Configuration (`pyproject.toml`)
**Core Dependencies:**
- `grpcio ^1.75.1` - gRPC runtime
- `grpcio-tools ^1.75.1` - Protocol buffer compiler
- `sqlalchemy ^2.0.23` - Database ORM (not currently used)
- `alembic ^1.12.1` - Database migrations (not currently used)
- `pydantic ^2.4.2` - Data validation (not currently used)
- `psycopg2-binary ^2.9.7` - PostgreSQL driver (not currently used)

**Dev Dependencies:**
- `pytest ^7.4.3` - Testing
- `black ^23.9.1` - Code formatting
- `isort ^5.12.0` - Import sorting
- `flake8 ^6.1.0` - Linting
- `mypy ^1.6.1` - Type checking

### Scripts Available
```bash
# From root directory
npm run dev:backend          # Start gRPC server
npm run test:backend         # Run tests
npm run test:grpc           # Test gRPC client
npm run health:backend      # Health check

# From backend directory
poetry run python src/main.py  # Start server
poetry run pytest              # Run tests
```

## Frontend Integration Status

### Current Issue
- **Backend**: Runs on `localhost:50051` (gRPC protocol)
- **Frontend**: Expects `localhost:8080` (HTTP REST protocol)
- **Status**: Frontend falls back to mock data due to protocol mismatch

### Missing Components
1. **gRPC-Web Proxy** - To allow browser gRPC calls
2. **REST Gateway** - To translate HTTP to gRPC
3. **CORS Configuration** - For browser access

### Mock Data in Frontend
The frontend (`services/frontend-typescript/src/services/grpcClient.ts`) contains hardcoded fallback data:
- John Doe (john@example.com)
- Jane Smith (jane@example.com)  
- Bob Johnson (bob@example.com)

## Development Workflow

### Starting the Backend
```bash
cd services/backend-python
poetry install
poetry run python src/main.py
```

### Testing gRPC Service
```bash
# Using grpcurl (if installed)
grpcurl -plaintext localhost:50051 list
grpcurl -plaintext localhost:50051 example.ExampleService/ListUsers

# Using project test client
cd services/backend-python
poetry run python test_client.py
```

### Code Generation
Proto files are compiled using the script:
```bash
./scripts/generate-proto.sh
```

## Future Enhancements Needed

### Database Integration
- SQLAlchemy models are configured but not used
- Alembic migrations ready but not implemented
- PostgreSQL connection configured but not active

### Production Readiness
- Add proper database persistence
- Implement health checks
- Add metrics and monitoring
- Configure logging levels
- Add configuration management (.env files)

### Frontend Integration
- Add gRPC-Web proxy (Envoy recommended)
- Or implement REST gateway alongside gRPC
- Configure CORS for browser access

## File Structure
```
services/backend-python/
├── src/
│   ├── api/
│   │   └── example_service.py    # gRPC service implementation
│   ├── config/                   # Empty (future config)
│   ├── database/                 # Empty (future DB code)
│   ├── models/                   # Empty (future SQLAlchemy models)
│   ├── services/                 # Empty (future business logic)
│   ├── utils/                    # Empty (future utilities)
│   └── main.py                   # Server entry point
├── proto_generated/              # Generated gRPC code
├── tests/                        # Test files
├── migrations/                   # Empty (future Alembic migrations)
├── pyproject.toml               # Poetry configuration
├── test_client.py               # gRPC test client
├── health_check.py              # Server health check
└── README.md
```

## Logging & Debugging
- **Log Level**: INFO
- **Server Logs**: Show service calls and parameters
- **Health Check**: Available via `health_check.py`
- **Test Client**: `test_client.py` for manual testing

## Notes for Future Development
1. **Database**: Ready for SQLAlchemy integration with PostgreSQL
2. **Testing**: Pytest framework configured with coverage
3. **Code Quality**: Black, isort, flake8, mypy all configured
4. **Type Safety**: Full typing support with mypy validation
5. **Docker**: Infrastructure exists in `docker/` directory (not detailed here)