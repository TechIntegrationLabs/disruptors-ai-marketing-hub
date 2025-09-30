# Changelog

All notable changes to the Disruptors AI Marketing Hub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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