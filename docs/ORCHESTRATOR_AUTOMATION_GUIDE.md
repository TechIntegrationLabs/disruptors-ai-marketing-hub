# Disruptors AI Project Orchestrator - Automation Guide

## Overview

The **Disruptors AI Project Orchestrator** is now fully integrated into your development workflow, automatically handling documentation synchronization, changelog maintenance, and intelligent commit management whenever you make changes to the codebase.

## What It Does Automatically

### 🔄 Real-Time Monitoring
- Watches all source files, components, pages, scripts, and configuration
- Detects changes within seconds of modification
- Intelligently debounces to avoid excessive triggering

### 📚 Documentation Synchronization
- Automatically updates documentation when code changes
- Keeps README, CLAUDE.md, and other docs in sync with implementation
- Generates API documentation for new components and functions

### 📝 Changelog Management
- Maintains semantic versioning automatically
- Categorizes changes (feat, fix, docs, style, refactor, config)
- Creates human-readable changelog entries

### 💬 Intelligent Commits
- Analyzes changes across multiple files
- Generates contextual commit messages
- Includes Claude Code attribution

### ✅ Repository Coherence
- Ensures all parts of the repository stay synchronized
- Validates consistency across documentation and code
- Prevents drift between implementation and docs

## How to Use

### Option 1: Orchestrated Development Mode (Recommended)

```bash
npm run dev:orchestrated
```

This starts:
- Vite development server
- Orchestrator file watcher
- Automatic documentation & changelog sync
- Real-time coherence monitoring

**Perfect for**: Active development sessions where you want everything handled automatically

### Option 2: Manual Triggers

```bash
# Trigger orchestrator manually
npm run orchestrator:trigger

# Check orchestrator status
npm run orchestrator:status

# Watch mode only (no dev server)
npm run orchestrator:watch
```

**Perfect for**: After making bulk changes or before committing

### Option 3: Git Hook Integration

The orchestrator automatically runs after every commit via the `post-commit` git hook.

**Perfect for**: Ensuring docs stay in sync with committed code

## Configuration

### Trigger Thresholds

Located in `scripts/orchestrator-integration.js`:

```javascript
{
  DEBOUNCE_MS: 10000,              // Wait 10s after last change
  MIN_CHANGES_FOR_TRIGGER: 3,      // Need at least 3 file changes
  AUTO_TRIGGER_INTERVAL: 300000    // Auto-trigger every 5 min if changes exist
}
```

### Monitored Files

The orchestrator watches:
- `src/**/*.{js,jsx,ts,tsx}` - All source code
- `src/**/*.{css,scss}` - Stylesheets
- `public/**/*` - Public assets
- `scripts/**/*.js` - Build scripts
- Configuration files (package.json, vite.config.js, etc.)
- Documentation files (*.md)

### Ignored Files

Automatically ignores:
- `node_modules/` - Dependencies
- `dist/` - Build output
- `.git/` - Git internals
- `**/*.log` - Log files
- Stats and temporary files

## Status & Monitoring

### Check Current Status

```bash
npm run orchestrator:status
```

Shows:
- ✅ Running/stopped status
- ⏳ Currently processing
- 📝 Pending changes count
- 📊 Total triggers executed
- 🕐 Last trigger timestamp
- 📈 Recent activity log

### View Context

The orchestrator saves context to `.orchestrator-context.json`:

```json
{
  "timestamp": "2025-09-29T...",
  "changes": [
    {
      "path": "src/components/ui/button.jsx",
      "type": "modified",
      "timestamp": 1727654321000
    }
  ],
  "summary": {
    "modified": 5,
    "added": 2,
    "deleted": 0,
    "components": 3,
    "docs": 1
  },
  "triggerReason": "file_changes"
}
```

## Workflow Examples

### Example 1: Component Development

```bash
# Start orchestrated mode
npm run dev:orchestrated

# Edit src/components/shared/Hero.jsx
# ... make your changes ...

# Orchestrator automatically:
# ✓ Detects Hero.jsx modification
# ✓ Updates component documentation
# ✓ Adds changelog entry
# ✓ Prepares commit context
```

