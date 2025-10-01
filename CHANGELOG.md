# Changelog

All notable changes to the Disruptors AI Marketing Hub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Complete Admin Nexus system integration for content and AI management
- Admin portal accessible at `/admin/secret` with session-based authentication
- 11 admin modules: Dashboard, Content Management, Team Management, Media Library, Business Brain Builder, Brand DNA Builder, Agent Builder, Agent Chat, Workflow Manager, Integrations Hub, Telemetry Dashboard
- Database schema for admin functionality (15 new tables, 3 enhanced existing tables)
- Admin API layer with TypeScript entity wrappers (BusinessBrains, Agents, BrainFacts, Conversations, Workflows)
- Netlify serverless functions for AI operations (ai_invoke, agent_train-background, ingest_dispatch-background)
- Knowledge base system with full-text search and fact extraction
- AI agent management with training, chat, and feedback capabilities
- Content audit logging with automatic change tracking
- Junction tables for relational data (post_brain_facts, post_media, team_member_agents)
- Database views for easy querying (posts_with_authors, media_with_generation, content_calendar)
- Helper functions and RPCs (search_brain_facts, append_feedback, get_brain_health)

### Changed
- Enhanced `team_members` table with admin system integration (user_id, can_write_content, default_agent_id, content_permissions)
- Enhanced `posts` table with AI workflow support (status, author_member_id, agent_id, brain_snapshot, seo, generation_metadata)
- Enhanced `site_media` table with AI generation tracking (generated_by_workflow_id, generated_by_agent_id, ai_generated, generation_prompt)
- Updated App.jsx with admin route guard (zero-touch public site integration)
- Updated netlify.toml with admin function configurations

### Technical Details
- **Type**: MAJOR version (new admin system, database schema changes)
- **Files Created**: 38 (admin modules, API layer, functions, migrations)
- **Files Modified**: 2 (App.jsx, netlify.toml)
- **Lines Added**: ~3,500+ lines across admin system
- **Database Tables**: 15 new tables, 3 enhanced existing tables, 3 junction tables
- **Admin Modules**: 6 fully implemented, 5 stub placeholders ready for development
- **Integration Pattern**: Zero-touch public site (single route guard in App.jsx)
- **Security**: Row Level Security (RLS) on all admin tables, admin-only JWT policies
- **Build Impact**: +6s build time, +200KB gzipped bundle (admin lazy-loaded)
- **Performance Impact**: Zero impact on public site (admin not loaded until accessed)

### Database Migrations Required
- **Migration 1**: `temp/001_init_enhanced.sql` - Creates 15 admin tables with RLS policies
- **Migration 2**: `temp/002_integrate_existing.sql` - Enhances existing tables and creates views
- **Data Migration**: `scripts/migrate-existing-data.js` - Links existing content to admin system
- **Admin Setup**: `scripts/setup-admin-user.js` - Creates admin user with elevated permissions

### Admin Modules
1. **Dashboard Overview** - System overview with stats, recent activity, and health metrics
2. **Content Management** - Post editor with AI-powered generation and workflow management
3. **Team Management** - Team member administration with role-based permissions
4. **Media Library** - Asset catalog with AI generation tracking and bulk operations
5. **Business Brain Builder** - Knowledge base builder with fact extraction and ingestion
6. **Agent Chat** - Interactive chat with AI agents powered by Claude/GPT
7. **Brand DNA Builder** - Brand voice and style configuration (stub placeholder)
8. **Agent Builder** - AI agent creation and training management (stub placeholder)
9. **Workflow Manager** - Automation pipeline designer (stub placeholder)
10. **Integrations Hub** - Third-party service connections (stub placeholder)
11. **Telemetry Dashboard** - System monitoring and analytics (stub placeholder)

### Security Enhancements
- Session-based admin authentication with 24-hour expiry
- JWT role-based access control (admin role required)
- Row Level Security policies on all admin tables
- Service role used for elevated operations in Netlify functions
- Content audit logging with automatic change tracking
- Admin access isolated behind secret URL pattern

### Architecture
- **Admin Isolation**: Complete separation from public site via route guard
- **API Layer**: TypeScript entity wrappers with Supabase client
- **Backend Functions**: Netlify serverless functions for AI operations
- **Database Design**: Relational schema with junction tables and views
- **Authentication**: Dual auth contexts (public vs. admin)
- **Code Splitting**: Lazy-loaded admin modules for optimal performance

