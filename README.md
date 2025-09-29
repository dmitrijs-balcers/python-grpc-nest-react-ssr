# Microservices Monorepo

A monorepo containing Python gRPC backend and TypeScript frontend services.

## 🏗️ Architecture

- **Backend Service** (Python): gRPC API with database integration using Poetry
- **Frontend Service** (TypeScript): Web UI that consumes gRPC API

## 📁 Project Structure

```
.
├── services/
│   ├── backend-python/         # Python gRPC microservice (Poetry)
│   └── frontend-typescript/    # TypeScript web service
├── shared/
│   ├── proto/                  # Protocol buffer definitions
│   └── schemas/               # Shared data schemas
├── docker/                    # Docker configurations
├── scripts/                   # Build and utility scripts
├── tests/                     # Cross-service tests
├── docs/                      # Documentation
└── .github/workflows/         # CI/CD pipelines
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+** and **Poetry** (`curl -sSL https://install.python-poetry.org | python3 -`)
- **Node.js 16+** and **npm**

### Setup Everything
```bash
# One-time setup (installs all dependencies)
./scripts/setup-dev.sh

# Generate gRPC code from proto files
npm run generate-proto
```

### Development Commands
```bash
# Start services
npm run dev:backend      # Python gRPC server
npm run dev:frontend     # TypeScript dev server

# Run tests
npm run test:backend     # Python tests with pytest
npm run test:frontend    # TypeScript tests

# Install dependencies
npm run install:backend  # Poetry install
npm run install:frontend # npm install
```

## 📋 Development Workflow

1. Define API contracts in `shared/proto/`
2. Generate code: `npm run generate-proto`
3. Implement backend gRPC service (Poetry environment)
4. Implement frontend client (TypeScript)
5. Test integration

## 🧪 Testing

- Unit tests: Service-specific test directories
- Integration tests: `tests/integration/`
- End-to-end tests: `tests/e2e/`

## 🔧 Python Backend (Poetry)

```bash
cd services/backend-python
poetry shell                    # Activate environment
poetry add <package>            # Add dependency
poetry add --group dev <pkg>    # Add dev dependency
poetry run pytest              # Run tests
poetry run python src/main.py  # Start server
```