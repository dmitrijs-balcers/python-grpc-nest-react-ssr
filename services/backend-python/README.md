# Python gRPC Backend

User management service with gRPC and SQLAlchemy.

## Quick Start

```bash
# Install
poetry install

# Start server (Port 50051)
poetry run python src/main.py
```

## Development

```bash
poetry run pytest              # Run tests
poetry run python test_client.py  # Test gRPC calls
npm run generate-proto         # Regenerate proto types (from root)
```

## Structure

```
src/
├── api/              # gRPC service implementations
├── models/           # SQLAlchemy models
├── services/         # Business logic
├── interceptors/     # gRPC interceptors
└── main.py           # Entry point
```

## Environment

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
LOG_LEVEL=INFO
```
