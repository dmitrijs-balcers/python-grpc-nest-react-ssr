# Changelog

## Migration to React SSR - September 30, 2025

### Breaking Changes
- ❌ Removed separate `frontend-typescript` service
- ❌ Removed EJS templating engine
- ✅ Frontend now integrated into `backend-nodejs` service with React SSR

### Added
- ✅ React Server-Side Rendering in NestJS
  - `src/views/App.tsx` - Main React component
  - `src/views/render.tsx` - SSR rendering function
- ✅ Full TypeScript support for JSX
- ✅ Type-safe React components with gRPC data
- ✅ Migration documentation (`REACT_SSR_MIGRATION.md`)

### Changed
- 📦 Unified frontend and backend into single NestJS service
- 🔄 Simplified npm scripts (removed redundant nodejs-specific commands)
- 📝 Updated all documentation to reflect React SSR
- 🎨 Same styling maintained (CSS works identically)

### Updated Scripts
**Before:**
```bash
npm run install:nodejs       # Install backend-nodejs
npm run dev:nodejs           # Start backend-nodejs
npm run install:frontend     # Install frontend-typescript (didn't exist)
npm run dev:frontend         # Start frontend-typescript (didn't exist)
```

**After:**
```bash
npm run install:frontend     # Install backend-nodejs (with React SSR)
npm run dev:frontend         # Start NestJS + React SSR
npm run dev:grpc-client      # Run standalone gRPC client demo
```

### Migration Guide

#### For Users
No breaking changes - the app works the same way:
1. Start backend: `npm run dev:backend`
2. Start frontend: `npm run dev:frontend`
3. Visit: http://localhost:3000

#### For Developers
If extending the app:
- Replace EJS templates with React components in `src/views/`
- Use TypeScript interfaces for props
- Add new routes in `app.controller.ts`
- Optionally add client-side hydration for SPA features

### Benefits
✅ **Modern Stack** - React is the industry standard
✅ **Type Safety** - Full TypeScript support in components  
✅ **Maintainability** - Component-based architecture
✅ **Flexibility** - Can extend to SPA features later
✅ **Performance** - Still server-rendered for SEO
✅ **Developer Experience** - Familiar React syntax

### Technical Details

**TypeScript Configuration:**
```json
{
  "jsx": "react",
  "jsxFactory": "React.createElement",
  "lib": ["ES2020", "DOM"]
}
```

**Dependencies:**
- Added: `@types/express`
- Removed: `ejs`
- Existing: `react`, `react-dom`, `@types/react`, `@types/react-dom`

**File Changes:**
- Created: `src/views/App.tsx`, `src/views/render.tsx`
- Modified: `src/app.controller.ts`, `src/main.ts`, `tsconfig.json`
- Deleted: `views/index.ejs`

### Testing
All functionality verified:
- ✅ Build succeeds without errors
- ✅ TypeScript compilation passes
- ✅ Server starts correctly
- ✅ React components render
- ✅ gRPC data fetching works
- ✅ Styling displays properly
- ✅ JavaScript interactivity functions

### Next Steps (Optional)
For teams wanting full SPA features:
1. Add client-side hydration with `hydrateRoot()`
2. Implement React Router for client-side routing
3. Add state management (Redux, Zustand, etc.)
4. Setup Webpack/Vite for client bundle

Current SSR-only approach is recommended for:
- SEO-focused applications
- Content-heavy sites
- Simple interactive features
- Lower client-side JavaScript payload
