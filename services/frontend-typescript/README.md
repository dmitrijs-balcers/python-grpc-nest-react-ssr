# Frontend TypeScript Service

Web application that serves UI and acts as gRPC client to the Python backend.

## 📁 Structure

```
src/
├── components/    # Reusable UI components
├── pages/         # Page components/routes
├── services/      # API clients and gRPC communication
├── types/         # TypeScript type definitions
├── utils/         # Helper functions
└── assets/        # Static assets (images, styles)

public/            # Static files served directly
tests/
├── unit/          # Unit tests (Jest/Vitest)
└── integration/   # Integration tests

proto_generated/   # Generated gRPC client code (auto-generated)
```

## 🛠️ Setup

```bash
# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev

# Build for production
npm run build
```

## 🔧 Development

- Use React/Next.js/Svelte (choose your framework)
- Use `@grpc/grpc-js` for gRPC client
- Use TypeScript for type safety
- Use your preferred testing framework (Jest/Vitest)
- Use your preferred bundler (Vite/Webpack)