# Protocol Buffer Definitions

This directory contains the `.proto` files that define the gRPC API contract between services.

## 📁 Structure

- `service_name.proto` - Main service definitions
- `common/` - Shared message types
- `google/` - Google well-known types (if needed)

## 🔄 Code Generation

Use the provided scripts to generate code for both services:

```bash
# From project root
./scripts/generate-proto.sh
```

This will generate:
- Python gRPC code in `services/backend-python/proto_generated/`
- TypeScript client code in `services/frontend-typescript/proto_generated/`

## 📝 Best Practices

1. Use semantic versioning for API changes
2. Keep backward compatibility when possible
3. Use descriptive field names
4. Include comprehensive documentation in comments
5. Group related messages in separate files