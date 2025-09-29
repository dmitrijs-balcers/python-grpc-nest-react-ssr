#!/bin/bash

# Development environment setup script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up development environment...${NC}"

# Check if we're in the project root
if [ ! -f "README.md" ] || [ ! -d "services" ]; then
    echo -e "${RED}❌ Please run this script from the project root directory${NC}"
    exit 1
fi

# Check if Poetry is installed
if ! command -v poetry &> /dev/null; then
    echo -e "${RED}❌ Poetry is not installed${NC}"
    echo -e "${YELLOW}💡 Install Poetry first: curl -sSL https://install.python-poetry.org | python3 -${NC}"
    exit 1
fi

# Setup Python backend with Poetry
echo -e "${YELLOW}🐍 Setting up Python backend with Poetry...${NC}"
cd services/backend-python

# Install dependencies with Poetry
echo -e "${YELLOW}📥 Installing Python dependencies...${NC}"
poetry install

# Create basic src structure if it doesn't exist
mkdir -p src/{api,models,services,database,config,utils}
touch src/__init__.py src/main.py

# Create basic main.py if it doesn't exist
if [ ! -s "src/main.py" ]; then
    cat > src/main.py << 'EOF'
"""Main entry point for the gRPC server."""

def main():
    print("🚀 Python gRPC server starting...")
    print("📋 TODO: Implement gRPC server")

if __name__ == "__main__":
    main()
EOF
fi

cd ../..

# Setup TypeScript frontend
echo -e "${YELLOW}📝 Setting up TypeScript frontend...${NC}"
cd services/frontend-typescript

# Check if package.json exists, if not create a basic one
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}📝 Creating basic package.json...${NC}"
    cat > package.json << EOF
{
  "name": "frontend-typescript",
  "version": "1.0.0",
  "description": "TypeScript frontend service",
  "main": "index.js",
  "scripts": {
    "dev": "echo 'Add your dev server command here (e.g., vite dev, next dev)'",
    "build": "echo 'Add your build command here'",
    "test": "echo 'Add your test command here'",
    "lint": "eslint src/ --ext .ts,.tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "@grpc/grpc-js": "^1.9.7",
    "google-protobuf": "^3.21.2"
  },
  "devDependencies": {
    "@types/google-protobuf": "^3.15.6",
    "@types/node": "^20.8.0",
    "@typescript-eslint/eslint-plugin": "^6.7.4",
    "@typescript-eslint/parser": "^6.7.4",
    "eslint": "^8.50.0",
    "grpc-tools": "^1.12.4",
    "grpc_tools_node_protoc_ts": "^5.3.3",
    "typescript": "^5.2.2"
  }
}
EOF
fi

echo -e "${YELLOW}📥 Installing TypeScript dependencies...${NC}"
npm install

# Create tsconfig.json if it doesn't exist
if [ ! -f "tsconfig.json" ]; then
    cat > tsconfig.json << EOF
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "commonjs",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "src/**/*",
    "proto_generated/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
EOF
fi

cd ../..

# Setup root package.json for proto generation
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}📝 Creating root package.json...${NC}"
    cat > package.json << EOF
{
  "name": "microservices-monorepo",
  "version": "1.0.0",
  "description": "Monorepo with Python gRPC backend and TypeScript frontend",
  "private": true,
  "scripts": {
    "generate-proto": "./scripts/generate-proto.sh",
    "setup-dev": "./scripts/setup-dev.sh",
    "install:backend": "cd services/backend-python && poetry install",
    "install:frontend": "cd services/frontend-typescript && npm install",
    "dev:backend": "cd services/backend-python && poetry run python src/main.py",
    "dev:frontend": "cd services/frontend-typescript && npm run dev",
    "test:backend": "cd services/backend-python && poetry run pytest",
    "test:frontend": "cd services/frontend-typescript && npm test"
  },
  "devDependencies": {
    "grpc-tools": "^1.12.4",
    "grpc_tools_node_protoc_ts": "^5.3.3"
  }
}
EOF
    npm install
fi

# Generate initial proto files
echo -e "${YELLOW}🔄 Generating initial gRPC code...${NC}"
./scripts/generate-proto.sh

echo -e "${GREEN}✅ Development environment setup completed!${NC}"
echo -e ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "1. 🐍 ${YELLOW}Python backend:${NC} cd services/backend-python && poetry shell"
echo -e "2. 📝 ${YELLOW}TypeScript frontend:${NC} cd services/frontend-typescript && npm run dev"
echo -e "3. 🔄 ${YELLOW}Regenerate proto:${NC} npm run generate-proto"
echo -e ""
echo -e "${BLUE}🔧 Available commands:${NC}"
echo -e "   ${YELLOW}npm run dev:backend${NC}     - Start Python server"
echo -e "   ${YELLOW}npm run dev:frontend${NC}    - Start TypeScript dev server"
echo -e "   ${YELLOW}npm run test:backend${NC}    - Run Python tests"
echo -e "   ${YELLOW}npm run test:frontend${NC}   - Run TypeScript tests"
echo -e ""
echo -e "${GREEN}Happy coding with Poetry! 🚀${NC}"