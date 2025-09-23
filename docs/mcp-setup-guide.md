# MCP Setup and Usage Guide

This guide explains how to set up and use Model Context Protocol (MCP) servers with this repository.

## Quick Start

1. **Copy MCP Configuration**
   ```bash
   # Copy the repo's mcp.json to your Cursor config directory
   cp mcp.json ~/.cursor/mcp.json
   # OR on Windows:
   copy mcp.json %USERPROFILE%\.cursor\mcp.json
   ```

2. **Ensure Environment Variables**
   The `.env` file in this repository contains all necessary API keys and tokens.

3. **Restart Cursor/Claude Code**
   Restart your IDE to load the new MCP configuration.

## Configuration Files

### Repository MCP Configuration
- **Location**: `./mcp.json`
- **Purpose**: Project-specific MCP server configuration
- **Usage**: Copy to your global Cursor config when working on this project

### Global MCP Configuration
- **Location**: `~/.cursor/mcp.json` (macOS/Linux) or `%USERPROFILE%\.cursor\mcp.json` (Windows)
- **Purpose**: System-wide MCP server configuration for Cursor/Claude Code

### Environment Variables
- **Location**: `./.env`
- **Purpose**: Contains API keys and configuration for all MCP servers
- **Security**: Never commit this file to version control

## Usage Examples

### Content Creation Workflow

1. **Research Phase**
   ```
   Use DataForSEO → Research keywords and competitors
   Use Firecrawl → Extract content from competitor sites
   Use Apify → Gather market data and insights
   ```

2. **Content Planning**
   ```
   Use Airtable → Create content calendar and planning
   Use Memory → Store research findings and context
   Use Sequential Thinking → Plan content strategy
   ```

3. **Content Creation**
   ```
   Use Nano Banana → Generate initial content drafts
   Use Figma → Extract design assets and brand elements
   Use Cloudinary → Optimize and process media assets
   ```

4. **Publishing & Deployment**
   ```
   Use GitHub → Commit content changes
   Use Netlify/Vercel → Deploy updated content
   Use N8N → Trigger automated workflows
   ```

### Development Workflow

1. **Project Setup**
   ```
   Use GitHub → Clone and manage repositories
   Use Filesystem → Navigate and organize project files
   Use Supabase → Set up database and backend services
   ```

2. **Development Process**
   ```
   Use Memory → Maintain context across sessions
   Use Sequential Thinking → Break down complex features
   Use Replicate → Integrate AI capabilities
   ```

3. **Testing & Automation**
   ```
   Use Playwright → Run automated browser tests
   Use Puppeteer → Generate screenshots and PDFs
   Use Fetch → Test API endpoints
   ```

4. **Deployment & Monitoring**
   ```
   Use DigitalOcean → Manage cloud infrastructure
   Use Railway → Deploy applications
   Use GoHighLevel → Manage customer interactions
   ```

### Marketing & Analytics Workflow

1. **SEO Research**
   ```
   Use DataForSEO → Keyword research and SERP analysis
   Use Firecrawl → Analyze competitor content strategies
   Use Apify → Collect market and competitor data
   ```

2. **Campaign Management**
   ```
   Use GoHighLevel → Create and manage marketing campaigns
   Use Airtable → Track leads and campaign performance
   Use N8N → Automate campaign workflows
   ```

3. **Content Distribution**
   ```
   Use Cloudinary → Optimize media for different platforms
   Use Netlify → Deploy landing pages and content
   Use GitHub → Version control marketing assets
   ```

4. **Performance Monitoring**
   ```
   Use Supabase → Track user interactions and analytics
   Use Memory → Store campaign insights and learnings
   Use Fetch → Monitor API performance and uptime
   ```

## Advanced Configuration

### Custom Server Paths
If you need to customize server paths or add additional servers:

1. Edit the `mcp.json` file in this repository
2. Add your custom configuration following the existing patterns
3. Update the global configuration as needed

### Environment Variable Management
To add new API keys or modify existing ones:

1. Update the `.env` file in this repository
2. Ensure the corresponding server configuration in `mcp.json` references the correct environment variable
3. Restart Cursor/Claude Code to apply changes

### Server-Specific Setup

#### Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Generate an access token from your account settings
3. Update `SUPABASE_ACCESS_TOKEN` and `SUPABASE_PROJECT_REF` in `.env`

#### GitHub Setup
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Create a token with `repo`, `read:org`, and `read:user` permissions
3. Update `GITHUB_PERSONAL_ACCESS_TOKEN` in `.env`

#### Cloudinary Setup
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Update the corresponding variables in `.env`

## Troubleshooting

### Common Issues

1. **Server Not Loading**
   - Check that the package name is correct in `mcp.json`
   - Ensure all required environment variables are set
   - Verify network connectivity for URL-based servers

2. **Permission Errors**
   - Check file system permissions for local paths
   - Verify API key permissions for external services
   - Ensure environment variables are properly loaded

3. **Performance Issues**
   - Consider disabling unused servers
   - Check for rate limits on external APIs
   - Monitor system resources (CPU, memory)

### Debug Mode
To enable debug mode for MCP servers:

1. Add `"debug": true` to any server configuration
2. Check Cursor/Claude Code logs for detailed output
3. Monitor system console for error messages

### Getting Help

- **MCP Documentation**: [Model Context Protocol Docs](https://modelcontextprotocol.io/)
- **Cursor Support**: [Cursor Documentation](https://docs.cursor.com/)
- **Repository Issues**: Create an issue in this repository for project-specific problems

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Rotate API keys regularly** for better security
3. **Use environment-specific configurations** for different deployment environments
4. **Monitor API usage** to detect unusual activity
5. **Keep packages updated** for security patches

## Performance Optimization

1. **Disable unused servers** to reduce startup time
2. **Use server-specific rate limiting** to avoid API throttling
3. **Cache frequently accessed data** using the Memory server
4. **Monitor resource usage** and adjust configurations as needed

## Contributing

When adding new MCP servers to this repository:

1. Add the server configuration to `mcp.json`
2. Document the server capabilities in `docs/mcp-servers.md`
3. Add any required environment variables to `.env.example`
4. Update this guide with usage examples
5. Test the configuration thoroughly before committing