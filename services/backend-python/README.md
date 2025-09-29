# Python gRPC Backend Service

A Python-based gRPC microservice with SQLAlchemy database integration.

## Features

- gRPC service implementation
- SQLAlchemy ORM for database operations
- Alembic for database migrations
- Pydantic for data validation
- PostgreSQL support

## Setup

### Prerequisites

- Python 3.9+
- Poetry

### Installation

```bash
# Install dependencies
poetry install

# Activate virtual environment
poetry shell
```

## Running the Service

```bash
# Start the gRPC server
poetry run python src/main.py

# Or using the script
poetry run server
```

The server will start on `localhost:50051`.

## Development

### Generate Proto Files

```bash
# From project root
npm run generate-proto

# Or directly
cd services/backend-python
python -m grpc_tools.protoc \
  -I../../shared/proto \
  --python_out=proto_generated \
  --grpc_python_out=proto_generated \
  ../../shared/proto/example_service.proto
```

### Code Quality

```bash
# Format code
poetry run black src/

# Sort imports
poetry run isort src/

# Lint
poetry run flake8 src/

# Type check
poetry run mypy src/
```

### Testing

```bash
# Run tests
poetry run pytest

# With coverage
poetry run pytest --cov=src
```

## Project Structure

```
src/
├── api/              # gRPC service implementations
├── config/           # Configuration
├── database/         # Database setup
├── models/           # SQLAlchemy models
├── services/         # Business logic
├── utils/            # Utilities
└── main.py           # Entry point

proto_generated/      # Generated protobuf files
tests/                # Test files
migrations/           # Alembic migrations
```

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
LOG_LEVEL=INFO
```

## Available Commands

- `poetry run server` - Start the gRPC server
- `poetry run pytest` - Run tests
- `poetry run black src/` - Format code
- `poetry run mypy src/` - Type check
