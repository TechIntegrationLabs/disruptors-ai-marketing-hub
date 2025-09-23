#!/usr/bin/env node

/**
 * Changelog Manager
 * Intelligent changelog maintenance system for the Disruptors AI Marketing Hub
 *
 * Features:
 * - Automatic changelog entry generation based on commits
 * - Semantic versioning with automatic version bumping
 * - Change categorization (Added, Changed, Fixed, etc.)
 * - Release note generation
 * - Integration with auto-commit system
 */

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const changelogPath = path.join(projectRoot, 'CHANGELOG.md');

// Configuration
const CONFIG = {
  // Version bump rules based on commit types
  VERSION_RULES: {
    'feat': 'minor',     // New features
    'fix': 'patch',      // Bug fixes
    'docs': 'patch',     // Documentation
    'style': 'patch',    // Formatting
    'refactor': 'patch', // Code refactoring
    'config': 'patch',   // Configuration changes
    'deps': 'patch',     // Dependency updates
    'breaking': 'major'  // Breaking changes
  },

  // Changelog categories mapping
  CATEGORIES: {
    'feat': 'Added',
    'fix': 'Fixed',
    'docs': 'Changed',
    'style': 'Changed',
    'refactor': 'Changed',
    'config': 'Changed',
    'deps': 'Changed',
    'breaking': 'Changed',
    'security': 'Security',
    'deprecate': 'Deprecated',
    'remove': 'Removed'
  },

  // Commit patterns to ignore in changelog
  IGNORE_PATTERNS: [
    /^(merge|revert|wip|temp|test):/i,
    /^Merge (branch|pull request)/i,
    /^Auto-commit:/i,
    /^Update changelog/i
  ]
};

class ChangelogManager {
  constructor() {
    this.currentVersion = '0.0.0';
    this.pendingChanges = {
      Added: [],
      Changed: [],
      Fixed: [],
      Deprecated: [],
      Removed: [],
      Security: []
    };
  }

  /**
   * Initialize the changelog manager
   */
  async initialize() {
    try {
      await this.loadCurrentVersion();
      await this.ensureChangelogExists();
      this.log('✅ Changelog Manager initialized');
      return true;
    } catch (error) {
      this.log(`❌ Failed to initialize: ${error.message}`);
      return false;
    }
  }

  /**
   * Add a new changelog entry based on recent commits
   */
  async addEntry(commitMessage, files = []) {
    try {
      // Parse commit message
      const change = this.parseCommitMessage(commitMessage);

      if (!change || this.shouldIgnoreCommit(commitMessage)) {
        this.log(`⏭️  Skipping commit: ${commitMessage.split('\n')[0]}`);
        return;
      }

      // Determine category and description
      const category = CONFIG.CATEGORIES[change.type] || 'Changed';
      const description = this.generateDescription(change, files);

      // Add to pending changes
      if (!this.pendingChanges[category]) {
        this.pendingChanges[category] = [];
      }

      this.pendingChanges[category].push({
        description,
        files: files.length,
        type: change.type,
        scope: change.scope,
        timestamp: new Date().toISOString()
      });

      this.log(`📝 Added ${category} entry: ${description}`);

      // Update version if needed
      await this.updateVersionIfNeeded(change.type);

      return true;
    } catch (error) {
      this.log(`❌ Failed to add entry: ${error.message}`);
      return false;
    }
  }

  /**
   * Flush pending changes to changelog
   */
  async flushChanges() {
    try {
      if (this.isEmpty()) {
        this.log('📝 No pending changes to flush');
        return;
      }

      await this.updateChangelog();
      this.clearPendingChanges();

      this.log('✅ Changelog updated successfully');
      return true;
    } catch (error) {
      this.log(`❌ Failed to flush changes: ${error.message}`);
      return false;
    }
  }

  /**
   * Generate a new release
   */
  async generateRelease(version = null, releaseNotes = '') {
    try {
      const newVersion = version || await this.bumpVersion();

      // Move unreleased changes to new version
      await this.createVersionSection(newVersion, releaseNotes);

      // Update package.json version
      await this.updatePackageVersion(newVersion);

      this.log(`🚀 Created release ${newVersion}`);
      return newVersion;
    } catch (error) {
      this.log(`❌ Failed to generate release: ${error.message}`);
      return null;
    }
  }

  /**
   * Parse conventional commit message
   */
  parseCommitMessage(message) {
    const lines = message.split('\n');
    const firstLine = lines[0].trim();

    // Match conventional commit format: type(scope): description
    const match = firstLine.match(/^(\w+)(?:\(([^)]+)\))?: (.+)$/);

