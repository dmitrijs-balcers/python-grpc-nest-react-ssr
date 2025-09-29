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

# Generate TypeScript gRPC-Web code  
echo -e "${YELLOW}📝 Generating TypeScript gRPC-Web code...${NC}"

# Check if protoc is available
if ! command -v protoc &> /dev/null; then
    echo -e "${RED}❌ protoc not found. Please install Protocol Buffers compiler${NC}"
    echo -e "${YELLOW}💡 Install protoc:${NC}"
    echo -e "${YELLOW}   MacOS: brew install protobuf${NC}"
    echo -e "${YELLOW}   Ubuntu: apt-get install protobuf-compiler${NC}"
    exit 1
fi

# Check if frontend directory exists and has node_modules
if [ ! -d "services/frontend-typescript/node_modules" ]; then
    echo -e "${YELLOW}📦 Installing frontend dependencies first...${NC}"
    cd services/frontend-typescript
    npm install
    cd ../..
fi

# Generate gRPC-Web code for TypeScript
protoc -I="$PROTO_DIR" \
    --js_out=import_style=commonjs:"$TS_OUT_DIR" \
    --grpc-web_out=import_style=typescript,mode=grpcwebtext:"$TS_OUT_DIR" \
    "$PROTO_DIR"/*.proto

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ TypeScript gRPC-Web code generated successfully${NC}"
else
    echo -e "${RED}❌ Failed to generate TypeScript gRPC-Web code${NC}"
    echo -e "${YELLOW}💡 Make sure protoc-gen-grpc-web is installed:${NC}"
    echo -e "${YELLOW}   Download from: https://github.com/grpc/grpc-web/releases${NC}"
    echo -e "${YELLOW}   Or install via npm: npm install -g protoc-gen-grpc-web${NC}"
    exit 1
fi

echo -e "${GREEN}✅ gRPC code generation completed!${NC}"
echo -e "${GREEN}📁 Python files: $PYTHON_OUT_DIR${NC}"
echo -e "${GREEN}📁 TypeScript files: $TS_OUT_DIR${NC}"
echo -e "${YELLOW}🔄 Don't forget to restart your development servers${NC}"