# Deployment Orchestrator

Comprehensive deployment management system that coordinates Supabase and Netlify deployments, tracks all configuration changes, maintains deployment history, and provides automated rollback capabilities.

## Features

- **🐘 Supabase Automation**: Schema migrations, RLS policy updates, database management
- **🌐 Netlify Automation**: Build and deployment automation with environment management
- **📊 State Tracking**: Persistent deployment state with history and versioning
- **🔄 Rollback Support**: Quick rollback to any previous deployment
- **🏥 Health Checks**: Automated post-deployment validation
- **🔧 Environment Sync**: Automatic environment variable synchronization
- **👀 Watch Mode**: Auto-deploy on file changes

## Quick Start

### Check Deployment Status

```bash
npm run deploy:status
```

Shows current deployment state, last deployments, and recent history.

### Deploy to Netlify (Preview)

```bash
npm run deploy:netlify
```

Builds and deploys to Netlify preview environment with health checks.

### Deploy to Production

```bash
npm run deploy:prod
```

Full-stack production deployment to both Supabase and Netlify.

### Deploy Supabase Only

```bash
npm run deploy:supabase
```

Applies database migrations and updates Supabase configuration.

## Commands

### Netlify Deployment

```bash
# Deploy to preview
npm run deploy:netlify

# Deploy to production
node scripts/deployment-orchestrator.js netlify --prod

# Deploy without building
node scripts/deployment-orchestrator.js netlify --skip-build

# Deploy and sync environment variables
node scripts/deployment-orchestrator.js netlify --sync-env --prod

# Deploy without health checks
node scripts/deployment-orchestrator.js netlify --skip-health-check
```

### Supabase Deployment

```bash
# Deploy with migrations
npm run deploy:supabase

# Deploy without applying migrations
node scripts/deployment-orchestrator.js supabase --skip-migrations

# Deploy and update RLS policies
node scripts/deployment-orchestrator.js supabase --update-rls
```

### Full-Stack Deployment

```bash
# Deploy both Supabase and Netlify (preview)
npm run deploy:full

# Deploy to production
npm run deploy:prod

# Full deployment with all options
node scripts/deployment-orchestrator.js full --prod --sync-env
```

### Rollback

```bash
# Show deployment history to get ID
npm run deploy:status

# Rollback to specific deployment
node scripts/deployment-orchestrator.js rollback <deployment-id>
```

### Environment Management

```bash
# Sync .env variables to Netlify
npm run deploy:sync-env
```

### Watch Mode

```bash
# Watch for changes (manual Netlify deploy)
npm run deploy:watch

# Watch and auto-deploy Netlify on changes
node scripts/deployment-orchestrator.js watch --auto-netlify
```

## Deployment State

The orchestrator maintains deployment state in two files:

### `.deployment-state.json`

Current state of deployments:

```json
{
  "lastDeployment": {
    "type": "netlify",
    "timestamp": "2025-09-30T12:00:00.000Z",
    "duration": 45000,
    "url": "https://master--cheerful-custard-2e6fc5.netlify.app"
  },
  "supabase": {
    "projectRef": "ubqxflzuvxowigbjmqfb",
    "lastMigration": "2025-09-30T11:30:00.000Z",
    "schema": {},
    "rls": {}
  },
  "netlify": {
    "siteId": "cheerful-custard-2e6fc5",
    "lastBuild": "2025-09-30T12:00:00.000Z",
    "deployUrl": "https://master--cheerful-custard-2e6fc5.netlify.app",
    "environment": {}
  }
}
```

### `.deployment-history.json`

Historical record of all deployments (last 100):

```json
[
  {
    "id": "1727697600000",
    "timestamp": "2025-09-30T12:00:00.000Z",
    "type": "netlify",
    "status": "success",
    "changes": [
      "Built project",
      "Deployed to production",
      "Health checks passed"
    ],
    "errors": [],
    "duration": 45000,
    "deployUrl": "https://master--cheerful-custard-2e6fc5.netlify.app"
  }
]
```

## Deployment Workflow

### Standard Workflow

1. **Development**:
   ```bash
   npm run dev
   ```

2. **Test locally**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Deploy to preview**:
   ```bash
   npm run deploy:netlify
   ```

4. **Deploy to production**:
   ```bash
   npm run deploy:prod
   ```

### Database Changes Workflow

1. **Create migration**:
   ```bash
   npx supabase migration new your_migration_name
   ```

2. **Write migration SQL** in `supabase/migrations/`

3. **Deploy migration**:
   ```bash
   npm run deploy:supabase
   ```

4. **Deploy frontend** (if needed):
   ```bash
   npm run deploy:netlify --prod
   ```

### Emergency Rollback

1. **Check deployment history**:
   ```bash
   npm run deploy:status
   ```

2. **Rollback Netlify**:
   ```bash
   node scripts/deployment-orchestrator.js rollback <deployment-id>
   ```

3. **Rollback Supabase** (manual):
   - Create down migration
   - Apply with `npm run deploy:supabase`

## Health Checks

After each Netlify deployment, the orchestrator runs health checks on:

- Homepage (`/`)
- About page (`/about`)
- Contact page (`/contact`)

Add custom health checks by modifying `runHealthChecks()` in `scripts/deployment-orchestrator.js`.

## Environment Variables

### Required Environment Variables

The orchestrator reads from `mcp.json` for authentication tokens:

```json
{
  "mcpServers": {
    "netlify": {
      "env": {
        "NETLIFY_AUTH_TOKEN": "your_netlify_token"
      }
    },
    "supabase": {
      "env": {
        "SUPABASE_ACCESS_TOKEN": "your_supabase_token"
      }
    }
  }
}
```