### Documentation
- `docs/INTEGRATION_REPORT.md` - Comprehensive integration report
- `temp/MIGRATION_INSTRUCTIONS.md` - Step-by-step database migration guide
- Admin module inline documentation with JSDoc comments
- Database schema comments and helper function documentation

---

## [0.1.0] - 2025-01-30

### Changed
- Enhanced visual aesthetics with cleaner, more refined design system
- Simplified ServiceScroller component by removing background decorations and gradients
- Updated text colors from blue-600 to gray-900 for improved readability and contrast
- Replaced VideoScrollScrub component with background image layer approach for better performance
- Added geometric minimalist background to ServiceScroller section on home page
- Modified video playback speed to 0.75x in AlternatingLayout for smoother viewing experience

### Removed
- Gradient overlays from AlternatingLayout component for cleaner visual presentation
- Background decorations from ServiceScroller to reduce visual clutter
- VideoScrollScrub component from Home page (replaced with more efficient background layer)

### Added
- Dynamic video content in hero sections (Home Mission section, Blog hero)
- Background image layer with white overlay to ServiceScroller section
- Improved visual consistency across key pages

### Technical Details
- **Type**: MINOR version (UI/UX enhancements, no breaking changes)
- **Files Modified**: 4 (AlternatingLayout.jsx, ServiceScroller.jsx, Home.jsx, blog.jsx)
- **Lines Changed**: +19, -28
- **Performance Impact**: Positive (removed heavy gradient calculations, optimized video playback)
- **Visual Hierarchy**: Improved through cleaner design and strategic video integration

### Technical Details
- **Framework**: React 18 with Vite
- **UI Components**: 49 Radix UI components with shadcn/ui patterns
- **Pages**: 39+ pages with custom routing system
- **APIs**: Supabase + Base44 SDK integration
- **Automation**: Auto-commit, documentation sync, changelog maintenance

---

## [0.0.0] - 2025-01-23

### Added
- Initial project setup with React 18 and Vite
- Custom routing system with central page management
- Radix UI component library integration
- Tailwind CSS styling system
- Framer Motion animations
- Supabase backend integration
- Base44 SDK compatibility layer
- 39+ marketing pages including case studies
- Complete component system with 49 UI components
- Netlify deployment configuration
- ESLint and code quality tools

### Architecture
- **Routing**: Custom page mapping system in `src/pages/index.jsx`
- **Components**: Modular structure with UI, shared, and feature components
- **APIs**: Dual integration with Supabase and Base44 SDK
- **Styling**: Utility-first CSS with Tailwind
- **Build**: Vite for fast development and optimized production builds

---

## Release Notes

### Automation System (Current Release)
This release introduces a comprehensive automation system for the project:

**🤖 Auto-Commit System**
- Intelligent file change detection
- AI-powered commit message generation
- Configurable thresholds for commit decisions
- Automatic staging, committing, and pushing
- Integration with development workflow

**📚 Documentation Synchronization**
- Real-time documentation updates
- Component and API documentation generation
- Cross-reference maintenance
- Documentation quality enforcement

**📝 Changelog Management**
- Automatic changelog entry generation
- Semantic versioning compliance
- Change categorization and release notes
- Integration with auto-commit system

**Development Workflow Enhancements**
- `npm run dev:auto` - Development with auto-commit
- `npm run dev:safe` - Development without auto-commit
- `npm run auto-commit:status` - System status monitoring
- `npm run auto-commit:watch` - Standalone monitoring

### Project Foundation (Initial Release)
- Established as a modern React marketing website
- Custom routing system supporting 39+ pages
- Comprehensive UI component system (49 components)
- Dual API integration (Supabase + Base44)
- Production-ready deployment configuration
- Complete development toolchain setup

---

## Version Guidelines

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** version for incompatible API changes or breaking changes
- **MINOR** version for new functionality in a backward-compatible manner
- **PATCH** version for backward-compatible bug fixes

### Change Categories

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes

### Automation Integration

This changelog is maintained by the automated changelog system, which:
- Monitors all code changes and automatically categorizes them
- Generates entries based on commit patterns and file modifications
- Updates version numbers according to semantic versioning rules
- Creates release notes for significant updates
- Maintains backward compatibility and migration information

For manual changelog updates or questions about versioning, please refer to the project documentation or contact the development team.