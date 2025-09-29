# Scripts Directory

This directory contains utility scripts for the monorepo.

## Available Scripts

### `generate-proto.sh`

Generates protobuf types for all services in the monorepo.

**Usage:**
```bash
# From project root
npm run generate-proto

# Or directly
./scripts/generate-proto.sh
```

**What it does:**
1. Scans the `shared/proto/` directory for `.proto` files
2. Generates TypeScript types for Node.js service (`services/backend-nodejs`)
3. Generates Python protobuf files for Python service (`services/backend-python`)
4. Provides colored output showing progress and results

**Requirements:**
- Node.js and npm (for Node.js type generation)
- Poetry (for Python type generation)
- Proto files in `shared/proto/` directory

**Output:**
- Node.js: `services/backend-nodejs/src/grpc/generated/`
- Python: `services/backend-python/proto_generated/`

**Exit codes:**
- `0` - Success
- `1` - Error during generation

## Adding New Scripts

When adding new scripts to this directory:

1. Make them executable: `chmod +x scripts/your-script.sh`
2. Add documentation in this README
3. Add to root `package.json` if appropriate
4. Use clear success/error messages
5. Exit with appropriate exit codes
