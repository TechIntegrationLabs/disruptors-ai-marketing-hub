#!/usr/bin/env node

/**
 * Auto-Commit Manager
 * Intelligent automatic commit system for the Disruptors AI Marketing Hub
 *
 * Features:
 * - Monitors file changes with configurable thresholds
 * - Generates AI-powered commit messages
 * - Handles staging, committing, and pushing automatically
 * - Activity logging and status reporting
 * - Integration with development workflow
 */

import { spawn, execSync } from 'child_process';
import { watch } from 'chokidar';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Configuration
const CONFIG = {
  // Change detection thresholds
  MAJOR_CHANGE_THRESHOLD: 50, // lines added/removed
  MINOR_CHANGE_THRESHOLD: 10, // lines added/removed
  COMMIT_DEBOUNCE_MS: 30000, // 30 seconds
  PUSH_INTERVAL_MS: 300000, // 5 minutes

  // File patterns to monitor
  WATCH_PATTERNS: [
    'src/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{css,scss}',
    'package.json',
    'vite.config.js',
    'tailwind.config.js',
    '.env.example',
    'README.md',
    'CLAUDE.md'
  ],

  // File patterns to ignore
  IGNORE_PATTERNS: [
    'node_modules/**',
    'dist/**',
    '.git/**',
    '**/*.log',
    'scripts/auto-commit.js' // Don't auto-commit this file
  ],

  // Commit message templates
  COMMIT_TYPES: {
    feat: 'New feature or functionality',
    fix: 'Bug fix or error correction',
    docs: 'Documentation changes',
    style: 'Code style/formatting changes',
    refactor: 'Code refactoring without behavior change',
    config: 'Configuration or build changes',
    deps: 'Dependency updates'
  }
};

class AutoCommitManager {
  constructor() {
    this.pendingChanges = new Set();
    this.commitTimer = null;
    this.pushTimer = null;
    this.isProcessing = false;
    this.activityLog = [];
    this.lastCommitTime = null;
    this.statsFilePath = path.join(projectRoot, '.auto-commit-stats.json');
  }

  /**
   * Start the auto-commit system
   */
  async start() {
    try {
      this.log('🚀 Starting Auto-Commit Manager...');

      // Verify git repository
      if (!await this.isGitRepository()) {
        throw new Error('Not a git repository');
      }

      // Load previous stats
      await this.loadStats();

      // Setup file watcher
      this.setupFileWatcher();

      // Setup periodic push
      this.setupPeriodicPush();

      this.log('✅ Auto-Commit Manager started successfully');
      return true;
    } catch (error) {
      this.log(`❌ Failed to start Auto-Commit Manager: ${error.message}`);
      return false;
    }
  }

  /**
   * Stop the auto-commit system
   */
  async stop() {
    this.log('🛑 Stopping Auto-Commit Manager...');

    if (this.watcher) {
      await this.watcher.close();
    }

    if (this.commitTimer) {
      clearTimeout(this.commitTimer);
    }

    if (this.pushTimer) {
      clearInterval(this.pushTimer);
    }

    await this.saveStats();
    this.log('✅ Auto-Commit Manager stopped');
  }

  /**
   * Setup file watcher for changes
   */
  setupFileWatcher() {
    this.watcher = watch(CONFIG.WATCH_PATTERNS, {
      ignored: CONFIG.IGNORE_PATTERNS,
      ignoreInitial: true,
      cwd: projectRoot
    });

    this.watcher
      .on('change', (filePath) => this.handleFileChange(filePath))
      .on('add', (filePath) => this.handleFileChange(filePath))
      .on('unlink', (filePath) => this.handleFileChange(filePath));

    this.log('👁️  File watcher initialized');
  }

  /**
   * Handle file change events
   */
  async handleFileChange(filePath) {
    if (this.isProcessing) return;

    this.pendingChanges.add(filePath);
    this.log(`📝 Change detected: ${filePath}`);

    // Debounce commits
    if (this.commitTimer) {
      clearTimeout(this.commitTimer);
    }

    this.commitTimer = setTimeout(() => {
      this.processCommit();
    }, CONFIG.COMMIT_DEBOUNCE_MS);
  }

