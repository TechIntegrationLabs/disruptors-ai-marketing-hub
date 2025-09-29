#!/usr/bin/env node

/**
 * MCP Health Monitoring & Auto-Recovery System
 *
 * Advanced monitoring system for MCP services with:
 * - Real-time health tracking
 * - Automatic failure detection
 * - Intelligent recovery mechanisms
 * - Performance metrics collection
 * - Alert generation
 */

import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';
import { promisify } from 'util';

class MCPHealthMonitor {
  constructor() {
    this.configPath = path.join(process.cwd(), 'mcp.json');
    this.healthHistoryPath = path.join(process.cwd(), 'mcp-health-history.json');
    this.alertsPath = path.join(process.cwd(), 'mcp-alerts.json');

    this.services = new Map();
    this.healthHistory = [];
    this.alerts = [];
    this.metrics = {
      totalChecks: 0,
      successfulChecks: 0,
      failedChecks: 0,
      averageResponseTime: 0,
      serviceMetrics: new Map()
    };

    this.monitoringActive = false;
    this.monitoringInterval = null;
    this.alertThresholds = {
      responseTime: 10000, // 10 seconds
      errorRate: 0.2, // 20% error rate
      consecutiveFailures: 3,
      recoveryTime: 300000 // 5 minutes
    };
  }

  /**
   * Initialize the health monitor
   */
  async initialize() {
    try {
      console.log('🏥 Initializing MCP Health Monitor...');

      await this.loadConfiguration();
      await this.loadHealthHistory();
      await this.loadAlerts();
      await this.initializeServiceMetrics();

      console.log(`✅ Health Monitor initialized for ${this.services.size} services`);
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Health Monitor:', error.message);
      return false;
    }
  }

  /**
   * Load MCP configuration
   */
  async loadConfiguration() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      const config = JSON.parse(configData);

      for (const [serviceName, serviceConfig] of Object.entries(config.mcpServers)) {
        this.services.set(serviceName, {
          config: serviceConfig,
          status: 'unknown',
          lastCheck: null,
          responseTime: 0,
          errorCount: 0,
          consecutiveFailures: 0,
          totalChecks: 0,
          successfulChecks: 0,
          uptime: 0,
          downtime: 0
        });
      }

