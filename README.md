# Disruptors AI Marketing Hub

A modern React SPA marketing website built with Vite, serving as the digital presence for Disruptors AI. Features a custom routing system, comprehensive UI component library, and integrated AI media generation capabilities.

## Technology Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **Routing**: React Router DOM with custom page mapping system
- **Animation**: Framer Motion for interactions and transitions
- **Database**: Supabase with custom SDK wrapper
- **API Integration**: Base44 SDK compatibility layer
- **Deployment**: Netlify with SPA routing support

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd disruptors-ai-marketing-hub

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env
# Edit .env with your actual API keys and configuration
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint codebase
npm run lint
```

### Additional Scripts

```bash
# Generate service images
npm run generate:service-images

# Test image setup
npm run test:image-setup

# Integration example
npm run integrate:service-images
```

## Project Architecture

### Custom Routing System
The application uses a unique routing approach managed in `src/pages/index.jsx`:
- All page components are centrally imported and mapped
- URL-to-component mapping handled by `_getCurrentPage()` function
- Layout wrapper provides consistent navigation and structure
- Supports 39+ pages including case studies and solution pages

### Component Structure
```
src/
├── components/
│   ├── ui/           # Radix UI-based design system (49 components)
│   ├── shared/       # Reusable components across pages
│   ├── home/         # Homepage-specific components
│   ├── solutions/    # Solution page components
│   └── work/         # Case study components
├── pages/            # 39 page components with custom routing
├── api/              # Base44 SDK integration layer
└── lib/              # Utilities and configuration
```

### API Integration
- **Supabase Client**: Database operations and authentication
- **Custom SDK**: Base44-compatible wrapper with Supabase backend
- **AI Services**: Integration with OpenAI, Gemini, ElevenLabs, Replicate
- **File Management**: Cloudinary integration for media assets

## Environment Configuration

Configure the following environment variables in `.env`:

### Core Services
```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### MCP Server Integration
```bash
# GitHub Integration
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token

# Supabase MCP Server
SUPABASE_ACCESS_TOKEN=your_supabase_access_token

# Deployment Services
NETLIFY_AUTH_TOKEN=your_netlify_token
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

The project includes comprehensive MCP server integration for AI-assisted development:
- **Supabase MCP Server**: Database operations, project management, and development tools
- **GitHub MCP Server**: Repository management and code collaboration
- **Netlify MCP Server**: Deployment and hosting management
- **Cloudinary MCP Server**: Media management and optimization

See [MCP Servers Documentation](docs/mcp-servers.md) for complete setup and configuration details.

### AI Generation Services
```bash
# Image and Content Generation
VITE_OPENAI_API_KEY=your_openai_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_REPLICATE_API_TOKEN=your_replicate_token
VITE_ELEVENLABS_API_KEY=your_elevenlabs_key
```

See `.env.example` for complete configuration options.

## Deployment

The application is configured for Netlify deployment with SPA routing support:

1. **Automatic Deployment**: Connected to Git repository for continuous deployment
2. **Build Configuration**: Uses `npm run build` with output to `dist/`
3. **Routing Support**: `_redirects` file handles SPA client-side routing
4. **Environment Variables**: Configure in Netlify dashboard or via CLI

### Manual Deployment
```bash
# Build the application
npm run build

# Deploy to Netlify
npx netlify deploy --prod --dir=dist
```

## Key Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Custom Animations**: Framer Motion integration for smooth interactions
- **AI Media Generation**: Integrated image and content generation capabilities
- **Component Library**: Comprehensive UI system with 49 reusable components
- **Case Study Showcase**: Dynamic work portfolio with detailed case studies
- **Service Pages**: Solution-focused pages with interactive elements
- **Blog System**: Content management with Supabase backend
- **Contact Forms**: Form handling with validation and submission processing

## Development Guidelines

### Component Development
- Use Radix UI primitives for accessibility
- Follow shadcn/ui patterns for consistency
- Implement proper TypeScript types where applicable
- Include JSDoc comments for component documentation

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Utilize custom design tokens from `tailwind.config.js`
- Maintain consistent spacing and typography scales

### State Management
- Use React hooks for local state
- Implement Supabase for persistent data
- Follow the custom SDK patterns for API integration

## Support and Documentation

- **Project Documentation**: See `CLAUDE.md` for development guidance
- **API Documentation**: Custom SDK provides Base44-compatible interface
- **Component Library**: Radix UI and shadcn/ui documentation
- **Deployment**: Netlify and Supabase platform documentation

For technical support and questions, refer to the project's issue tracker or documentation.