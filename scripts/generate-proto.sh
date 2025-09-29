#!/bin/bash

# Script to generate gRPC code for both Python and TypeScript services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Generating gRPC code from proto files...${NC}"

# Directories
PROTO_DIR="shared/proto"
PYTHON_OUT_DIR="services/backend-python/proto_generated"
TS_OUT_DIR="services/frontend-typescript/proto_generated"

# Check if proto files exist
if [ ! -d "$PROTO_DIR" ] || [ -z "$(ls -A $PROTO_DIR/*.proto 2>/dev/null)" ]; then
    echo -e "${RED}❌ No .proto files found in $PROTO_DIR${NC}"
    exit 1
fi

# Clean previous generated files
echo -e "${YELLOW}🧹 Cleaning previous generated files...${NC}"
rm -rf "$PYTHON_OUT_DIR"/*
rm -rf "$TS_OUT_DIR"/*

# Create output directories
mkdir -p "$PYTHON_OUT_DIR"
mkdir -p "$TS_OUT_DIR"

# Add __init__.py to make Python directory a package
touch "$PYTHON_OUT_DIR/__init__.py"

# Generate Python gRPC code using Poetry if available
echo -e "${YELLOW}🐍 Generating Python gRPC code...${NC}"
cd services/backend-python

if [ -f "pyproject.toml" ] && command -v poetry &> /dev/null; then
    # Use Poetry to run grpc_tools.protoc
    poetry run python -m grpc_tools.protoc \
        --proto_path="../../$PROTO_DIR" \
        --python_out="proto_generated" \
        --grpc_python_out="proto_generated" \
        "../../$PROTO_DIR"/*.proto
else
    # Fallback to system Python
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
    else
        PYTHON_CMD="python"
    fi

    $PYTHON_CMD -m grpc_tools.protoc \
        --proto_path="../../$PROTO_DIR" \
        --python_out="proto_generated" \
        --grpc_python_out="proto_generated" \
        "../../$PROTO_DIR"/*.proto
fi

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Python gRPC code generated successfully${NC}"
else
    echo -e "${RED}❌ Failed to generate Python gRPC code${NC}"
    echo -e "${YELLOW}💡 Make sure grpcio-tools is installed:${NC}"
    echo -e "${YELLOW}   With Poetry: poetry add grpcio-tools${NC}"
    echo -e "${YELLOW}   With pip: pip install grpcio-tools${NC}"
    exit 1
fi

cd ../..

# Generate TypeScript code (simplified approach)
echo -e "${YELLOW}📝 Generating TypeScript gRPC code...${NC}"

# Check if grpc-tools is available
if ! command -v npx &> /dev/null; then
    echo -e "${RED}❌ npx not found. Please install Node.js${NC}"
    exit 1
fi

# Generate JavaScript/TypeScript code using grpc-tools
npx grpc_tools_node_protoc \
    --proto_path="$PROTO_DIR" \
    --js_out=import_style=commonjs,binary:"$TS_OUT_DIR" \
    --grpc_out=grpc_js:"$TS_OUT_DIR" \
    "$PROTO_DIR"/*.proto

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ TypeScript gRPC code generated successfully${NC}"
else
    echo -e "${RED}❌ Failed to generate TypeScript gRPC code${NC}"
    echo -e "${YELLOW}💡 Make sure grpc-tools is installed: npm install grpc-tools${NC}"
    exit 1
fi

# Create a simple TypeScript declaration file for the generated code
echo -e "${YELLOW}📝 Creating TypeScript declarations...${NC}"
for proto_file in "$PROTO_DIR"/*.proto; do
    basename_file=$(basename "$proto_file" .proto)
    cat > "$TS_OUT_DIR/${basename_file}.d.ts" << EOF
// Auto-generated TypeScript declarations for ${basename_file}.proto
// Generated on $(date)

import * as grpc from '@grpc/grpc-js';
import * as google_protobuf from 'google-protobuf';

// Import the generated JavaScript files
export * from './${basename_file}_pb';
export * from './${basename_file}_grpc_pb';
EOF
done

echo -e "${GREEN}✅ gRPC code generation completed!${NC}"
echo -e "${GREEN}📁 Python files: $PYTHON_OUT_DIR${NC}"
echo -e "${GREEN}📁 TypeScript files: $TS_OUT_DIR${NC}"
echo -e "${YELLOW}🔄 Don't forget to restart your development servers${NC}"