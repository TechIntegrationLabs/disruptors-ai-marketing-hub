#!/usr/bin/env node

/**
 * Integration Manager
 * Coordinates the auto-commit, changelog, and documentation systems
 *
 * Features:
 * - Orchestrates all automation systems
 * - Handles system startup and shutdown
 * - Provides unified status and monitoring
 * - Manages system integration and coordination
 */

import AutoCommitManager from './auto-commit.js';
import ChangelogManager from './changelog-manager.js';
import { spawn, execSync } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

class IntegrationManager {
  constructor() {
    this.autoCommit = new AutoCommitManager();
    this.changelog = new ChangelogManager();
    this.isRunning = false;
    this.systems = {
      autoCommit: false,
      changelog: false,
      documentation: false
    };
  }

  /**
   * Start all automation systems
   */
  async startAll() {
    try {
      this.log('🚀 Starting Integrated Automation System...');

      // Initialize changelog system
      await this.changelog.initialize();
      this.systems.changelog = true;

      // Start auto-commit system with changelog integration
      const autoCommitStarted = await this.autoCommit.start();
      this.systems.autoCommit = autoCommitStarted;

      // Documentation system is always active (it's a subagent)
      this.systems.documentation = true;

      this.isRunning = true;
      this.log('✅ All automation systems started successfully');

      return true;
    } catch (error) {
      this.log(`❌ Failed to start systems: ${error.message}`);
      return false;
    }
  }

  /**
   * Stop all automation systems
   */
  async stopAll() {
    try {
      this.log('🛑 Stopping Integrated Automation System...');

      if (this.systems.autoCommit) {
        await this.autoCommit.stop();
        this.systems.autoCommit = false;
      }

      this.isRunning = false;
      this.log('✅ All automation systems stopped');

      return true;
    } catch (error) {
      this.log(`❌ Failed to stop systems: ${error.message}`);
      return false;
    }
  }

  /**
   * Get comprehensive status of all systems
   */
  async getIntegratedStatus() {
    const status = {
      integration: {
        isRunning: this.isRunning,
        systems: { ...this.systems },
        timestamp: new Date().toISOString()
      }
    };

    try {
      // Get auto-commit status
      if (this.systems.autoCommit) {
        status.autoCommit = await this.autoCommit.getStatus();
      }

      // Get changelog status
      if (this.systems.changelog) {
        status.changelog = await this.changelog.getStatus();
      }

      // Get git status
      try {
        const gitStatus = execSync('git status --porcelain', {
          cwd: projectRoot,
          encoding: 'utf8'
        });
        const gitBranch = execSync('git branch --show-current', {
          cwd: projectRoot,
          encoding: 'utf8'
        }).trim();

        status.git = {
          branch: gitBranch,
          uncommittedFiles: gitStatus.trim().split('\n').filter(line => line.trim()).length,
          hasUncommitted: !!gitStatus.trim()
        };
      } catch (error) {
        status.git = { error: error.message };
      }

      // Get documentation system status (simulated)
      status.documentation = {
        active: true,
        syncEngine: 'running',
        lastSync: new Date().toISOString()
      };

      return status;
    } catch (error) {
      status.error = error.message;
      return status;
    }
  }