  /**
   * Process accumulated changes and create commit
   */
  async processCommit() {
    if (this.isProcessing || this.pendingChanges.size === 0) return;

    this.isProcessing = true;

    try {
      this.log(`🔄 Processing ${this.pendingChanges.size} changed files...`);

      // Analyze changes
      const changeAnalysis = await this.analyzeChanges();

      if (!changeAnalysis.shouldCommit) {
        this.log('⏭️  Changes below commit threshold, skipping...');
        this.pendingChanges.clear();
        return;
      }

      // Stage changes
      await this.stageChanges();

      // Generate commit message
      const commitMessage = await this.generateCommitMessage(changeAnalysis);

      // Create commit
      await this.createCommit(commitMessage);

      // Update stats
      this.updateStats(changeAnalysis);

      this.pendingChanges.clear();
      this.lastCommitTime = Date.now();

      this.log(`✅ Auto-commit completed: ${commitMessage.split('\n')[0]}`);

    } catch (error) {
      this.log(`❌ Commit failed: ${error.message}`);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Analyze changes to determine commit worthiness and type
   */
  async analyzeChanges() {
    try {
      const gitStatus = execSync('git status --porcelain', {
        cwd: projectRoot,
        encoding: 'utf8'
      });

      if (!gitStatus.trim()) {
        return { shouldCommit: false };
      }

      const gitDiff = execSync('git diff --stat', {
        cwd: projectRoot,
        encoding: 'utf8'
      });

      // Parse diff statistics
      const diffLines = gitDiff.split('\n');
      const summaryLine = diffLines[diffLines.length - 2] || '';
      const match = summaryLine.match(/(\d+)\s+insertions?\(?\+?\)?,?\s*(\d+)?\s*deletions?\(?-?\)?/);

      const insertions = match ? parseInt(match[1]) || 0 : 0;
      const deletions = match ? parseInt(match[2]) || 0 : 0;
      const totalChanges = insertions + deletions;

      // Determine change significance
      let changeType = 'minor';
      if (totalChanges >= CONFIG.MAJOR_CHANGE_THRESHOLD) {
        changeType = 'major';
      }

      // Determine commit type based on files
      const commitType = this.determineCommitType([...this.pendingChanges]);

      return {
        shouldCommit: totalChanges >= CONFIG.MINOR_CHANGE_THRESHOLD,
        changeType,
        commitType,
        insertions,
        deletions,
        totalChanges,
        files: [...this.pendingChanges]
      };

    } catch (error) {
      this.log(`⚠️  Error analyzing changes: ${error.message}`);
      return { shouldCommit: false };
    }
  }

  /**
   * Determine the appropriate commit type based on changed files
   */
  determineCommitType(files) {
    const patterns = {
      feat: /src\/(components|pages)\/.*\.(jsx?|tsx?)$/,
      fix: /\.(jsx?|tsx?)$/, // Could be a fix if it's a code file
      docs: /\.(md|txt)$/,
      style: /\.(css|scss|sass)$/,
      config: /(package\.json|\.config\.|vite\.|tailwind\.|eslint\.)/,
      deps: /package\.json$/
    };

    // Count matches for each type
    const typeCounts = {};
    for (const [type, pattern] of Object.entries(patterns)) {
      typeCounts[type] = files.filter(file => pattern.test(file)).length;
    }

    // Return the type with the most matches, defaulting to 'feat'
    const mostCommonType = Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0];

    return mostCommonType && mostCommonType[1] > 0 ? mostCommonType[0] : 'feat';
  }

  /**
   * Stage all changes for commit
   */
  async stageChanges() {
    try {
      execSync('git add .', { cwd: projectRoot });
      this.log('📦 Changes staged successfully');
    } catch (error) {
      throw new Error(`Failed to stage changes: ${error.message}`);
    }
  }

  /**
   * Generate intelligent commit message based on changes
   */
  async generateCommitMessage(analysis) {
    const { commitType, files, insertions, deletions } = analysis;

    // Get current branch
    const branch = execSync('git branch --show-current', {
      cwd: projectRoot,
      encoding: 'utf8'
    }).trim();

    // Get short description of files changed
    const fileTypes = this.categorizeFiles(files);
    let scope = '';
    let description = '';

    if (fileTypes.components > 0) {
      scope = 'components';
      description = `update ${fileTypes.components} component${fileTypes.components > 1 ? 's' : ''}`;
    } else if (fileTypes.pages > 0) {
      scope = 'pages';
      description = `update ${fileTypes.pages} page${fileTypes.pages > 1 ? 's' : ''}`;
    } else if (fileTypes.config > 0) {
      scope = 'config';
      description = 'update configuration';
    } else if (fileTypes.docs > 0) {
      scope = 'docs';
      description = 'update documentation';
    } else {
      description = 'update project files';
    }

    // Build commit message
    const title = scope
      ? `${commitType}(${scope}): ${description}`
      : `${commitType}: ${description}`;

    const body = [
      '',
      `Modified ${files.length} file${files.length > 1 ? 's' : ''}`,
      `+${insertions} -${deletions} lines`,
      '',
      '🤖 Generated with Claude Code Auto-Commit',
      '',
      'Co-Authored-By: Claude <noreply@anthropic.com>'
    ].join('\n');

    return `${title}${body}`;
  }

  /**
   * Categorize files by type
   */
  categorizeFiles(files) {
    const categories = {
      components: 0,
      pages: 0,
      config: 0,
      docs: 0,
      styles: 0,
      other: 0
    };

    files.forEach(file => {
      if (file.includes('src/components/')) categories.components++;
      else if (file.includes('src/pages/')) categories.pages++;
      else if (file.match(/\.(config|json)$/)) categories.config++;
      else if (file.match(/\.(md|txt)$/)) categories.docs++;
      else if (file.match(/\.(css|scss)$/)) categories.styles++;
      else categories.other++;
    });

    return categories;
  }

  /**
   * Create the git commit
   */
  async createCommit(message) {
    try {
      execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, {
        cwd: projectRoot
      });
      this.log('📝 Commit created successfully');
    } catch (error) {
      throw new Error(`Failed to create commit: ${error.message}`);
    }
  }

