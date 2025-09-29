# NestJS + React SSR + gRPC Client

Server-side rendered React UI with gRPC client to Python backend.

## Quick Start

```bash
# Install
npm install

# Start (Port 3000)
npm run dev
```

Open http://localhost:3000

**Note:** Python gRPC backend must be running on port 50051.

## Features

- NestJS server with React SSR
- Auto-generated TypeScript types from proto
- Type-safe gRPC client
- Promise-based API

## Structure

```
src/
├── grpc/
│   ├── client.ts         # gRPC client
│   └── generated/        # Auto-generated types (DO NOT EDIT)
├── users/                # Users module
├── views/                # React SSR templates
└── main.ts               # Entry point
```

## Scripts

```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run generate-proto   # Regenerate proto types
npm run lint             # Type check
```

## Proto Changes

Types regenerate automatically on `npm run dev` or `npm run build`.

For manual regeneration: `npm run generate-proto`

See [Proto Changes Guide](../../docs/PROTO_CHANGES_GUIDE.md) for details.
