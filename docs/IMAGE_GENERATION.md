# AI Image Generation System

This documentation covers the comprehensive AI image generation system integrated into the Disruptors AI marketing hub, featuring Google Gemini (nano-banana), OpenAI GPT-image-1, and Replicate API with MCP (Model Context Protocol) integration.

## Overview

The image generation system provides multiple AI-powered image generation capabilities through:

- **Google Gemini 2.5 Flash Image (nano-banana)** - Google's state-of-the-art image generation and editing model
- **OpenAI GPT-image-1** - OpenAI's latest high-resolution image generation model
- **Replicate API** - Access to various open-source models like FLUX and Stable Diffusion
- **MCP Integration** - Seamless integration with development tools and workflows

## Architecture

### Core Components

1. **ImageGenerationService** (`src/lib/image-generation.js`)
   - Main service class handling all provider integrations
   - Unified API for all image generation providers
   - Error handling and response formatting

2. **ImageGenerator Component** (`src/components/shared/ImageGenerator.jsx`)
   - React component providing the user interface
   - Multi-provider support with comparison features
   - Image management (download, share, copy)

3. **MCP Configuration** (`mcp.json`)
   - Configuration for all MCP servers
   - API key management and environment setup

## Provider Details

### Google Gemini (nano-banana)

**Model**: `gemini-2.5-flash-image`
**Codename**: nano-banana
**Released**: August 26, 2025

#### Key Features:
- Advanced character consistency across images
- Natural language editing and transformations
- Image blending and style transfer
- Global availability (free and paid tiers)
- SynthID watermarking for AI-generated content

#### Pricing:
- $30.00 per 1 million output tokens
- Each image = 1290 output tokens (~$0.039 per image)

#### Usage Example:
```javascript
const service = new ImageGenerationService();
const result = await service.generateWithGemini("A futuristic cityscape at sunset", {
  temperature: 0.7
});
```

### OpenAI GPT-image-1

**Model**: `gpt-image-1`
**Released**: April 24, 2025

#### Key Features:
- High-resolution images up to 4096×4096 pixels
- Excellent instruction following
- Reliable text rendering within images
- Multiple generation modes (text-to-image, image-to-image, inpainting)
- C2PA metadata for transparency

#### Modes Supported:
- **Text-to-image**: Generate from text prompts
- **Image-to-image**: Create from uploaded images + prompts
- **Text transformation**: Edit images with text prompts
- **Inpainting**: Edit with bounding boxes

#### Usage Example:
```javascript
const result = await service.generateWithOpenAI("Professional headshot of a CEO", {
  size: "1024x1024",
  quality: "hd",
  count: 1
});
```

### Replicate API

**Popular Models**:
- `black-forest-labs/flux-schnell` (default)
- `stability-ai/stable-diffusion-xl-base-1.0`
- Various other open-source models

#### Key Features:
- Access to cutting-edge open-source models
- Flexible parameter control
- Async prediction handling
- Community-driven model ecosystem

#### Usage Example:
```javascript
const result = await service.generateWithReplicate("Abstract art in vibrant colors", {
  model: "black-forest-labs/flux-schnell",
  width: 1024,
  height: 1024,
  guidance_scale: 7.5,
  steps: 50
});
```

## Setup Instructions

### 1. Environment Variables

Create a `.env` file with the following variables:

```env
# Google Gemini API
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI API
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Replicate API
VITE_REPLICATE_API_TOKEN=your_replicate_token_here
```

### 2. MCP Configuration

Update your `mcp.json` file to include the image generation servers:

```json
{
  "mcpServers": {
    "nano-banana": {
      "command": "npx",
      "args": ["-y", "nano-banana-mcp"],
      "env": {
        "GEMINI_API_KEY": "your_gemini_api_key"
      }
    },
    "openai-image": {
      "command": "npx",
      "args": ["-y", "openai-image-mcp"],
      "env": {
        "OPENAI_API_KEY": "your_openai_api_key"
      }
    },
    "replicate": {
      "command": "npx",
      "args": ["-y", "replicate-mcp"],
      "env": {
        "REPLICATE_API_TOKEN": "your_replicate_token"
      }
    }
  }
}
```

### 3. API Key Setup

#### Google Gemini API Key:
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Create a new API key
3. Enable the Generative Language API

#### OpenAI API Key:
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Navigate to API Keys section
3. Create a new secret key
4. Ensure you have access to GPT-image-1 (may require verification)

