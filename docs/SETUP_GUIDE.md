# Setup and Configuration Guide

This guide will help you set up the Disruptors AI Marketing Hub project with full automation capabilities.

## 🚀 **Quick Start**

### **1. Clone and Install**
```bash
git clone <repository-url>
cd disruptors-ai-marketing-hub
npm install
```

### **2. Environment Setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys (see Environment Configuration below)
```

### **3. Start Development**
```bash
# Option A: With full automation (recommended)
npm run dev:auto

# Option B: Standard development only
npm run dev
```

### **4. Activate Project Orchestrator**
The `disruptors-ai-project-orchestrator` agent should automatically activate in Claude Code when you make changes. If not, ensure your Claude Code environment has access to the agent specification in `docs/agents/`.

## 🔧 **Environment Configuration**

### **Required for Basic Functionality**
```bash
# Core Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# MCP Integration (for automation systems)
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
SUPABASE_ACCESS_TOKEN=your_supabase_access_token_here
SUPABASE_PROJECT_REF=your_supabase_project_reference_here
```

### **Optional AI Services** (add as needed)
```bash
# OpenAI - DALL-E 3, GPT-Image-1
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Google Gemini - Imagen 4, Veo video
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Replicate - AI model inference
VITE_REPLICATE_API_TOKEN=your_replicate_api_token_here

# ElevenLabs - Voice synthesis
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Cloudinary - Image/video optimization
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here

# Netlify - Deployment automation
NETLIFY_AUTH_TOKEN=your_netlify_auth_token_here
```

## 🔑 **Getting API Keys**

### **Supabase** (Required)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select existing
3. Navigate to Settings → API
4. Copy `URL` and `anon` key to your `.env`
5. For MCP integration, get access token from Account → Access Tokens

### **GitHub** (Required for automation)
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with permissions: `repo`, `read:org`, `read:user`
3. Copy token to `GITHUB_PERSONAL_ACCESS_TOKEN`

### **Optional Services**

**OpenAI** (for AI image generation)
- Get API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

**Google Gemini** (for AI image/video generation)
- Get API key from [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

**Replicate** (for AI model inference)
- Get API token from [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)

**Cloudinary** (for media optimization)
- Get credentials from [cloudinary.com/console/settings/api-keys](https://cloudinary.com/console/settings/api-keys)

**Netlify** (for deployment)
- Get auth token from [app.netlify.com/user/applications#personal-access-tokens](https://app.netlify.com/user/applications#personal-access-tokens)

## 🎛️ **System Configuration**

### **Auto-Commit Settings**
Edit `scripts/auto-commit.js` to customize:

```javascript
const CONFIG = {
  // Change detection thresholds
  MAJOR_CHANGE_THRESHOLD: 50,    // lines for major changes
  MINOR_CHANGE_THRESHOLD: 10,    // lines for minor changes
  COMMIT_DEBOUNCE_MS: 30000,     // 30 seconds wait time
  PUSH_INTERVAL_MS: 300000,      // 5 minutes push frequency

  // File patterns to monitor
  WATCH_PATTERNS: [
    'src/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{css,scss}',
    'package.json',
    '*.config.js',
    '.env.example',
    '*.md'
  ],

  // File patterns to ignore
  IGNORE_PATTERNS: [
    'node_modules/**',
    'dist/**',
    '.git/**',
    '**/*.log'
  ]
};
```

### **Changelog Settings**
Edit `scripts/changelog-manager.js` to customize:

```javascript
const CONFIG = {
  // Version bump rules
  VERSION_RULES: {
    'feat': 'minor',        // New features
    'fix': 'patch',         // Bug fixes
    'docs': 'patch',        // Documentation
    'breaking': 'major'     // Breaking changes
  },

  // Category mapping
  CATEGORIES: {
    'feat': 'Added',
    'fix': 'Fixed',
    'docs': 'Changed',
    'security': 'Security'
  }
};
```

## 🏗️ **Project Structure**

### **Key Directories**
```
disruptors-ai-marketing-hub/
├── src/
│   ├── components/          # 49 UI components + business components
│   │   ├── ui/             # Radix UI design system components
│   │   ├── shared/         # Reusable components
│   │   └── [feature]/      # Feature-specific components
│   ├── pages/              # 39+ page components
│   ├── lib/                # Utilities and API clients
│   ├── api/                # API integration layer
│   └── hooks/              # Custom React hooks
├── scripts/                # Automation system scripts
├── docs/                   # Project documentation
├── public/                 # Static assets
└── [config files]          # Vite, Tailwind, ESLint configs
```

### **Automation Scripts**
```
scripts/
├── auto-commit.js          # Intelligent auto-commit system
├── changelog-manager.js    # Semantic versioning & changelog
└── integration-manager.js  # System coordination
```

## 🚦 **Verification Steps**

### **1. Test Basic Setup**
```bash
# Start development server
npm run dev

