# Backend Python Service

gRPC microservice built with Python, handles database operations and business logic.

## 📁 Structure

```
src/
├── api/           # gRPC service implementations
├── models/        # Database models (SQLAlchemy/Pydantic)
├── services/      # Business logic layer
├── database/      # Database connection and configuration
├── config/        # Application configuration
└── utils/         # Helper functions and utilities

tests/
├── unit/          # Unit tests
└── integration/   # Integration tests with database

migrations/        # Database migration scripts
proto_generated/   # Generated gRPC code (auto-generated)
```

## 🛠️ Setup

```bash
# Install dependencies with Poetry
poetry install

# Activate virtual environment
poetry shell

# Run migrations
poetry run alembic upgrade head

# Start server
poetry run python src/main.py
```

## 🔧 Development

- Use `Poetry` for dependency management
- Use `alembic` for database migrations
- Use `pytest` for testing
- Use `grpcio-tools` for proto compilation

## 📦 Common Commands

```bash
# Add new dependency
poetry add <package>

# Add development dependency
poetry add --group dev <package>

# Run tests
poetry run pytest

# Run linting
poetry run black src/
poetry run isort src/
```