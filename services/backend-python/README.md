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
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python -m alembic upgrade head

# Start server
python src/main.py
```

## 🔧 Development

- Use `requirements.txt` for dependencies
- Use `alembic` for database migrations
- Use `pytest` for testing
- Use `grpcio-tools` for proto compilation