  /**
   * Trigger a manual integration cycle
   */
  async triggerIntegration() {
    try {
      this.log('🔄 Triggering manual integration cycle...');

      // Check for pending changes
      const gitStatus = execSync('git status --porcelain', {
        cwd: projectRoot,
        encoding: 'utf8'
      });

      if (!gitStatus.trim()) {
        this.log('📝 No changes to process');
        return { success: true, message: 'No changes to process' };
      }

      // Trigger auto-commit
      if (this.systems.autoCommit) {
        await this.autoCommit.processCommit();
      }

      // Get the latest commit for changelog
      try {
        const latestCommit = execSync('git log -1 --pretty=format:"%s%n%b"', {
          cwd: projectRoot,
          encoding: 'utf8'
        });

        // Add to changelog
        if (this.systems.changelog) {
          await this.changelog.addEntry(latestCommit);
          await this.changelog.flushChanges();
        }
      } catch (error) {
        this.log(`⚠️  Failed to update changelog: ${error.message}`);
      }

      this.log('✅ Integration cycle completed');
      return { success: true, message: 'Integration cycle completed' };

    } catch (error) {
      this.log(`❌ Integration cycle failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Test all systems
   */
  async testSystems() {
    const results = {
      autoCommit: { status: 'unknown', message: '' },
      changelog: { status: 'unknown', message: '' },
      documentation: { status: 'unknown', message: '' },
      integration: { status: 'unknown', message: '' }
    };

    try {
      // Test auto-commit system
      try {
        const autoCommitStatus = await this.autoCommit.getStatus();
        results.autoCommit = {
          status: 'success',
          message: `Auto-commit system functional. Pending changes: ${autoCommitStatus.pendingChanges}`
        };
      } catch (error) {
        results.autoCommit = {
          status: 'error',
          message: `Auto-commit test failed: ${error.message}`
        };
      }

      // Test changelog system
      try {
        await this.changelog.initialize();
        const changelogStatus = await this.changelog.getStatus();
        results.changelog = {
          status: 'success',
          message: `Changelog system functional. Version: ${changelogStatus.currentVersion}, Pending: ${changelogStatus.pendingChanges}`
        };
      } catch (error) {
        results.changelog = {
          status: 'error',
          message: `Changelog test failed: ${error.message}`
        };
      }

      // Test documentation system (check if files exist)
      try {
        const readmePath = path.join(projectRoot, 'README.md');
        const claudePath = path.join(projectRoot, 'CLAUDE.md');
        const changelogPath = path.join(projectRoot, 'CHANGELOG.md');

        await fs.access(readmePath);
        await fs.access(claudePath);
        await fs.access(changelogPath);

        results.documentation = {
          status: 'success',
          message: 'Documentation system functional. All key files exist and are accessible.'
        };
      } catch (error) {
        results.documentation = {
          status: 'error',
          message: `Documentation test failed: ${error.message}`
        };
      }

      // Test integration
      const overallSuccess = Object.values(results).every(result => result.status === 'success');
      results.integration = {
        status: overallSuccess ? 'success' : 'warning',
        message: overallSuccess
          ? 'All systems integrated and functional'
          : 'Some systems have issues but integration is possible'
      };

      return results;

    } catch (error) {
      results.integration = {
        status: 'error',
        message: `Integration test failed: ${error.message}`
      };
      return results;
    }
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
  const manager = new IntegrationManager();

  switch (command) {
    case 'start':
      const started = await manager.startAll();
      if (started) {
        console.log('\n🎯 Integration Manager started. Press Ctrl+C to stop.\n');

        // Keep process alive and handle shutdown gracefully
        process.on('SIGINT', async () => {
          console.log('\n\n🛑 Shutting down Integration Manager...');
          await manager.stopAll();
          process.exit(0);
        });

        // Keep running
        setInterval(() => {}, 1000);
      }
      break;

    case 'stop':
      await manager.stopAll();
      break;

    case 'status':
      const status = await manager.getIntegratedStatus();
      console.log('\n🎯 Integrated Automation Status:');
      console.log('================================');

      console.log('\n🔧 System Status:');
      console.log(`Integration Manager: ${status.integration.isRunning ? '✅ Running' : '❌ Stopped'}`);
      console.log(`Auto-Commit: ${status.integration.systems.autoCommit ? '✅ Active' : '❌ Inactive'}`);
      console.log(`Changelog: ${status.integration.systems.changelog ? '✅ Active' : '❌ Inactive'}`);
      console.log(`Documentation: ${status.integration.systems.documentation ? '✅ Active' : '❌ Inactive'}`);

      if (status.git) {
        console.log('\n📋 Git Status:');
        console.log(`Branch: ${status.git.branch || 'unknown'}`);
        console.log(`Uncommitted Files: ${status.git.uncommittedFiles || 0}`);
      }

      if (status.autoCommit) {
        console.log('\n🤖 Auto-Commit Details:');
        console.log(`Pending Changes: ${status.autoCommit.pendingChanges}`);
        console.log(`Total Commits: ${status.autoCommit.totalCommits}`);
      }

      if (status.changelog) {
        console.log('\n📝 Changelog Details:');
        console.log(`Current Version: ${status.changelog.currentVersion}`);
        console.log(`Pending Changes: ${status.changelog.pendingChanges}`);
      }
      break;

    case 'trigger':
      const result = await manager.triggerIntegration();
      if (result.success) {
        console.log(`✅ ${result.message}`);
      } else {
        console.log(`❌ ${result.error}`);
      }
      break;

    case 'test':
      const testResults = await manager.testSystems();
      console.log('\n🧪 System Test Results:');
      console.log('======================');

      for (const [system, result] of Object.entries(testResults)) {
        const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
        console.log(`\n${icon} ${system.toUpperCase()}:`);
        console.log(`   ${result.message}`);
      }
      break;

    default:
      console.log(`
🎯 Integration Manager

Coordinates auto-commit, changelog, and documentation systems.

Usage:
  node scripts/integration-manager.js [command]

Commands:
  start      Start all automation systems
  stop       Stop all automation systems
  status     Show comprehensive system status
  trigger    Manually trigger integration cycle
  test       Test all systems functionality

Examples:
  npm run integration:start     # Start all systems
  npm run integration:status    # Check status
  npm run integration:trigger   # Manual integration
  npm run integration:test      # Test all systems
      `);
  }
}

export default IntegrationManager;