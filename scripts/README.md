# Scripts Directory

Utility scripts for development and deployment.

## 📜 Available Scripts

### `generate-proto.sh`
Generates gRPC code from `.proto` files for both Python and TypeScript services.

**Usage:**
```bash
./scripts/generate-proto.sh
```

**Requirements:**
- Python: `grpcio-tools`
- Node.js: `grpc-tools`, `grpc_tools_node_protoc_ts`

### `setup-dev.sh`
Sets up the complete development environment for both services.

**Usage:**
```bash
./scripts/setup-dev.sh
```

**What it does:**
1. Creates Python virtual environment
2. Installs Python dependencies
3. Sets up Node.js dependencies
4. Generates initial gRPC code
5. Creates basic configuration files

## 🔧 Prerequisites

Before running any scripts, ensure you have:

- **Python 3.8+** installed
- **Node.js 16+** and npm installed
- **Git** for version control

## 🚀 Quick Start

```bash
# Clone and setup everything
git clone <your-repo>
cd <your-repo>
./scripts/setup-dev.sh

# After making proto changes
./scripts/generate-proto.sh
```

## 📝 Adding New Scripts

When adding new scripts:
1. Make them executable: `chmod +x scripts/your-script.sh`
2. Add usage documentation here
3. Use consistent color coding and error handling
4. Include proper exit codes