### Syncing Environment Variables

The `--sync-env` flag syncs all `VITE_*` variables from `.env` to Netlify:

```bash
npm run deploy:netlify -- --sync-env
```

Or directly:

```bash
npm run deploy:sync-env
```

## Integration with MCP Servers

The deployment orchestrator uses:

- **Netlify MCP** (`@netlify/mcp@latest`): Deploy management, env vars, logs
- **Supabase MCP** (`@supabase/mcp-server-supabase@latest`): Database operations, migrations, project management

Both are configured in `mcp.json` and automatically used by the orchestrator.

## Watch Mode

Watch mode monitors file changes and triggers deployments:

```bash
npm run deploy:watch
```

**Monitored paths**:
- `src/**/*` - Source code changes
- `supabase/migrations/**/*` - Database migrations
- `.env` - Environment variables

**Behavior**:
- Supabase migrations trigger `deploy:supabase`
- `.env` changes trigger `deploy:sync-env`
- Source changes (with `--auto-netlify`) trigger `deploy:netlify`

**Example with auto-deploy**:
```bash
node scripts/deployment-orchestrator.js watch --auto-netlify
```

## Troubleshooting

### CLI Not Available

**Netlify CLI**:
```bash
npm install -D netlify-cli
```

**Supabase CLI**:
```bash
npm install -D supabase
```

### Authentication Issues

Check your tokens in `mcp.json`:

```bash
# Test Netlify auth
npx netlify status

# Test Supabase auth
npx supabase projects list
```

### Build Failures

Skip the build step if it's already built:

```bash
node scripts/deployment-orchestrator.js netlify --skip-build
```

### Health Check Failures

Deploy without health checks to debug:

```bash
node scripts/deployment-orchestrator.js netlify --skip-health-check
```

Then manually check the deployed site.

### Migration Failures

Check migration logs:

```bash
npx supabase db push --project-ref ubqxflzuvxowigbjmqfb --debug
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Deploy to Production
        run: npm run deploy:prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

## Advanced Usage

### Custom Deployment Script

```javascript
import DeploymentOrchestrator from './scripts/deployment-orchestrator.js';

const orchestrator = new DeploymentOrchestrator();
await orchestrator.initialize();

// Custom deployment workflow
await orchestrator.deploySupabase({
  applyMigrations: true,
  updateRLS: true
});

await orchestrator.deployNetlify({
  production: true,
  syncEnv: true
});

// Check results
await orchestrator.showStatus();
```

### Programmatic Access

```javascript
// Get deployment history
const history = orchestrator.history;

// Get current state
const state = orchestrator.state;

// Manual rollback
await orchestrator.rollback('1727697600000');

// Custom health checks
const healthy = await orchestrator.runHealthChecks('https://example.com');
```

## API Reference

### `DeploymentOrchestrator`

#### Methods

- `initialize()` - Load state and configuration
- `deploySupabase(options)` - Deploy to Supabase
- `deployNetlify(options)` - Deploy to Netlify
- `deployFullStack(options)` - Full-stack deployment
- `rollback(deploymentId)` - Rollback to previous deployment
- `showStatus()` - Display deployment status
- `watch(options)` - Watch for changes
- `syncNetlifyEnv()` - Sync environment variables
- `runHealthChecks(url)` - Run health checks

#### Options

**Supabase**:
- `applyMigrations` - Apply database migrations (default: true)
- `updateRLS` - Update RLS policies (default: false)

**Netlify**:
- `skipBuild` - Skip build step (default: false)
- `production` - Deploy to production (default: false)
- `syncEnv` - Sync environment variables (default: false)
- `healthCheck` - Run health checks (default: true)

**Full Stack**:
- `skipSupabase` - Skip Supabase deployment (default: false)
- `skipNetlify` - Skip Netlify deployment (default: false)
- All Supabase and Netlify options

## Best Practices

1. **Always check status before deploying**:
   ```bash
   npm run deploy:status
   ```

2. **Test in preview before production**:
   ```bash
   npm run deploy:netlify
   # Test the preview URL
   npm run deploy:prod
   ```

3. **Keep deployment history**:
   - Don't delete `.deployment-history.json`
   - Commit `.deployment-state.json` to track production state

4. **Use watch mode during development**:
   ```bash
   npm run deploy:watch
   ```

5. **Sync environment variables regularly**:
   ```bash
   npm run deploy:sync-env
   ```

6. **Document migrations**:
   - Use descriptive migration names
   - Add comments in migration SQL files
   - Track migration dependencies

## Security

- **Never commit tokens**: Use `mcp.json` with environment variables
- **Use separate tokens**: Different tokens for dev/staging/production
- **Rotate tokens regularly**: Update in `mcp.json` and redeploy
- **Limit token permissions**: Use least privilege principle
- **Monitor deployments**: Check deployment logs regularly

## Support

For issues or questions:

1. Check deployment status: `npm run deploy:status`
2. Review logs in `.deployment-history.json`
3. Test MCP server connections: `npm run mcp:status`
4. Check Netlify dashboard: https://app.netlify.com/projects/cheerful-custard-2e6fc5
5. Check Supabase dashboard: https://supabase.com/dashboard/project/ubqxflzuvxowigbjmqfb

## Related Documentation

- [MCP Orchestrator](./MCP_ORCHESTRATOR.md) - MCP server management
- [CLAUDE.md](../CLAUDE.md) - Project documentation
- [Deployment Validator Agent](../CLAUDE.md#deployment-validator) - Deployment testing
