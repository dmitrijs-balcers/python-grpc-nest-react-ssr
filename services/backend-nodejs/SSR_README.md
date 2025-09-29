# React SSR + gRPC

NestJS with React Server-Side Rendering, fetching data via gRPC.

## Stack

- **NestJS**: Node.js framework
- **React 18**: Server-side rendering
- **gRPC**: Python backend communication
- **TypeScript**: Type-safe code

## Quick Start

```bash
npm install
npm run dev      # Starts on http://localhost:3000
```

**Required:** Python gRPC backend on port 50051

## Architecture

```
Browser → NestJS (SSR) → gRPC → Python Backend
```

## Structure

```
src/
├── grpc/
│   ├── client.ts         # gRPC client
│   └── generated/        # Auto-generated types
├── users/                # Users module
│   ├── users.service.ts  # gRPC operations
│   └── users.controller.ts
├── views/                # React templates
└── main.ts               # Entry point

public/                   # Static assets
views/                    # EJS templates
```

## How It Works

1. Browser requests page → NestJS controller
2. Controller calls gRPC service → Python backend
3. Data rendered in React → HTML sent to browser
4. Client hydrates for interactivity

## Commands

```bash
npm run dev              # Dev server with hot reload
npm run build            # Build for production
npm run start:prod       # Run production build
npm run generate-proto   # Regenerate gRPC types
```

## Configuration

Default: `localhost:50051` for gRPC

To change, edit `src/grpc/client.ts`
