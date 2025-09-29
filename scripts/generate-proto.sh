#!/bin/bash

# Generate proto files for all services in the monorepo
# This script generates TypeScript types for Node.js and Python protobuf files

set -e  # Exit on error

echo "🔄 Generating proto files for all services..."
echo "=============================================="

# Get the root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROTO_DIR="$ROOT_DIR/shared/proto"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if proto directory exists
if [ ! -d "$PROTO_DIR" ]; then
    echo -e "${RED}❌ Proto directory not found: $PROTO_DIR${NC}"
    exit 1
fi

# Count proto files
PROTO_COUNT=$(find "$PROTO_DIR" -name "*.proto" | wc -l | tr -d ' ')
echo -e "${BLUE}📁 Found $PROTO_COUNT proto file(s) in $PROTO_DIR${NC}"
echo ""

# ==============================================================================
# Generate for Node.js TypeScript service
# ==============================================================================
NODEJS_SERVICE_DIR="$ROOT_DIR/services/backend-nodejs"

if [ -d "$NODEJS_SERVICE_DIR" ]; then
    echo -e "${BLUE}📦 Node.js TypeScript Service${NC}"
    echo "   Location: $NODEJS_SERVICE_DIR"
    
    cd "$NODEJS_SERVICE_DIR"
    
    if [ -f "package.json" ]; then
        if npm run generate-proto; then
            echo -e "${GREEN}   ✅ Node.js proto types generated successfully${NC}"
        else
            echo -e "${RED}   ❌ Failed to generate Node.js proto types${NC}"
            exit 1
        fi
    else
        echo -e "${RED}   ⚠️  package.json not found, skipping${NC}"
    fi
    echo ""
else
    echo -e "${BLUE}   ⚠️  Node.js service directory not found, skipping${NC}"
    echo ""
fi

# ==============================================================================
# Generate for Python gRPC service
# ==============================================================================
PYTHON_SERVICE_DIR="$ROOT_DIR/services/backend-python"

if [ -d "$PYTHON_SERVICE_DIR" ]; then
    echo -e "${BLUE}🐍 Python gRPC Service${NC}"
    echo "   Location: $PYTHON_SERVICE_DIR"
    
    cd "$PYTHON_SERVICE_DIR"
    
    # Check if proto_generated directory exists, create if not
    if [ ! -d "proto_generated" ]; then
        mkdir -p proto_generated
        touch proto_generated/__init__.py
        echo -e "${BLUE}   📁 Created proto_generated directory${NC}"
    fi
    
    # Check if poetry is available
    if command -v poetry &> /dev/null; then
        echo -e "${BLUE}   🔄 Generating Python protobuf files...${NC}"
        
        # Generate Python proto files
        if poetry run python -m grpc_tools.protoc \
            -I"$PROTO_DIR" \
            --python_out=proto_generated \
            --grpc_python_out=proto_generated \
            "$PROTO_DIR"/*.proto; then
            echo -e "${GREEN}   ✅ Python proto files generated successfully${NC}"
        else
            echo -e "${RED}   ❌ Failed to generate Python proto files${NC}"
            exit 1
        fi
    else
        echo -e "${RED}   ⚠️  Poetry not found, skipping Python proto generation${NC}"
        echo -e "      Install poetry: curl -sSL https://install.python-poetry.org | python3 -"
    fi
    echo ""
else
    echo -e "${BLUE}   ⚠️  Python service directory not found, skipping${NC}"
    echo ""
fi

# ==============================================================================
# Summary
# ==============================================================================
echo "=============================================="
echo -e "${GREEN}✅ Proto generation complete!${NC}"
echo ""
echo "Generated types for:"
[ -d "$NODEJS_SERVICE_DIR" ] && echo "  • Node.js TypeScript service"
[ -d "$PYTHON_SERVICE_DIR" ] && echo "  • Python gRPC service"
echo ""
echo "Next steps:"
echo "  • Review generated files"
echo "  • Update service implementations if needed"
echo "  • Test both services"
echo ""
