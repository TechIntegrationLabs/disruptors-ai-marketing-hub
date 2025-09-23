# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite development server
- **Build**: `npm run build` - Creates production build using Vite
- **Lint**: `npm run lint` - Runs ESLint on the codebase
- **Preview**: `npm run preview` - Preview production build locally
- **Generate service images**: `npm run generate:service-images` - Generate AI service images
- **Test image setup**: `npm run test:image-setup` - Test image generation setup
- **Integration examples**: `npm run integrate:service-images` - Integration examples

## Project Architecture

This is a React SPA built with Vite that serves as a marketing website for Disruptors AI. The application uses a custom routing system and integrates with Base44 API and Supabase.

### Key Architectural Patterns

- **Custom Router**: Uses `src/pages/index.jsx` as a central routing hub that maps URLs to page components
- **Layout System**: All pages are wrapped in `src/pages/Layout.jsx` which provides consistent navigation and structure
- **API Integration**:
  - Base44 SDK via `src/api/base44Client.js` for CMS/marketing content
  - Supabase client in `src/lib/supabase-client.js` for database operations
  - Custom SDK in `src/lib/custom-sdk.js` providing Base44-compatible wrapper around Supabase
- **Component Structure**:
  - `src/components/ui/` - Radix UI-based design system components (49 components)
  - `src/components/shared/` - Reusable components across pages
  - `src/components/home/`, `src/components/solutions/`, `src/components/work/` - Page-specific components

### Technology Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **Routing**: React Router DOM with custom page mapping
- **Animation**: Framer Motion for interactions
- **Data**: Supabase for backend, Base44 SDK for content management
- **Deployment**: Netlify with SPA routing support

### Routing System

The application uses a unique routing approach where:
- All page components are imported in `src/pages/index.jsx`
- Routes are defined in both a `PAGES` object and React Router `<Routes>`
- URL-to-component mapping is handled by `_getCurrentPage()` function
- The `Layout` component wraps all pages and receives `currentPageName` prop
- Supports 39+ pages including case studies and solution pages

### File Organization

- Pages are individual components in `src/pages/` directory (39 total pages)
- Each page corresponds to a route (e.g., `about.jsx` → `/about`)
- Work case studies follow pattern `work-[client-name].jsx`
- Solution pages follow pattern `solutions-[service].jsx`
- All routing is centrally managed in `src/pages/index.jsx`

### Component Architecture

- **UI Components**: `src/components/ui/` - 49 Radix UI-based design system components
- **Shared Components**: `src/components/shared/` - Reusable components across multiple pages
- **Feature Components**: Page-specific components organized by domain
  - `src/components/home/` - Homepage-specific components
  - `src/components/solutions/` - Solution page components
  - `src/components/work/` - Case study and portfolio components

### API Integration Architecture

- **Custom SDK**: `src/lib/custom-sdk.js` - Base44-compatible wrapper around Supabase
- **Supabase Client**: `src/lib/supabase-client.js` - Database and authentication client
- **Base44 Client**: `src/api/base44Client.js` - Compatibility layer for Base44 SDK patterns
- **Entity System**: Dynamic entity creation with automatic table name mapping
- **Authentication**: User management with development mode and OAuth support

### Environment Configuration

#### Required Environment Variables
```bash
# Core Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# MCP Server Integration (for development workflow)
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
NETLIFY_AUTH_TOKEN=your_netlify_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# AI Generation Services
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_REPLICATE_API_TOKEN=your_replicate_token
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
```

### Deployment Configuration

- **Platform**: Netlify with automatic Git deployment
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **SPA Routing**: Handled by `_redirects` file for client-side routing
- **Environment Variables**: Configure in Netlify dashboard

### Development Workflow

#### Scripts Available
- `npm run dev` - Development server with hot reload
- `npm run build` - Production build with optimization
- `npm run preview` - Preview production build locally
- `npm run lint` - ESLint code quality checks
- `npm run generate:service-images` - Generate AI service images
- `npm run test:image-setup` - Test image generation setup
- `npm run integrate:service-images` - Integration examples

#### Code Quality Standards
- **ESLint**: Configured with React and accessibility rules
- **Component Structure**: Functional components with hooks
- **Styling**: Tailwind CSS utility-first approach
- **Accessibility**: Radix UI primitives ensure WCAG compliance
- **Type Safety**: JSDoc comments and gradual TypeScript adoption

### Path Aliases

- `@/` resolves to `src/` directory (configured in `vite.config.js`)

### Key Dependencies

#### Core Framework
- `react@^18.2.0` - React library
- `react-router-dom@^7.2.0` - Client-side routing
- `vite@^6.1.0` - Build tool and development server

#### UI and Styling
- `tailwindcss@^3.4.17` - Utility-first CSS framework
- `@radix-ui/*` - Accessible UI primitives (20+ packages)
- `framer-motion@^12.4.7` - Animation library
- `lucide-react@^0.475.0` - Icon library

#### Data and API
- `@supabase/supabase-js@^2.57.4` - Supabase client
- `@base44/sdk@^0.1.2` - Base44 SDK compatibility

#### Development Tools
- `eslint@^9.19.0` - Code linting
- `autoprefixer@^10.4.20` - CSS prefixing
- `@types/node@^22.13.5` - Node.js type definitions

### Documentation Standards

#### Component Documentation
- Include JSDoc comments for all public components
- Document props with types and descriptions
- Provide usage examples in comments
- Document accessibility considerations

#### API Documentation
- Document all custom SDK methods and their parameters
- Include error handling patterns
- Provide integration examples
- Document authentication requirements

#### Configuration Documentation
- Keep environment variable documentation current
- Document build and deployment processes
- Maintain dependency documentation
- Update path aliases and project structure documentation