#### Replicate API Token:
1. Visit [Replicate](https://replicate.com)
2. Go to Account Settings > API Tokens
3. Create a new token

## Usage Examples

### Basic Image Generation

```javascript
import ImageGenerationService from '@/lib/image-generation';

const service = new ImageGenerationService();

// Generate with specific provider
const geminiResult = await service.generateWithGemini("A beautiful landscape");
const openaiResult = await service.generateWithOpenAI("Professional logo design");
const replicateResult = await service.generateWithReplicate("Abstract digital art");

// Generate with all providers for comparison
const allResults = await service.generateWithAllProviders("Futuristic robot", {
  gemini: { temperature: 0.8 },
  openai: { size: "1024x1024", quality: "hd" },
  replicate: { model: "black-forest-labs/flux-schnell", steps: 30 }
});
```

### Component Integration

```jsx
import ImageGenerator from '@/components/shared/ImageGenerator';

function MyPage() {
  return (
    <div>
      <h1>AI Image Generation</h1>
      <ImageGenerator />
    </div>
  );
}
```

## Advanced Features

### Multi-Provider Comparison

The system supports generating the same prompt across all providers simultaneously for quality and style comparison:

```javascript
const results = await service.generateWithAllProviders("Professional headshot", options);
// Returns array with results from all providers
```

### Error Handling

The service includes comprehensive error handling:

```javascript
try {
  const result = await service.generateWithGemini(prompt);
} catch (error) {
  if (error.message.includes('API key')) {
    // Handle authentication error
  } else if (error.message.includes('quota')) {
    // Handle quota exceeded
  } else {
    // Handle other errors
  }
}
```

### Image Management

The React component includes built-in features for:
- Downloading generated images
- Copying image URLs to clipboard
- Sharing images (where supported)
- Viewing generation metadata

## MCP Integration Benefits

### Development Workflow
- Generate images directly from development tools
- Automate image generation in CI/CD pipelines
- Integrate with design workflows

### Claude Desktop Integration
- Natural language image generation commands
- Contextual image creation during conversations
- Automated design asset generation

### Cursor IDE Integration
- Generate images directly in the editor
- Create placeholder images for development
- Design asset creation workflow

## Best Practices

### Prompt Engineering

#### For Google Gemini (nano-banana):
- Focus on detailed descriptions
- Use natural language for editing instructions
- Leverage character consistency features
- Specify style and mood clearly

#### For OpenAI GPT-image-1:
- Be specific about composition and elements
- Include lighting and camera angle details
- Specify text elements if needed
- Use clear, descriptive language

#### For Replicate:
- Experiment with different models for specific styles
- Adjust guidance scale for creativity vs. adherence
- Use appropriate step counts for quality vs. speed
- Consider model-specific parameters

### Performance Optimization

1. **Caching**: Implement image caching for repeated requests
2. **Compression**: Optimize images for web delivery
3. **Lazy Loading**: Load images as needed in the UI
4. **Error Recovery**: Implement fallback mechanisms

### Security Considerations

1. **API Key Protection**: Never expose API keys in client-side code
2. **Rate Limiting**: Implement client-side rate limiting
3. **Content Filtering**: Add content moderation for user-generated prompts
4. **CORS Configuration**: Properly configure cross-origin requests

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify API keys are correctly configured
   - Check API key permissions and quotas
   - Ensure environment variables are loaded

2. **Generation Failures**
   - Check prompt length and content
   - Verify network connectivity
   - Review provider-specific limitations

3. **MCP Connection Issues**
   - Restart MCP servers
   - Check MCP configuration syntax
   - Verify server availability

### Debug Mode

Enable debug logging in development:

```javascript
const service = new ImageGenerationService();
service.debug = true; // Enables console logging
```

## Monitoring and Analytics

Consider implementing:
- Generation success/failure rates
- Provider performance comparison
- User engagement metrics
- Cost tracking per provider

## Future Enhancements

Planned features:
- Batch image generation
- Style consistency across generations
- Advanced editing capabilities
- Custom model fine-tuning
- Real-time collaboration features

## Support and Resources

- [Google Gemini Documentation](https://ai.google.dev/gemini-api/docs/image-generation)
- [OpenAI GPT-image-1 Guide](https://platform.openai.com/docs/models/gpt-image-1)
- [Replicate API Documentation](https://replicate.com/docs)
- [MCP Specification](https://modelcontextprotocol.io)

For issues and support, please refer to the respective provider documentation or contact the development team.