# Should start without errors on http://localhost:5173
```

### **2. Test Automation System**
```bash
# Test all systems
npm run integration:test

# Expected output:
# ✅ AUTO-COMMIT: Auto-commit system functional
# ✅ CHANGELOG: Changelog system functional
# ✅ DOCUMENTATION: Documentation system functional
# ✅ INTEGRATION: All systems integrated and functional
```

### **3. Test Auto-Commit**
```bash
# Start file monitoring
npm run auto-commit:watch

# Make a small change to any file in src/
# Should auto-commit after 30 seconds

# Check status
npm run auto-commit:status
```

### **4. Test Documentation Sync**
- Modify a component in `src/components/`
- Documentation should automatically update in real-time
- Check `README.md` and `docs/COMPONENTS.md` for updates

## 🎯 **Development Workflows**

### **Standard Development** (with automation)
1. Start: `npm run dev:auto`
2. Make changes to components, pages, or configuration
3. **Automatic**: Documentation syncs in real-time
4. **Automatic**: Changes auto-commit after 30 seconds
5. **Automatic**: Changelog updates with semantic versioning
6. **Automatic**: Commits push to GitHub every 5 minutes

### **Safe Development** (manual control)
1. Start: `npm run dev:safe`
2. Make changes normally
3. Manual git operations required
4. Use `npm run integration:trigger` for manual automation

### **Release Workflow**
```bash
# Check current status
npm run changelog:status

# Create release (automatic version bump)
npm run changelog:release

# Or specify version
npm run changelog:release 1.2.0 "Major feature release"
```

## 📊 **Monitoring and Maintenance**

### **Daily Monitoring**
```bash
# Check overall system health
npm run integration:status

# Check individual systems
npm run auto-commit:status
npm run changelog:status
```

### **Weekly Maintenance**
- Review auto-generated commit messages for accuracy
- Check changelog entries for completeness
- Verify documentation is up-to-date
- Test system functionality: `npm run integration:test`

### **Troubleshooting**

**Auto-commit not working?**
```bash
# Check status and logs
npm run auto-commit:status

# Restart system
npm run integration:stop
npm run integration:start
```

**Documentation not syncing?**
- The documentation-synchronization-engine runs as a Claude Code subagent
- Ensure your Claude Code environment has agent access
- Check that file changes trigger the agent

**Build errors?**
```bash
# Check for syntax errors
npm run lint

# Test build
npm run build

# Check environment variables
cat .env
```

## 🔄 **Updates and Upgrades**

### **Dependency Updates**
```bash
# Update dependencies
npm update

# Test after updates
npm run integration:test
npm run build
```

### **Automation System Updates**
When updating automation scripts:
1. Backup current configuration
2. Test changes in safe mode first
3. Verify with `npm run integration:test`
4. Monitor system after deployment

### **Environment Updates**
When adding new API keys:
1. Update `.env.example` with documentation
2. Update this setup guide
3. Test with new services
4. Update automation scripts if needed

## 🆘 **Support and Documentation**

### **Full Documentation**
- `docs/AUTOMATION_SYSTEM.md` - Complete automation system details
- `docs/API_INTEGRATION.md` - API integration patterns
- `docs/COMPONENTS.md` - Component library documentation
- `CLAUDE.md` - Development guidance and project patterns
- `README.md` - Project overview and architecture

### **Getting Help**
1. Check system status: `npm run integration:status`
2. Run system tests: `npm run integration:test`
3. Review logs in automation scripts
4. Check GitHub repository for issues and updates
5. Verify environment configuration in `.env`

Your automation system is now ready to transform your development workflow! 🚀