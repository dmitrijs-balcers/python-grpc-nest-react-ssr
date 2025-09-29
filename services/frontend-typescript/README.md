# Frontend TypeScript Service

Web application that serves UI and acts as gRPC client to the Python backend.

## 🔧 **NPM Cache Fix (if needed)**

If you encounter npm cache permission errors, run:

```bash
# Option 1: Fix permissions (recommended)
sudo chown -R $(whoami) ~/.npm

# Option 2: Use different cache directory
echo "cache=/tmp/npm-cache-frontend" > .npmrc
echo "tmp=/tmp/npm-tmp" >> .npmrc

# Option 3: Clear and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

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
├── unit/          # Unit tests
└── integration/   # Integration tests

proto_generated/   # Generated gRPC client code (auto-generated)
```

## 🛠️ Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔧 Development

- Uses **React + Vite + TypeScript** for modern development
- **Mock gRPC client** for demo (connects to Python backend via REST proxy in production)
- **Responsive design** with modern CSS Grid/Flexbox
- **Component-based architecture** for maintainability

## 🌐 **Connecting to Python gRPC Server**

This frontend currently uses **mock data** for demonstration. To connect to the real Python gRPC server, you have several options:

### Option 1: gRPC-Web Proxy (Recommended for Production)
```bash
# Install envoy or grpc-web proxy
# Configure proxy to forward browser requests to gRPC server
```

### Option 2: REST API Gateway
```bash
# Create a REST API that proxies to gRPC
# Update grpcClient.ts to use real HTTP endpoints
```

### Option 3: Server-Side Rendering
```bash
# Use Next.js or similar to call gRPC from server-side
```

## 📱 **Features**

- ✅ **User List**: View all users with pagination
- ✅ **Create User**: Add new users with validation
- ✅ **User Details**: View detailed user information
- ✅ **Search**: Find users by ID
- ✅ **Responsive**: Works on desktop and mobile
- ✅ **Error Handling**: Graceful error states
- ✅ **Loading States**: User feedback during operations

## 🎨 **UI Components**

- Modern card-based design
- Clean typography and spacing
- Interactive hover effects
- Accessible form elements
- Mobile-responsive layout