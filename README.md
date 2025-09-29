# Microservices Monorepo

A monorepo containing Python gRPC backend and TypeScript frontend services.

## 🏗️ Architecture

- **Backend Service** (Python): gRPC API with database integration
- **Frontend Service** (TypeScript): Web UI that consumes gRPC API

## 📁 Project Structure

```
.
├── services/
│   ├── backend-python/         # Python gRPC microservice
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

1. **Setup Backend**: `cd services/backend-python && [setup instructions]`
2. **Setup Frontend**: `cd services/frontend-typescript && [setup instructions]`
3. **Generate Proto**: `./scripts/generate-proto.sh`

## 📋 Development Workflow

1. Define API contracts in `shared/proto/`
2. Generate code for both services
3. Implement backend gRPC service
4. Implement frontend client
5. Test integration

## 🧪 Testing

- Unit tests: Service-specific test directories
- Integration tests: `tests/integration/`
- End-to-end tests: `tests/e2e/`