  /**
   * Setup periodic push to remote
   */
  setupPeriodicPush() {
    this.pushTimer = setInterval(async () => {
      await this.pushToRemote();
    }, CONFIG.PUSH_INTERVAL_MS);
  }

  /**
   * Push commits to remote repository
   */
  async pushToRemote() {
    try {
      // Check if there are unpushed commits
      const unpushed = execSync('git log @{u}..HEAD --oneline', {
        cwd: projectRoot,
        encoding: 'utf8'
      }).trim();

      if (unpushed) {
        execSync('git push', { cwd: projectRoot });
        this.log('🚀 Pushed commits to remote');
      }
    } catch (error) {
      this.log(`⚠️  Push failed: ${error.message}`);
    }
  }

  /**
   * Check if current directory is a git repository
   */
  async isGitRepository() {
    try {
      execSync('git rev-parse --is-inside-work-tree', {
        cwd: projectRoot,
        stdio: 'pipe'
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get current status of the auto-commit system
   */
  async getStatus() {
    const stats = await this.loadStats();
    const gitStatus = execSync('git status --porcelain', {
      cwd: projectRoot,
      encoding: 'utf8'
    });

    return {
      isRunning: !!this.watcher,
      pendingChanges: this.pendingChanges.size,
      lastCommitTime: this.lastCommitTime,
      totalCommits: stats.totalCommits || 0,
      gitStatus: gitStatus.trim(),
      recentActivity: this.activityLog.slice(-5)
    };
  }

  /**
   * Load statistics from file
   */
  async loadStats() {
    try {
      const data = await fs.readFile(this.statsFilePath, 'utf8');
      return JSON.parse(data);
    } catch {
      return { totalCommits: 0, lastRun: null };
    }
  }

  /**
   * Save statistics to file
   */
  async saveStats() {
    const stats = {
      totalCommits: (await this.loadStats()).totalCommits || 0,
      lastRun: Date.now()
    };

    try {
      await fs.writeFile(this.statsFilePath, JSON.stringify(stats, null, 2));
    } catch (error) {
      this.log(`⚠️  Failed to save stats: ${error.message}`);
    }
  }

  /**
   * Update statistics after successful commit
   */
  async updateStats(analysis) {
    const stats = await this.loadStats();
    stats.totalCommits = (stats.totalCommits || 0) + 1;
    await this.saveStats();
  }

  /**
   * Log activity with timestamp
   */
  log(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;

    console.log(logEntry);

    this.activityLog.push({ timestamp, message });

    // Keep only last 100 entries
    if (this.activityLog.length > 100) {
      this.activityLog = this.activityLog.slice(-100);
    }
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const manager = new AutoCommitManager();

  switch (command) {
    case 'start':
    case 'watch':
      await manager.start();

      // Keep process alive
      process.on('SIGINT', async () => {
        await manager.stop();
        process.exit(0);
      });

      // Keep running
      setInterval(() => {}, 1000);
      break;

    case 'status':
      const status = await manager.getStatus();
      console.log('\n📊 Auto-Commit Status:');
      console.log(`Running: ${status.isRunning ? '✅' : '❌'}`);
      console.log(`Pending Changes: ${status.pendingChanges}`);
      console.log(`Total Commits: ${status.totalCommits}`);
      console.log(`Last Commit: ${status.lastCommitTime ? new Date(status.lastCommitTime).toLocaleString() : 'Never'}`);

      if (status.gitStatus) {
        console.log('\n📋 Git Status:');
        console.log(status.gitStatus);
      }

      if (status.recentActivity.length > 0) {
        console.log('\n📈 Recent Activity:');
        status.recentActivity.forEach(entry => {
          console.log(`  ${entry.message}`);
        });
      }
      break;

    case 'commit':
      // Manual commit trigger
      manager.pendingChanges.add('manual-trigger');
      await manager.processCommit();
      break;

    default:
      console.log(`
🤖 Auto-Commit Manager

Usage:
  node scripts/auto-commit.js [command]

Commands:
  start, watch    Start file monitoring and auto-commit
  status          Show current status and statistics
  commit          Trigger immediate commit of pending changes

Examples:
  npm run auto-commit:watch    # Start in watch mode
  npm run auto-commit:status   # Check status
  npm run auto-commit          # Manual commit
      `);
  }
}

export default AutoCommitManager;