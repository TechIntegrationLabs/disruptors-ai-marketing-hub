# MCP Servers Documentation

This document provides a comprehensive overview of all Model Context Protocol (MCP) servers configured in this repository.

## Table of Contents

1. [Development & Code Management](#development--code-management)
2. [Web Automation & Scraping](#web-automation--scraping)
3. [Cloud Services & Infrastructure](#cloud-services--infrastructure)
4. [Design & Content Creation](#design--content-creation)
5. [Database & Storage](#database--storage)
6. [AI & Machine Learning](#ai--machine-learning)
7. [Workflow Automation](#workflow-automation)
8. [Marketing & Analytics](#marketing--analytics)

## Development & Code Management

### GitHub
**Package**: `@modelcontextprotocol/server-github`
**Purpose**: Repository management, code analysis, and collaboration

**Capabilities**:
- Read and write files in repositories
- Create and manage issues, pull requests
- Access commit history and diffs
- Branch management
- Repository statistics and insights

**Use Cases**:
- Automated code reviews
- Issue tracking and management
- Release automation
- Code documentation generation

### Filesystem
**Package**: `@modelcontextprotocol/server-filesystem`
**Purpose**: Local file system operations

**Capabilities**:
- Read and write local files
- Directory traversal and management
- File search and manipulation
- Backup and sync operations

**Use Cases**:
- Project file management
- Local development workflows
- File processing and transformation

### Memory
**Package**: `@modelcontextprotocol/server-memory`
**Purpose**: Persistent context and data storage

**Capabilities**:
- Store and retrieve conversation context
- Maintain session state
- Cross-conversation data persistence

**Use Cases**:
- Maintaining project context across sessions
- Storing user preferences and configurations
- Building knowledge bases

### Sequential Thinking
**Package**: `@modelcontextprotocol/server-sequential-thinking`
**Purpose**: Enhanced reasoning and problem-solving

**Capabilities**:
- Step-by-step problem breakdown
- Logical reasoning chains
- Complex decision making

**Use Cases**:
- Debugging complex issues
- Planning multi-step implementations
- System architecture decisions

## Web Automation & Scraping

### Firecrawl
**Package**: `firecrawl-mcp`
**Purpose**: Intelligent web scraping and data extraction

**Capabilities**:
- Extract clean text from web pages
- Handle JavaScript-heavy sites
- Respect robots.txt and rate limits
- Structured data extraction

**Use Cases**:
- Competitive analysis
- Content research and curation
- Data collection for analysis
- Website monitoring

### Playwright
**Package**: `@playwright/mcp`
**Purpose**: Browser automation and testing

**Capabilities**:
- Cross-browser automation (Chrome, Firefox, Safari)
- PDF generation from web pages
- Screenshot capture
- Form interactions and testing

**Use Cases**:
- Automated testing
- Website monitoring
- Report generation
- User journey automation

### Puppeteer
**Package**: `puppeteer-mcp-claude`
**Purpose**: Chrome/Chromium browser automation

**Capabilities**:
- Headless browser control
- Page interaction and navigation
- Performance monitoring
- Content extraction

**Use Cases**:
- Web scraping for dynamic content
- Automated screenshot generation
- Performance auditing
- E2E testing

### Fetch
**Package**: `@modelcontextprotocol/server-fetch`
**Purpose**: HTTP requests and API interactions

**Capabilities**:
- GET, POST, PUT, DELETE requests
- Header and authentication management
- Response parsing and handling
- Rate limiting and retry logic

**Use Cases**:
- API integration and testing
- Data fetching from external services
- Webhook handling
- Service health checks

## Cloud Services & Infrastructure

### Vercel
**URL**: `https://mcp.vercel.com/will-4496s-projects/public`
**Purpose**: Deployment and hosting management

**Capabilities**:
- Deploy applications and static sites
- Manage domains and SSL certificates
- Environment variable configuration
- Analytics and performance monitoring

**Use Cases**:
- Automated deployments
- Preview environments
- Performance optimization
- Domain management

### Netlify
**Package**: `@netlify/mcp`
**Purpose**: JAMstack deployment and hosting

**Capabilities**:
- Site deployment and management
- Form handling and submissions
- Continuous deployment from Git
- Edge functions and redirects

**Use Cases**:
- Static site deployment
- Form processing
- A/B testing
- CDN management

### DigitalOcean
**Package**: `@digitalocean/mcp`
**Purpose**: Cloud infrastructure management

**Capabilities**:
- Droplet (VPS) management
- Database administration
- App platform deployments
- Load balancer configuration

**Use Cases**:
- Server provisioning and scaling
- Database backup and migration
- Application deployment
- Infrastructure monitoring

### Railway
**Package**: `@railway/mcp-server`
**Purpose**: Application deployment and database hosting

**Capabilities**:
- Deploy applications from Git
- Managed database services
- Environment configuration
- Service monitoring

**Use Cases**:
- Quick application deployment
- Database hosting
- Development environment setup
- Service scaling

### Cloudinary
**Package**: `@felores/cloudinary-mcp-server`
**Purpose**: Media management and optimization

**Capabilities**:
- Image and video upload/storage
- Real-time media transformations
- CDN delivery optimization
- AI-powered content analysis

**Use Cases**:
- Dynamic image resizing
- Video processing and optimization
- Asset management for websites
- Media workflow automation

## Design & Content Creation

### Figma
**Package**: `figma-developer-mcp`
**Purpose**: Design system integration and asset management

**Capabilities**:
- Access design files and components
- Export assets in various formats
- Design system documentation
- Collaboration and commenting

**Use Cases**:
- Design-to-code workflows
- Asset extraction for development
- Design system maintenance
- Team collaboration

### GSAP Master
**Package**: `bruzethegreat-gsap-master-mcp-server`
**Purpose**: Advanced animation creation and GSAP expertise

**Capabilities**:
- AI-powered animation creation from natural language
- Complete GSAP API documentation and examples
- Framework-specific setup generators (React, Vue, etc.)
- Performance optimization and debugging
- Production-ready animation patterns
- All GSAP plugins now 100% FREE (thanks to Webflow!)

**Use Cases**:
- Professional animation implementation
- Interactive UI components
- Scroll-based animations and parallax effects
- Text effects and character reveals
- SVG animations and morphing
- Complex animation sequences and timelines

### Nano Banana
**Package**: `nano-banana-mcp`
**Purpose**: AI-powered content generation with Gemini

**Capabilities**:
- Text generation and editing
- Creative writing assistance
- Content optimization
- Multilingual support

**Use Cases**:
- Blog post creation
- Marketing copy generation
- Content translation
- Creative brainstorming

## Database & Storage

### Supabase
**Package**: `@supabase/mcp-server-supabase`
**Purpose**: Backend-as-a-Service with PostgreSQL

**Capabilities**:
- Database operations (CRUD, migrations, schema management)
- Project and organization management
- Edge Functions deployment and management
- Storage bucket operations
- Real-time subscriptions and authentication
- Documentation search and debugging tools
- Development branch management (paid plans)
- TypeScript type generation from schema

**Use Cases**:
- Application backend development
- Database schema design and migration
- Serverless function deployment
- User authentication systems
- Real-time applications
- Data analytics and reporting
- Development workflow automation

**Security Features**:
- Read-only mode for safe operations
- Project scoping to limit access
- Feature groups for granular control
- Prompt injection protection

### Airtable
**Package**: `airtable-mcp-server`
**Purpose**: Collaborative database and project management

**Capabilities**:
- Record creation and management
- Base and table operations
- Attachment handling
- Workflow automation

**Use Cases**:
- Project management
- Content planning and calendars
- CRM and lead tracking
- Team collaboration

## AI & Machine Learning

### Replicate
**Package**: `replicate-mcp`
**Purpose**: AI model hosting and inference

**Capabilities**:
- Run open-source AI models
- Image generation and processing
- Text-to-speech and speech-to-text
- Custom model deployment

**Use Cases**:
- AI-powered content creation
- Image and video processing
- Voice applications
- Custom AI workflows

### Apify
**URL**: `https://mcp.apify.com`
**Purpose**: Web scraping and data extraction platform

**Capabilities**:
- Automated web scraping
- Data extraction from social media
- E-commerce data collection
- API integrations

**Use Cases**:
- Market research and analysis
- Competitive intelligence
- Lead generation
- Price monitoring

## Workflow Automation

### N8N
**Package**: `n8n-mcp-server`
**Purpose**: Workflow automation and integration platform

**Capabilities**:
- Create and manage automation workflows
- Connect various APIs and services
- Schedule and trigger executions
- Data transformation and processing

**Use Cases**:
- Business process automation
- Data synchronization
- Notification systems
- Integration workflows

### GoHighLevel
**Package**: `gohighlevel-mcp`
**Purpose**: CRM and marketing automation

**Capabilities**:
- Contact and lead management
- Campaign creation and management
- Funnel building and optimization
- Communication automation

**Use Cases**:
- Lead nurturing campaigns
- Customer relationship management
- Sales funnel optimization
- Marketing automation

## Marketing & Analytics

### DataForSEO
**Package**: `dataforseo-mcp-server`
**Purpose**: SEO data and analytics

**Capabilities**:
- Keyword research and analysis
- SERP monitoring and tracking
- Backlink analysis
- Competitor research

**Use Cases**:
- SEO strategy development
- Content optimization
- Competitive analysis
- Rank tracking and reporting

## Configuration Notes

### Environment Variables
All sensitive data (API keys, tokens) are stored in the `.env` file and should never be committed to version control.

### Windows Compatibility
The configuration has been optimized for Windows environments with proper path handling and package management.

### Package Management
All servers use `npx` for automatic package management, ensuring the latest versions are always used.

### Security
API keys and sensitive credentials are properly configured through environment variables, following security best practices.