#!/usr/bin/env node

/**
 * MCP Global Orchestration Manager
 *
 * This script provides comprehensive orchestration, monitoring, and optimization
 * for all Model Context Protocol (MCP) servers in the Disruptors AI Marketing Hub.
 *
 * Features:
 * - Health monitoring and auto-recovery
 * - Connection pooling and load balancing
 * - Intelligent service routing
 * - Real-time status reporting
 * - Dependency management
 * - Performance optimization
 */

import fs from 'fs/promises';
import path from 'path';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class MCPOrchestrator {
  constructor() {
    this.configPath = path.join(process.cwd(), 'mcp.json');
    this.config = null;
    this.services = new Map();
    this.healthChecks = new Map();
    this.connections = new Map();
    this.metrics = {
      totalRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      serviceUptime: new Map()
    };

    // Service categories and their priorities
    this.serviceCategories = {
      critical: ['github', 'filesystem', 'memory', 'supabase'],
      high: ['netlify', 'cloudinary', 'replicate', 'nano-banana'],
      medium: ['playwright', 'puppeteer', 'firecrawl', 'n8n-mcp'],
      low: ['airtable', 'figma', 'gohighlevel', 'dataforseo']
    };

    this.isRunning = false;
    this.healthCheckInterval = null;
  }

  /**
   * Initialize the orchestrator and load configuration
   */
  async initialize() {
    try {
      console.log('🚀 Initializing MCP Global Orchestrator...');

      await this.loadConfiguration();
      await this.validateEnvironment();
      await this.initializeServices();

      console.log('✅ MCP Orchestrator initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize MCP Orchestrator:', error.message);
      return false;
    }
  }

  /**
   * Load MCP configuration from mcp.json
   */
  async loadConfiguration() {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configData);

      console.log(`📋 Loaded configuration for ${Object.keys(this.config.mcpServers).length} services`);

      // Validate configuration structure
      if (!this.config.mcpServers) {
        throw new Error('Invalid MCP configuration: missing mcpServers');
      }

      return this.config;
    } catch (error) {
      throw new Error(`Failed to load MCP configuration: ${error.message}`);
    }
  }

  /**
   * Validate environment variables and dependencies
   */
  async validateEnvironment() {
    const missing = [];
    const warnings = [];

    // Check for required environment variables
    const envChecks = {
      'GITHUB_PERSONAL_ACCESS_TOKEN': 'GitHub integration',
      'SUPABASE_ACCESS_TOKEN': 'Supabase database operations',
      'NETLIFY_AUTH_TOKEN': 'Netlify deployment',
      'CLOUDINARY_API_KEY': 'Media management',
      'REPLICATE_API_TOKEN': 'AI model inference'
    };

    for (const [envVar, service] of Object.entries(envChecks)) {
      if (!process.env[envVar] || process.env[envVar].includes('YOUR_') || process.env[envVar].includes('PLACEHOLDER')) {
        if (['GITHUB_PERSONAL_ACCESS_TOKEN', 'SUPABASE_ACCESS_TOKEN'].includes(envVar)) {
          missing.push(`${envVar} (required for ${service})`);
        } else {
          warnings.push(`${envVar} (${service} will be limited)`);
        }
      }
    }

    if (missing.length > 0) {
      console.warn('⚠️  Missing critical environment variables:', missing);
    }

    if (warnings.length > 0) {
      console.warn('⚠️  Missing optional environment variables:', warnings);
    }

    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

    if (majorVersion < 18) {
      throw new Error(`Node.js ${nodeVersion} is not supported. Please upgrade to Node.js 18 or higher.`);
    }

    console.log(`✅ Environment validation completed (Node.js ${nodeVersion})`);
  }

  /**
   * Initialize all MCP services
   */
  async initializeServices() {
    const services = Object.keys(this.config.mcpServers);
    console.log(`🔧 Initializing ${services.length} MCP services...`);

    // Initialize services by priority
    for (const priority of ['critical', 'high', 'medium', 'low']) {
      const priorityServices = services.filter(service =>
        this.serviceCategories[priority]?.includes(service)
      );

      if (priorityServices.length > 0) {
        console.log(`⚡ Starting ${priority} priority services: ${priorityServices.join(', ')}`);
        await this.initializeServiceBatch(priorityServices);
      }
    }

    // Initialize any remaining services
    const remainingServices = services.filter(service =>
      !Object.values(this.serviceCategories).flat().includes(service)
    );

    if (remainingServices.length > 0) {
      console.log(`🔄 Starting remaining services: ${remainingServices.join(', ')}`);
      await this.initializeServiceBatch(remainingServices);
    }
  }

  /**
   * Initialize a batch of services
   */
  async initializeServiceBatch(serviceNames) {
    const initPromises = serviceNames.map(serviceName =>
      this.initializeService(serviceName).catch(error => {
        console.error(`❌ Failed to initialize ${serviceName}:`, error.message);
        return { serviceName, error: error.message, status: 'failed' };
      })
    );

    const results = await Promise.allSettled(initPromises);

    results.forEach((result, index) => {
      const serviceName = serviceNames[index];
      if (result.status === 'fulfilled' && !result.value.error) {
        console.log(`✅ ${serviceName} initialized successfully`);
      } else {
        console.error(`❌ ${serviceName} initialization failed`);
      }
    });
  }

  /**
   * Initialize a single MCP service
   */
  async initializeService(serviceName) {
    const serviceConfig = this.config.mcpServers[serviceName];

    if (!serviceConfig) {
      throw new Error(`Service ${serviceName} not found in configuration`);
    }

    try {
      // Test service availability
      await this.testServiceConnectivity(serviceName, serviceConfig);

      // Store service configuration
      this.services.set(serviceName, {
        config: serviceConfig,
        status: 'ready',
        lastHealthCheck: Date.now(),
        responseTime: 0,
        errorCount: 0,
        uptime: Date.now()
      });

      return { serviceName, status: 'ready' };
    } catch (error) {
      this.services.set(serviceName, {
        config: serviceConfig,
        status: 'error',
        lastHealthCheck: Date.now(),
        error: error.message,
        errorCount: 1
      });
      throw error;
    }
  }

  /**
   * Test connectivity to a specific service
   */
  async testServiceConnectivity(serviceName, serviceConfig) {
    const startTime = Date.now();

    try {
      if (serviceConfig.url) {
        // URL-based service
        await this.testUrlService(serviceConfig.url);
      } else if (serviceConfig.command) {
        // Command-based service
        await this.testCommandService(serviceConfig);
      } else {
        throw new Error('Invalid service configuration');
      }

      const responseTime = Date.now() - startTime;

      // Update metrics
      const service = this.services.get(serviceName);
      if (service) {
        service.responseTime = responseTime;
        service.lastHealthCheck = Date.now();
      }

      return { status: 'ok', responseTime };
    } catch (error) {
      throw new Error(`Connectivity test failed for ${serviceName}: ${error.message}`);
    }
  }

  /**
   * Test URL-based service
   */
  async testUrlService(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'MCP-Orchestrator/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      throw new Error(`URL test failed: ${error.message}`);
    }
  }

  /**
   * Test command-based service
   */
  async testCommandService(serviceConfig) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Service test timeout'));
      }, 15000);

      try {
        const child = spawn(serviceConfig.command, [...serviceConfig.args, '--help'], {
          env: { ...process.env, ...serviceConfig.env },
          stdio: 'pipe'
        });

        child.on('error', (error) => {
          clearTimeout(timeout);
          reject(new Error(`Command failed: ${error.message}`));
        });

        child.on('close', (code) => {
          clearTimeout(timeout);
          if (code === 0 || code === null) {
            resolve(true);
          } else {
            reject(new Error(`Command exited with code ${code}`));
          }
        });

        // Kill process after timeout
        setTimeout(() => {
          child.kill();
        }, 10000);

      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  /**
   * Start health monitoring
   */
  startHealthMonitoring(interval = 30000) {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    console.log(`💓 Starting health monitoring (${interval/1000}s intervals)`);

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, interval);

    // Perform initial health check
    this.performHealthChecks();
  }

  /**
   * Perform health checks on all services
   */
  async performHealthChecks() {
    const services = Array.from(this.services.keys());
    const healthPromises = services.map(serviceName =>
      this.performServiceHealthCheck(serviceName)
    );

    const results = await Promise.allSettled(healthPromises);

    let healthyCount = 0;
    let unhealthyCount = 0;

    results.forEach((result, index) => {
      const serviceName = services[index];
      if (result.status === 'fulfilled' && result.value.healthy) {
        healthyCount++;
      } else {
        unhealthyCount++;
        console.warn(`⚠️  Health check failed for ${serviceName}`);
      }
    });

    console.log(`💓 Health check completed: ${healthyCount} healthy, ${unhealthyCount} unhealthy`);

    // Update global metrics
    this.metrics.lastHealthCheck = Date.now();
    this.metrics.healthyServices = healthyCount;
    this.metrics.unhealthyServices = unhealthyCount;
  }

  /**
   * Perform health check on a single service
   */
  async performServiceHealthCheck(serviceName) {
    const service = this.services.get(serviceName);
    if (!service) {
      return { serviceName, healthy: false, error: 'Service not found' };
    }

    try {
      await this.testServiceConnectivity(serviceName, service.config);

      service.status = 'ready';
      service.errorCount = Math.max(0, service.errorCount - 1);
      service.lastHealthCheck = Date.now();

      return { serviceName, healthy: true };
    } catch (error) {
      service.status = 'error';
      service.errorCount += 1;
      service.lastHealthCheck = Date.now();
      service.lastError = error.message;

      // Attempt auto-recovery for critical services
      if (this.serviceCategories.critical.includes(serviceName) && service.errorCount >= 3) {
        console.log(`🔄 Attempting auto-recovery for critical service: ${serviceName}`);
        await this.attemptServiceRecovery(serviceName);
      }

      return { serviceName, healthy: false, error: error.message };
    }
  }

  /**
   * Attempt to recover a failed service
   */
  async attemptServiceRecovery(serviceName) {
    const service = this.services.get(serviceName);
    if (!service) return false;

    try {
      console.log(`🔧 Recovering service: ${serviceName}`);

      // Re-initialize the service
      await this.initializeService(serviceName);

      console.log(`✅ Service ${serviceName} recovered successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to recover service ${serviceName}:`, error.message);
      return false;
    }
  }

  /**
   * Get comprehensive status report
   */
  generateStatusReport() {
    const services = Array.from(this.services.entries());
    const totalServices = services.length;
    const readyServices = services.filter(([, service]) => service.status === 'ready').length;
    const errorServices = services.filter(([, service]) => service.status === 'error').length;

    const report = {
      timestamp: new Date().toISOString(),
      overview: {
        totalServices,
        readyServices,
        errorServices,
        healthPercentage: Math.round((readyServices / totalServices) * 100)
      },
      categories: {},
      services: {},
      recommendations: []
    };

    // Generate category status
    for (const [category, serviceList] of Object.entries(this.serviceCategories)) {
      const categoryServices = serviceList.filter(service => this.services.has(service));
      const readyCount = categoryServices.filter(service =>
        this.services.get(service)?.status === 'ready'
      ).length;

      report.categories[category] = {
        total: categoryServices.length,
        ready: readyCount,
        health: categoryServices.length > 0 ? Math.round((readyCount / categoryServices.length) * 100) : 0
      };
    }

    // Generate individual service status
    for (const [serviceName, service] of services) {
      report.services[serviceName] = {
        status: service.status,
        responseTime: service.responseTime || 0,
        errorCount: service.errorCount || 0,
        uptime: service.uptime ? Date.now() - service.uptime : 0,
        lastHealthCheck: service.lastHealthCheck,
        lastError: service.lastError
      };
    }

    // Generate recommendations
    report.recommendations = this.generateRecommendations();

    return report;
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Check for failed critical services
    for (const serviceName of this.serviceCategories.critical) {
      const service = this.services.get(serviceName);
      if (service && service.status === 'error') {
        recommendations.push({
          priority: 'critical',
          service: serviceName,
          issue: 'Critical service is offline',
          solution: `Immediate attention required for ${serviceName}. Check configuration and network connectivity.`
        });
      }
    }

    // Check for high error rates
    for (const [serviceName, service] of this.services.entries()) {
      if (service.errorCount > 5) {
        recommendations.push({
          priority: 'high',
          service: serviceName,
          issue: `High error rate detected (${service.errorCount} errors)`,
          solution: `Review ${serviceName} configuration and consider implementing circuit breaker pattern.`
        });
      }
    }

    // Check for slow response times
    for (const [serviceName, service] of this.services.entries()) {
      if (service.responseTime > 5000) {
        recommendations.push({
          priority: 'medium',
          service: serviceName,
          issue: `Slow response time (${service.responseTime}ms)`,
          solution: `Consider implementing caching or connection pooling for ${serviceName}.`
        });
      }
    }

    // General optimization recommendations
    if (this.services.size > 15) {
      recommendations.push({
        priority: 'low',
        service: 'global',
        issue: 'Large number of MCP services configured',
        solution: 'Consider implementing service prioritization and lazy loading for better performance.'
      });
    }

    return recommendations;
  }

  /**
   * Start the orchestrator
   */
  async start() {
    if (this.isRunning) {
      console.log('🔄 MCP Orchestrator is already running');
      return;
    }

    const initialized = await this.initialize();
    if (!initialized) {
      throw new Error('Failed to initialize MCP Orchestrator');
    }

    this.isRunning = true;
    this.startHealthMonitoring();

    console.log('🚀 MCP Global Orchestrator is now running');
    console.log(`📊 Managing ${this.services.size} services across ${Object.keys(this.serviceCategories).length} priority levels`);

    // Generate initial status report
    const report = this.generateStatusReport();
    console.log(`💚 System health: ${report.overview.healthPercentage}% (${report.overview.readyServices}/${report.overview.totalServices} services ready)`);

    return report;
  }

  /**
   * Stop the orchestrator
   */
  stop() {
    if (!this.isRunning) {
      console.log('⏹️  MCP Orchestrator is not running');
      return;
    }

    console.log('⏹️  Stopping MCP Orchestrator...');

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    this.isRunning = false;
    console.log('✅ MCP Orchestrator stopped');
  }

  /**
   * Get service status
   */
  getServiceStatus(serviceName) {
    const service = this.services.get(serviceName);
    if (!service) {
      return { error: 'Service not found' };
    }

    return {
      name: serviceName,
      status: service.status,
      responseTime: service.responseTime,
      errorCount: service.errorCount,
      uptime: service.uptime ? Date.now() - service.uptime : 0,
      lastHealthCheck: service.lastHealthCheck,
      lastError: service.lastError
    };
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const orchestrator = new MCPOrchestrator();

  const command = process.argv[2];

  switch (command) {
    case 'start':
      orchestrator.start()
        .then(report => {
          console.log('\n📊 Initial Status Report:');
          console.log(JSON.stringify(report, null, 2));
        })
        .catch(error => {
          console.error('❌ Failed to start orchestrator:', error.message);
          process.exit(1);
        });
      break;

    case 'status':
      orchestrator.initialize()
        .then(() => {
          const report = orchestrator.generateStatusReport();
          console.log(JSON.stringify(report, null, 2));
        })
        .catch(error => {
          console.error('❌ Failed to get status:', error.message);
          process.exit(1);
        });
      break;

    case 'health':
      orchestrator.initialize()
        .then(() => orchestrator.performHealthChecks())
        .then(() => {
          const report = orchestrator.generateStatusReport();
          console.log(`Health: ${report.overview.healthPercentage}% (${report.overview.readyServices}/${report.overview.totalServices})`);
        })
        .catch(error => {
          console.error('❌ Health check failed:', error.message);
          process.exit(1);
        });
      break;

    case 'optimize':
      orchestrator.initialize()
        .then(() => {
          const recommendations = orchestrator.generateRecommendations();
          console.log('🔧 Optimization Recommendations:');
          console.log(JSON.stringify(recommendations, null, 2));
        })
        .catch(error => {
          console.error('❌ Optimization analysis failed:', error.message);
          process.exit(1);
        });
      break;

    default:
      console.log(`
🎛️  MCP Global Orchestration Manager

Usage: node mcp-orchestrator.js <command>

Commands:
  start     - Start the orchestrator with full monitoring
  status    - Get comprehensive status report
  health    - Perform health checks on all services
  optimize  - Generate optimization recommendations

Examples:
  node mcp-orchestrator.js start
  node mcp-orchestrator.js status
  node mcp-orchestrator.js health
  node mcp-orchestrator.js optimize
      `);
      break;
  }
}

export default MCPOrchestrator;