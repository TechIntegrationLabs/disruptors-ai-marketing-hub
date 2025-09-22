# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` - Starts Vite development server
- **Build**: `npm run build` - Creates production build using Vite
- **Lint**: `npm run lint` - Runs ESLint on the codebase
- **Preview**: `npm run preview` - Preview production build locally

## Project Architecture

This is a React SPA built with Vite that serves as a marketing website for Disruptors AI. The application uses a custom routing system and integrates with Base44 API and Supabase.

### Key Architectural Patterns

- **Custom Router**: Uses `src/pages/index.jsx` as a central routing hub that maps URLs to page components
- **Layout System**: All pages are wrapped in `src/pages/Layout.jsx` which provides consistent navigation and structure
- **API Integration**: 
  - Base44 SDK via `src/api/base44Client.js` for CMS/marketing content
  - Supabase client in `src/lib/supabase-client.js` for database operations
- **Component Structure**:
  - `src/components/ui/` - Radix UI-based design system components
  - `src/components/shared/` - Reusable components across pages
  - `src/components/home/`, `src/components/solutions/`, `src/components/work/` - Page-specific components

### Technology Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **Routing**: React Router DOM with custom page mapping
- **Animation**: Framer Motion for interactions
- **Data**: Supabase for backend, Base44 SDK for content management

### File Organization

- Pages are individual components in `src/pages/` directory
- Each page corresponds to a route (e.g., `about.jsx` → `/about`)
- Work case studies follow pattern `work-[client-name].jsx`
- Solution pages follow pattern `solutions-[service].jsx`
- All routing is centrally managed in `src/pages/index.jsx`

### Path Aliases

- `@/` resolves to `src/` directory (configured in `vite.config.js`)