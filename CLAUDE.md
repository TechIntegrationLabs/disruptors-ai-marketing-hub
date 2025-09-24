# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite development server
- **Auto-commit dev**: `npm run dev:auto` - Development with intelligent auto-commit system
- **Safe development**: `npm run dev:safe` - Development without automation
- **Build**: `npm run build` - Creates production build using Vite
- **Lint**: `npm run lint` - Runs ESLint on the codebase
- **Preview**: `npm run preview` - Preview production build locally
- **Generate service images**: `npm run generate:service-images` - Generate AI service images
- **Test image setup**: `npm run test:image-setup` - Test image generation setup
- **Integration examples**: `npm run integrate:service-images` - Integration examples

## Project Architecture

This is a React SPA built with Vite serving as a marketing website for Disruptors AI. It features a sophisticated architecture combining custom routing, comprehensive UI systems, dual API integration, and advanced AI generation capabilities.

### Unique Custom Routing System

The application implements a distinctive routing architecture managed in `src/pages/index.jsx`:

- **39 page components** centrally imported and mapped in a `PAGES` object
- **URL-to-component mapping** handled by `_getCurrentPage()` function
- **Layout wrapper system** where `Layout.jsx` wraps all pages and receives `currentPageName` prop
- **Dual routing definition** with both custom mapping and React Router `<Routes>`
- **Page patterns**: Work case studies (`work-[client-name].jsx`), Solutions (`solutions-[service].jsx`)

### Component Architecture (49 UI + 15 Shared + Domain-Specific)

- **UI Components** (`src/components/ui/`): 49 Radix UI-based design system components following shadcn/ui patterns
- **Shared Components** (`src/components/shared/`): Reusable business components (Hero, ServiceScroller, AIMediaGenerator, etc.)
- **Admin Components** (`src/components/admin/`): Secure admin interface with MatrixLogin and secret access patterns
- **Domain Components**: Organized by feature (`home/`, `work/`, `solutions/`)

### Dual API Integration Architecture

**Custom SDK System** (`src/lib/custom-sdk.js`):
- Base44-compatible wrapper around Supabase with automatic entity-to-table mapping
- Dynamic CRUD operations with field mapping between Base44 and Supabase formats
- Service role vs. regular client selection based on entity patterns
- Development mode with auto-user creation, OAuth for production
- Graceful handling of missing tables for legacy compatibility

**Supabase Integration** (`src/lib/supabase-client.js`):
- Environment-aware configuration with automatic fallback to local instance
- Dual client setup: service role for admin operations, regular for user operations

### AI Generation Orchestrator

**Multi-Provider System** (`src/lib/ai-orchestrator.js`):
- **OpenAI**: DALL-E 3, GPT-Image-1, Realtime API
- **Google**: Gemini 2.5 Flash Image, Veo 2/3 video generation
- **Replicate**: Flux models, SDXL, Kling AI, ElevenLabs integration
- **Intelligent Model Selection**: Context-aware selection based on quality, budget, specialization
- **Brand Consistency**: Automatic enforcement of brand guidelines across generations

### MCP (Model Context Protocol) Ecosystem

Extensive integration with 20+ MCP servers across:
- **Development**: GitHub, filesystem, memory, sequential thinking
- **Web Automation**: Firecrawl, Playwright, Puppeteer
- **Cloud Services**: Vercel, Netlify, DigitalOcean, Railway, Cloudinary
- **AI & Content**: Replicate, Nano Banana (Gemini), Figma workflow

### Admin Access System

**Secret Access Pattern**:
- 5 logo clicks in 3 seconds OR Ctrl+Shift+D activates admin access
- Ctrl+Shift+Escape for emergency exit
- Matrix-style login interface with session-based authentication (24-hour expiry)
- Secure admin dashboard accessible only via secret patterns

### Technology Stack

- **Framework**: React 18 with Vite, React Router DOM v7.2.0
- **Styling**: Tailwind CSS with custom design tokens, Radix UI primitives
- **Animation**: Framer Motion for interactions and page transitions
- **Database**: Supabase with custom SDK wrapper
- **AI Services**: OpenAI, Google Gemini, Replicate, ElevenLabs integration
- **Deployment**: Netlify with SPA routing, CSP headers, optimized caching

### File Organization & Patterns

**Page Structure** (39 total pages):
- Core: Home, About, Contact, Work, Solutions, Blog system
- Case Studies: 9 work pages (`work-[client].jsx`)
- Solutions: 8 solution pages (`solutions-[service].jsx`)
- Utility: Assessment, Calculator, Gallery, Podcast, Privacy, Terms

**Component Patterns**:
- Functional components with hooks
- JSDoc documentation for public APIs
- Consistent Radix UI composition patterns
- Environment-aware service selection

### Path Aliases

- `@/` resolves to `src/` directory (configured in `vite.config.js`)

### Environment Configuration

#### Core Services
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Generation Services
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_REPLICATE_API_TOKEN=your_replicate_token
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
```

#### MCP Integration
```bash
# Development Workflow
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
NETLIFY_AUTH_TOKEN=your_netlify_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Key Architectural Patterns

**Convention over Configuration**: Automatic entity-to-table mapping, dynamic component generation, environment-aware service selection

**Progressive Enhancement**: Graceful degradation for missing services, fallback mechanisms for AI generation, development mode accommodations

**Modular Architecture**: Component composition patterns, service layer abstraction, plugin-based MCP integration

### Development Workflow

**Automation Scripts**:
- Auto-commit system with intelligent change detection
- Changelog management with semantic versioning
- Documentation synchronization engine
- Integration management for various services

**Code Quality Standards**:
- ESLint with React and accessibility rules
- Consistent component patterns using Radix UI
- TypeScript adoption for utilities (`src/utils/index.ts`)
- Performance optimization with lazy loading and efficient routing

### Deployment Configuration

- **Platform**: Netlify with automatic Git deployment
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **SPA Routing**: Handled by `_redirects` file
- **Security**: CSP headers, XSS protection, frame options
- **Environment**: Node.js 18, optimized caching

### Key Dependencies

**Core Framework**: `react@^18.2.0`, `react-router-dom@^7.2.0`, `vite@^6.1.0`
**UI & Styling**: `tailwindcss@^3.4.17`, `@radix-ui/*` (20+ packages), `framer-motion@^12.4.7`
**Data & API**: `@supabase/supabase-js@^2.57.4`, `@base44/sdk@^0.1.2`
**AI Services**: `openai@^5.23.0`, `@google/generative-ai@^0.24.1`, `replicate@^1.2.0`