# gRPC Microservices Monorepo

NestJS + React SSR frontend with Python gRPC backend.

## Stack

- **Backend:** Python 3.9+, gRPC, SQLAlchemy
- **Frontend:** Node.js 20+, NestJS, React SSR, TypeScript
- **Protocol:** gRPC with Protocol Buffers

## Quick Start

```bash
# 1. Install dependencies
npm run install:backend
npm run install:nodejs

# 2. Start Python gRPC server (Terminal 1)
npm run dev:backend

# 3. Start NestJS + React SSR app (Terminal 2)
npm run dev:nodejs
```

Open http://localhost:3000

## Services

### Python gRPC Backend (Port 50051)
- User management service
- Database: SQLAlchemy with PostgreSQL
- Location: `services/backend-python/`

### NestJS + React SSR (Port 3000)
- Server-side rendered React UI
- gRPC client to Python backend
- Location: `services/backend-nodejs/`

## Scripts

```bash
npm run generate-proto      # Regenerate proto types
npm run dev:backend          # Start Python server
npm run dev:nodejs           # Start NestJS app
npm run test:backend         # Test Python service
npm run test:nodejs          # Test Node.js service
```

## Project Structure

```
├── services/
│   ├── backend-python/      # Python gRPC server
│   └── backend-nodejs/      # NestJS + React SSR
├── shared/
│   └── proto/               # Proto definitions
└── scripts/                 # Build scripts
```

## Documentation

- [Python Backend](services/backend-python/README.md)
- [Node.js Frontend](services/backend-nodejs/README.md)
- [Proto Changes Guide](docs/PROTO_CHANGES_GUIDE.md)