### Example 2: Bulk Refactoring

```bash
# Make multiple file changes
# ... refactor 10+ files ...

# Manually trigger after you're done
npm run orchestrator:trigger

# Orchestrator processes all changes at once:
# ✓ Analyzes 10+ file modifications
# ✓ Updates all related documentation
# ✓ Creates comprehensive changelog
# ✓ Prepares intelligent commit
```

### Example 3: Documentation Updates

```bash
# Edit CLAUDE.md or README.md

# Orchestrator automatically:
# ✓ Validates documentation consistency
# ✓ Updates changelog with docs changes
# ✓ Ensures all references are correct
```

## Integration with Existing Tools

### Works Alongside Auto-Commit

The orchestrator complements the existing auto-commit system:

- **Auto-commit**: Handles basic commit creation
- **Orchestrator**: Handles documentation, changelogs, and coherence

Use both together for complete automation:

```bash
npm run dev:orchestrated  # Orchestrator for docs/changelogs
# OR
npm run dev:auto          # Auto-commit for rapid commits
```

### Works with Changelog Manager

The orchestrator integrates with `changelog-manager.js`:

```bash
# View changelog status
npm run changelog:status

# Manually add entry (if needed)
npm run changelog:add

# Create release
npm run changelog:release
```

## Advanced Usage

### Custom Trigger Reasons

```bash
# Trigger with custom reason
node scripts/orchestrator-integration.js trigger "before-release"
node scripts/orchestrator-integration.js trigger "major-refactor"
node scripts/orchestrator-integration.js trigger "documentation-audit"
```

### Statistics Tracking

The orchestrator maintains stats in `.orchestrator-stats.json`:

```json
{
  "totalTriggers": 42,
  "lastTrigger": "2025-09-29T...",
  "lastRun": 1727654321000
}
```

### Activity Log

Recent activity (last 100 entries) is kept in memory and shown via:

```bash
npm run orchestrator:status
```

## Troubleshooting

### Orchestrator Not Triggering

1. Check if it's running:
   ```bash
   npm run orchestrator:status
   ```

2. Ensure you have enough changes:
   ```bash
   # Minimum 3 file changes required by default
   ```

3. Manually trigger:
   ```bash
   npm run orchestrator:trigger
   ```

### Too Many Triggers

Adjust debounce time in `scripts/orchestrator-integration.js`:

```javascript
DEBOUNCE_MS: 30000  // Increase to 30 seconds
```

### Want to Disable Temporarily

Use safe development mode:

```bash
npm run dev:safe  # No automation
```

Or kill the orchestrator process:

```bash
# Find and kill orchestrator-integration.js process
```

## Best Practices

### 1. Run Orchestrated Mode During Active Development
```bash
npm run dev:orchestrated
```
Let it handle docs and changelogs automatically while you focus on coding.

### 2. Check Status Before Committing
```bash
npm run orchestrator:status
```
Ensure all documentation is synchronized.

### 3. Manual Trigger for Large Changes
```bash
npm run orchestrator:trigger
```
After major refactors or before releases.

### 4. Review Context File
```bash
cat .orchestrator-context.json
```
See exactly what the orchestrator is tracking.

## Files Created/Modified

### New Files
- `scripts/orchestrator-integration.js` - Main orchestrator script
- `.git/hooks/post-commit` - Git hook for auto-trigger
- `.orchestrator-stats.json` - Statistics tracking (gitignored)
- `.orchestrator-context.json` - Current context (gitignored)

### Modified Files
- `package.json` - Added orchestrator commands

### npm Scripts Added
- `dev:orchestrated` - Development with orchestration
- `orchestrator:watch` - Watch mode only
- `orchestrator:trigger` - Manual trigger
- `orchestrator:status` - Status check

## Next Steps

1. **Try it out**: `npm run dev:orchestrated`
2. **Make a change**: Edit any source file
3. **Watch it work**: Check `npm run orchestrator:status`
4. **Review results**: See updated docs and changelog

The orchestrator is now your automated documentation and coherence assistant, keeping everything in sync while you focus on building great features! 🚀