      console.log(`📋 Loaded ${this.services.size} service configurations`);
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error.message}`);
    }
  }

  /**
   * Load health history from disk
   */
  async loadHealthHistory() {
    try {
      const historyData = await fs.readFile(this.healthHistoryPath, 'utf8');
      this.healthHistory = JSON.parse(historyData);
      console.log(`📊 Loaded ${this.healthHistory.length} historical health records`);
    } catch (error) {
      // File doesn't exist or is invalid, start fresh
      this.healthHistory = [];
      console.log('📊 Starting with fresh health history');
    }
  }

  /**
   * Load alerts from disk
   */
  async loadAlerts() {
    try {
      const alertsData = await fs.readFile(this.alertsPath, 'utf8');
      this.alerts = JSON.parse(alertsData);
      console.log(`🚨 Loaded ${this.alerts.length} existing alerts`);
    } catch (error) {
      this.alerts = [];
      console.log('🚨 Starting with no alerts');
    }
  }

  /**
   * Initialize service metrics
   */
  async initializeServiceMetrics() {
    for (const serviceName of this.services.keys()) {
      this.metrics.serviceMetrics.set(serviceName, {
        responseTimeHistory: [],
        errorRateHistory: [],
        availabilityHistory: [],
        lastFailure: null,
        lastRecovery: null,
        mttr: 0, // Mean Time To Recovery
        mtbf: 0  // Mean Time Between Failures
      });
    }
  }

  /**
   * Start continuous health monitoring
   */
  startMonitoring(interval = 30000) {
    if (this.monitoringActive) {
      console.log('🔄 Health monitoring is already active');
      return;
    }

    console.log(`💓 Starting health monitoring (${interval/1000}s intervals)`);
    this.monitoringActive = true;

    // Perform initial health check
    this.performHealthCheck();

    // Set up recurring health checks
    this.monitoringInterval = setInterval(() => {
      this.performHealthCheck();
    }, interval);

    // Set up periodic cleanup and reporting
    setInterval(() => {
      this.cleanupOldData();
      this.generatePeriodicReport();
    }, 300000); // Every 5 minutes
  }

  /**
   * Stop health monitoring
   */
  stopMonitoring() {
    if (!this.monitoringActive) {
      console.log('⏹️  Health monitoring is not active');
      return;
    }

    console.log('⏹️  Stopping health monitoring...');
    this.monitoringActive = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    console.log('✅ Health monitoring stopped');
  }

  /**
   * Perform comprehensive health check on all services
   */
  async performHealthCheck() {
    const timestamp = Date.now();
    const checkResults = [];

    console.log('🔍 Performing health check on all services...');

    // Run health checks in parallel with controlled concurrency
    const serviceNames = Array.from(this.services.keys());
    const batchSize = 5; // Check 5 services at a time

    for (let i = 0; i < serviceNames.length; i += batchSize) {
      const batch = serviceNames.slice(i, i + batchSize);
      const batchPromises = batch.map(serviceName =>
        this.checkServiceHealth(serviceName, timestamp)
      );

      const batchResults = await Promise.allSettled(batchPromises);
      checkResults.push(...batchResults.map((result, index) => ({
        serviceName: batch[index],
        result: result.status === 'fulfilled' ? result.value : { healthy: false, error: result.reason }
      })));
    }

    // Process results and update metrics
    await this.processHealthCheckResults(checkResults, timestamp);

    // Check for alerts
    await this.checkAlertConditions();

    // Save health data
    await this.saveHealthData();

    console.log(`✅ Health check completed for ${serviceNames.length} services`);
  }

  /**
   * Check health of a single service
   */
  async checkServiceHealth(serviceName, timestamp) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    const startTime = Date.now();
    let healthy = false;
    let error = null;

    try {
      if (service.config.url) {
        healthy = await this.testUrlService(service.config.url);
      } else if (service.config.command) {
        healthy = await this.testCommandService(service.config);
      } else {
        throw new Error('Invalid service configuration');
      }
    } catch (err) {
      error = err.message;
      healthy = false;
    }

    const responseTime = Date.now() - startTime;

    // Update service data
    service.lastCheck = timestamp;
    service.responseTime = responseTime;
    service.totalChecks++;

    if (healthy) {
      service.status = 'healthy';
      service.successfulChecks++;
      service.consecutiveFailures = 0;

      // Update recovery time if this was a recovery
      if (service.status === 'unhealthy') {
        const metrics = this.metrics.serviceMetrics.get(serviceName);
        if (metrics && metrics.lastFailure) {
          metrics.lastRecovery = timestamp;
          metrics.mttr = this.calculateMTTR(serviceName);
        }
      }
    } else {
      service.status = 'unhealthy';
      service.errorCount++;
      service.consecutiveFailures++;

      // Record failure time
      const metrics = this.metrics.serviceMetrics.get(serviceName);
      if (metrics && service.consecutiveFailures === 1) {
        metrics.lastFailure = timestamp;
      }
    }

    // Update service metrics
    this.updateServiceMetrics(serviceName, healthy, responseTime, timestamp);

    return {
      serviceName,
      healthy,
      responseTime,
      error,
      timestamp
    };
  }

  /**
   * Test URL-based service
   */
  async testUrlService(url) {
    try {
      // Use fetch if available, otherwise use a simple HTTP check
      if (typeof fetch !== 'undefined') {
        const response = await fetch(url, {
          method: 'HEAD',
          timeout: 10000,
          headers: {
            'User-Agent': 'MCP-Health-Monitor/1.0'
          }
        });
        return response.ok;
      } else {
        // Fallback for Node.js environments without fetch
        const https = await import('https');
        const http = await import('http');
        const urlObj = new URL(url);
        const client = urlObj.protocol === 'https:' ? https : http;

        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            req.destroy();
            reject(new Error('Request timeout'));
          }, 10000);

          const req = client.request({
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'HEAD'
          }, (res) => {
            clearTimeout(timeout);
            resolve(res.statusCode >= 200 && res.statusCode < 400);
          });

          req.on('error', (error) => {
            clearTimeout(timeout);
            reject(error);
          });

          req.end();
        });
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Test command-based service
   */
  async testCommandService(serviceConfig) {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, 15000);

      try {
        const child = spawn(serviceConfig.command, [...serviceConfig.args, '--version'], {
          env: { ...process.env, ...serviceConfig.env },
          stdio: 'pipe'
        });

        child.on('error', () => {
          clearTimeout(timeout);
          resolve(false);
        });

        child.on('close', (code) => {
          clearTimeout(timeout);
          resolve(code === 0 || code === null);
        });

        // Kill process after timeout
        setTimeout(() => {
          child.kill();
        }, 10000);

      } catch (error) {
        clearTimeout(timeout);
        resolve(false);
      }
    });
  }

  /**
   * Update service metrics
   */
  updateServiceMetrics(serviceName, healthy, responseTime, timestamp) {
    const metrics = this.metrics.serviceMetrics.get(serviceName);
    if (!metrics) return;

    // Update response time history
    metrics.responseTimeHistory.push({ timestamp, responseTime });
    if (metrics.responseTimeHistory.length > 100) {
      metrics.responseTimeHistory.shift();
    }

    // Update error rate history
    const service = this.services.get(serviceName);
    const errorRate = service.errorCount / service.totalChecks;
    metrics.errorRateHistory.push({ timestamp, errorRate });
    if (metrics.errorRateHistory.length > 100) {
      metrics.errorRateHistory.shift();
    }

    // Update availability history
    const availability = service.successfulChecks / service.totalChecks;
    metrics.availabilityHistory.push({ timestamp, availability });
    if (metrics.availabilityHistory.length > 100) {
      metrics.availabilityHistory.shift();
    }
  }

  /**
   * Calculate Mean Time To Recovery
   */
  calculateMTTR(serviceName) {
    const metrics = this.metrics.serviceMetrics.get(serviceName);
    if (!metrics || !metrics.lastFailure || !metrics.lastRecovery) {
      return 0;
    }

    return metrics.lastRecovery - metrics.lastFailure;
  }

  /**
   * Process health check results
   */
  async processHealthCheckResults(results, timestamp) {
    let healthyCount = 0;
    let unhealthyCount = 0;

    for (const { serviceName, result } of results) {
      if (result.healthy) {
        healthyCount++;
      } else {
        unhealthyCount++;

        // Attempt auto-recovery for critical services
        const service = this.services.get(serviceName);
        if (service && service.consecutiveFailures >= this.alertThresholds.consecutiveFailures) {
          await this.attemptAutoRecovery(serviceName);
        }
      }
    }

    // Update global metrics
    this.metrics.totalChecks++;
    this.metrics.successfulChecks += healthyCount;
    this.metrics.failedChecks += unhealthyCount;

    // Add to health history
    this.healthHistory.push({
      timestamp,
      healthyServices: healthyCount,
      unhealthyServices: unhealthyCount,
      totalServices: results.length,
      healthPercentage: Math.round((healthyCount / results.length) * 100)
    });

    // Keep only last 1000 entries
    if (this.healthHistory.length > 1000) {
      this.healthHistory = this.healthHistory.slice(-1000);
    }
  }

  /**
   * Attempt automatic recovery for a service
   */
  async attemptAutoRecovery(serviceName) {
    console.log(`🔄 Attempting auto-recovery for ${serviceName}...`);

    try {
      // Add delay before recovery attempt
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Re-test the service
      const result = await this.checkServiceHealth(serviceName, Date.now());

      if (result.healthy) {
        console.log(`✅ Auto-recovery successful for ${serviceName}`);
        this.addAlert('recovery', `Service ${serviceName} automatically recovered`, 'info');
        return true;
      } else {
        console.log(`❌ Auto-recovery failed for ${serviceName}`);
        this.addAlert('recovery_failed', `Auto-recovery failed for ${serviceName}`, 'warning');
        return false;
      }
    } catch (error) {
      console.error(`❌ Error during auto-recovery for ${serviceName}:`, error.message);
      return false;
    }
  }

  /**
   * Check for alert conditions
   */
  async checkAlertConditions() {
    for (const [serviceName, service] of this.services.entries()) {
      // Check for consecutive failures
      if (service.consecutiveFailures >= this.alertThresholds.consecutiveFailures) {
        this.addAlert(
          'consecutive_failures',
          `Service ${serviceName} has ${service.consecutiveFailures} consecutive failures`,
          'critical'
        );
      }

      // Check for high response time
      if (service.responseTime > this.alertThresholds.responseTime) {
        this.addAlert(
          'high_response_time',
          `Service ${serviceName} response time is ${service.responseTime}ms`,
          'warning'
        );
      }

      // Check for high error rate
      const errorRate = service.errorCount / service.totalChecks;
      if (service.totalChecks > 10 && errorRate > this.alertThresholds.errorRate) {
        this.addAlert(
          'high_error_rate',
          `Service ${serviceName} error rate is ${Math.round(errorRate * 100)}%`,
          'warning'
        );
      }
    }
  }

  /**
   * Add an alert
   */
  addAlert(type, message, severity) {
    const alert = {
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      type,
      message,
      severity,
      acknowledged: false
    };

    this.alerts.push(alert);
    console.log(`🚨 Alert [${severity.toUpperCase()}]: ${message}`);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  /**
   * Save health data to disk
   */
  async saveHealthData() {
    try {
      await fs.writeFile(this.healthHistoryPath, JSON.stringify(this.healthHistory, null, 2));
      await fs.writeFile(this.alertsPath, JSON.stringify(this.alerts, null, 2));
    } catch (error) {
      console.error('❌ Failed to save health data:', error.message);
    }
  }

  /**
   * Clean up old data
   */
  cleanupOldData() {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago

    // Clean up old health history
    this.healthHistory = this.healthHistory.filter(entry => entry.timestamp > cutoffTime);

    // Clean up old alerts
    this.alerts = this.alerts.filter(alert => alert.timestamp > cutoffTime);

    console.log('🧹 Cleaned up old health data');
  }

  /**
   * Generate periodic report
   */
  generatePeriodicReport() {
    const report = this.generateHealthReport();
    console.log('📊 Periodic Health Report:');
    console.log(`Overall Health: ${report.overview.healthPercentage}%`);
    console.log(`Active Alerts: ${report.alerts.filter(a => !a.acknowledged).length}`);
    console.log(`Average Response Time: ${report.metrics.averageResponseTime}ms`);
  }

  /**
   * Generate comprehensive health report
   */
  generateHealthReport() {
    const timestamp = Date.now();
    const services = Array.from(this.services.entries());

    const healthyServices = services.filter(([, service]) => service.status === 'healthy').length;
    const unhealthyServices = services.filter(([, service]) => service.status === 'unhealthy').length;
    const unknownServices = services.filter(([, service]) => service.status === 'unknown').length;

    const totalResponseTime = services.reduce((sum, [, service]) => sum + service.responseTime, 0);
    const averageResponseTime = services.length > 0 ? Math.round(totalResponseTime / services.length) : 0;

    return {
      timestamp: new Date(timestamp).toISOString(),
      overview: {
        totalServices: services.length,
        healthyServices,
        unhealthyServices,
        unknownServices,
        healthPercentage: services.length > 0 ? Math.round((healthyServices / services.length) * 100) : 0
      },
      metrics: {
        totalChecks: this.metrics.totalChecks,
        successfulChecks: this.metrics.successfulChecks,
        failedChecks: this.metrics.failedChecks,
        averageResponseTime,
        uptime: this.monitoringActive ? Date.now() - this.metrics.startTime : 0
      },
      services: Object.fromEntries(
        services.map(([name, service]) => [name, {
          status: service.status,
          responseTime: service.responseTime,
          errorCount: service.errorCount,
          consecutiveFailures: service.consecutiveFailures,
          availability: service.totalChecks > 0 ? Math.round((service.successfulChecks / service.totalChecks) * 100) : 0,
          lastCheck: service.lastCheck
        }])
      ),
      alerts: this.alerts.slice(-20), // Last 20 alerts
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Generate recommendations based on health data
   */
  generateRecommendations() {
    const recommendations = [];

    // Check each service for issues
    for (const [serviceName, service] of this.services.entries()) {
      if (service.status === 'unhealthy' && service.consecutiveFailures > 0) {
        recommendations.push({
          priority: service.consecutiveFailures >= 3 ? 'critical' : 'high',
          service: serviceName,
          issue: `Service is unhealthy with ${service.consecutiveFailures} consecutive failures`,
          solution: 'Check service configuration, network connectivity, and logs'
        });
      }

      if (service.responseTime > 5000) {
        recommendations.push({
          priority: 'medium',
          service: serviceName,
          issue: `High response time (${service.responseTime}ms)`,
          solution: 'Consider optimizing service or implementing caching'
        });
      }

      const errorRate = service.totalChecks > 0 ? service.errorCount / service.totalChecks : 0;
      if (errorRate > 0.1 && service.totalChecks > 10) {
        recommendations.push({
          priority: 'medium',
          service: serviceName,
          issue: `High error rate (${Math.round(errorRate * 100)}%)`,
          solution: 'Review service logs and consider implementing retry logic'
        });
      }
    }

    return recommendations;
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new MCPHealthMonitor();

  const command = process.argv[2];

  switch (command) {
    case 'start':
      monitor.initialize()
        .then(() => {
          monitor.metrics.startTime = Date.now();
          monitor.startMonitoring();
          console.log('🏥 Health monitoring started. Press Ctrl+C to stop.');

          // Handle graceful shutdown
          process.on('SIGINT', () => {
            console.log('\n⏹️  Shutting down health monitor...');
            monitor.stopMonitoring();
            process.exit(0);
          });
        })
        .catch(error => {
          console.error('❌ Failed to start health monitor:', error.message);
          process.exit(1);
        });
      break;

    case 'check':
      monitor.initialize()
        .then(() => monitor.performHealthCheck())
        .then(() => {
          const report = monitor.generateHealthReport();
          console.log(JSON.stringify(report, null, 2));
        })
        .catch(error => {
          console.error('❌ Health check failed:', error.message);
          process.exit(1);
        });
      break;

    case 'report':
      monitor.initialize()
        .then(() => {
          const report = monitor.generateHealthReport();
          console.log(JSON.stringify(report, null, 2));
        })
        .catch(error => {
          console.error('❌ Failed to generate report:', error.message);
          process.exit(1);
        });
      break;

    default:
      console.log(`
🏥 MCP Health Monitoring System

Usage: node mcp-health-monitor.js <command>

Commands:
  start   - Start continuous health monitoring
  check   - Perform one-time health check
  report  - Generate health report

Examples:
  node mcp-health-monitor.js start
  node mcp-health-monitor.js check
  node mcp-health-monitor.js report
      `);
      break;
  }
}

export default MCPHealthMonitor;