    if (!match) {
      return null;
    }

    return {
      type: match[1].toLowerCase(),
      scope: match[2] || '',
      description: match[3],
      body: lines.slice(1).join('\n').trim()
    };
  }

  /**
   * Check if commit should be ignored
   */
  shouldIgnoreCommit(message) {
    return CONFIG.IGNORE_PATTERNS.some(pattern => pattern.test(message));
  }

  /**
   * Generate human-readable description from commit
   */
  generateDescription(change, files) {
    let description = change.description;

    // Enhance description based on scope and files
    if (change.scope) {
      if (change.scope === 'components' && files.length > 0) {
        description = `${description} (${files.length} component${files.length > 1 ? 's' : ''})`;
      } else if (change.scope === 'pages' && files.length > 0) {
        description = `${description} (${files.length} page${files.length > 1 ? 's' : ''})`;
      } else if (change.scope === 'docs') {
        description = `${description} (documentation)`;
      }
    }

    // Capitalize first letter
    return description.charAt(0).toUpperCase() + description.slice(1);
  }

  /**
   * Update version based on change type
   */
  async updateVersionIfNeeded(changeType) {
    const versionType = CONFIG.VERSION_RULES[changeType];
    if (versionType) {
      this.currentVersion = this.bumpVersionString(this.currentVersion, versionType);
    }
  }

  /**
   * Bump version string according to semantic versioning
   */
  bumpVersionString(version, type) {
    const parts = version.split('.').map(Number);

    switch (type) {
      case 'major':
        parts[0]++;
        parts[1] = 0;
        parts[2] = 0;
        break;
      case 'minor':
        parts[1]++;
        parts[2] = 0;
        break;
      case 'patch':
        parts[2]++;
        break;
    }

    return parts.join('.');
  }

  /**
   * Load current version from package.json or changelog
   */
  async loadCurrentVersion() {
    try {
      // Try package.json first
      const packagePath = path.join(projectRoot, 'package.json');
      const packageData = JSON.parse(await fs.readFile(packagePath, 'utf8'));
      this.currentVersion = packageData.version || '0.0.0';
    } catch {
      // Fallback to extracting from changelog
      try {
        const changelog = await fs.readFile(changelogPath, 'utf8');
        const versionMatch = changelog.match(/## \[(\d+\.\d+\.\d+)\]/);
        this.currentVersion = versionMatch ? versionMatch[1] : '0.0.0';
      } catch {
        this.currentVersion = '0.0.0';
      }
    }
  }

  /**
   * Ensure changelog file exists
   */
  async ensureChangelogExists() {
    try {
      await fs.access(changelogPath);
    } catch {
      // Create basic changelog structure
      const template = this.generateChangelogTemplate();
      await fs.writeFile(changelogPath, template, 'utf8');
      this.log('📝 Created new CHANGELOG.md');
    }
  }

  /**
   * Update changelog with pending changes
   */
  async updateChangelog() {
    const changelog = await fs.readFile(changelogPath, 'utf8');

    // Find unreleased section
    const unreleasedMatch = changelog.match(/## \[Unreleased\]([\s\S]*?)(?=\n## \[|\n---|\n$)/);

    if (!unreleasedMatch) {
      throw new Error('Unreleased section not found in changelog');
    }

    // Generate new unreleased content
    const newUnreleasedContent = this.generateUnreleasedSection();

    // Replace unreleased section
    const updatedChangelog = changelog.replace(
      /## \[Unreleased\][\s\S]*?(?=\n## \[|\n---|\n$)/,
      newUnreleasedContent
    );

    await fs.writeFile(changelogPath, updatedChangelog, 'utf8');
  }

  /**
   * Generate unreleased section with pending changes
   */
  generateUnreleasedSection() {
    let content = '## [Unreleased]\n\n';

    // Add each category with changes
    for (const [category, changes] of Object.entries(this.pendingChanges)) {
      if (changes.length > 0) {
        content += `### ${category}\n`;
        for (const change of changes) {
          content += `- ${change.description}\n`;
        }
        content += '\n';
      }
    }

    if (this.isEmpty()) {
      content += '### No unreleased changes\n\n';
    }

    return content;
  }

  /**
   * Create a new version section in changelog
   */
  async createVersionSection(version, releaseNotes = '') {
    const changelog = await fs.readFile(changelogPath, 'utf8');
    const date = new Date().toISOString().split('T')[0];

    // Create version section
    let versionSection = `## [${version}] - ${date}\n\n`;

    // Add release notes if provided
    if (releaseNotes) {
      versionSection += `${releaseNotes}\n\n`;
    }

    // Add pending changes
    versionSection += this.generateUnreleasedSection().replace('## [Unreleased]', '').trim();
    versionSection += '\n\n---\n\n';

    // Insert after unreleased section
    const updatedChangelog = changelog.replace(
      /(## \[Unreleased\][\s\S]*?\n\n)/,
      `## [Unreleased]\n\n### No unreleased changes\n\n---\n\n${versionSection}`
    );

    await fs.writeFile(changelogPath, updatedChangelog, 'utf8');
  }

  /**
   * Update package.json version
   */
  async updatePackageVersion(version) {
    const packagePath = path.join(projectRoot, 'package.json');
    const packageData = JSON.parse(await fs.readFile(packagePath, 'utf8'));
    packageData.version = version;
    await fs.writeFile(packagePath, JSON.stringify(packageData, null, 2) + '\n', 'utf8');
  }

  /**
   * Automatically bump version based on pending changes
   */
  async bumpVersion() {
    let bumpType = 'patch';

    // Determine highest priority bump type
    for (const [category, changes] of Object.entries(this.pendingChanges)) {
      for (const change of changes) {
        const ruleBump = CONFIG.VERSION_RULES[change.type];
        if (ruleBump === 'major') {
          bumpType = 'major';
          break;
        } else if (ruleBump === 'minor' && bumpType === 'patch') {
          bumpType = 'minor';
        }
      }
      if (bumpType === 'major') break;
    }

    return this.bumpVersionString(this.currentVersion, bumpType);
  }

  /**
   * Generate basic changelog template
   */
  generateChangelogTemplate() {
    return `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### No unreleased changes

---

## [${this.currentVersion}] - ${new Date().toISOString().split('T')[0]}

### Added
- Initial release
`;
  }

  /**
   * Check if there are pending changes
   */
  isEmpty() {
    return Object.values(this.pendingChanges).every(changes => changes.length === 0);
  }

  /**
   * Clear all pending changes
   */
  clearPendingChanges() {
    for (const category of Object.keys(this.pendingChanges)) {
      this.pendingChanges[category] = [];
    }
  }

  /**
   * Get status of changelog manager
   */
  async getStatus() {
    const totalPending = Object.values(this.pendingChanges)
      .reduce((sum, changes) => sum + changes.length, 0);

    return {
      currentVersion: this.currentVersion,
      pendingChanges: totalPending,
      categoryCounts: Object.fromEntries(
        Object.entries(this.pendingChanges).map(([cat, changes]) => [cat, changes.length])
      ),
      lastUpdate: (await fs.stat(changelogPath)).mtime
    };
  }

  /**
   * Log with timestamp
   */
  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const manager = new ChangelogManager();

  switch (command) {
    case 'init':
      await manager.initialize();
      break;

    case 'add':
      const commitMessage = process.argv[3] || '';
      if (!commitMessage) {
        console.log('Usage: npm run changelog:add "commit message"');
        process.exit(1);
      }
      await manager.initialize();
      await manager.addEntry(commitMessage);
      await manager.flushChanges();
      break;

    case 'flush':
      await manager.initialize();
      await manager.flushChanges();
      break;

    case 'release':
      const version = process.argv[3];
      const notes = process.argv[4] || '';
      await manager.initialize();
      const newVersion = await manager.generateRelease(version, notes);
      if (newVersion) {
        console.log(`✅ Released version ${newVersion}`);
      }
      break;

    case 'status':
      await manager.initialize();
      const status = await manager.getStatus();
      console.log('\n📋 Changelog Status:');
      console.log(`Current Version: ${status.currentVersion}`);
      console.log(`Pending Changes: ${status.pendingChanges}`);
      console.log(`Last Update: ${status.lastUpdate.toLocaleString()}`);

      if (status.pendingChanges > 0) {
        console.log('\n📊 Category Breakdown:');
        for (const [category, count] of Object.entries(status.categoryCounts)) {
          if (count > 0) {
            console.log(`  ${category}: ${count}`);
          }
        }
      }
      break;

    default:
      console.log(`
📝 Changelog Manager

Usage:
  node scripts/changelog-manager.js [command]

Commands:
  init              Initialize changelog system
  add "message"     Add changelog entry from commit message
  flush             Update changelog with pending changes
  release [version] Create a new release
  status            Show current status

Examples:
  npm run changelog:add "feat(components): add new button component"
  npm run changelog:release
  npm run changelog:status
      `);
  }
}

export default ChangelogManager;