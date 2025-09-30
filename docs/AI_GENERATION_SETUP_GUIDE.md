# AI Generation Setup Guide

This guide provides step-by-step instructions for setting up all AI generation capabilities in your project, including OpenAI GPT-Image-1, Google Nano Banana, Veo video generation, and comprehensive Replicate integration.

## 🚀 Quick Start

### 1. Install Required Dependencies

```bash
npm install replicate openai @google/generative-ai @anthropic-ai/sdk
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure your API keys:

```bash
cp .env.example .env
```

Add your API keys to `.env`:

```env
# AI Generation Services
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_REPLICATE_API_TOKEN=your_replicate_api_token_here
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Google Cloud for Vertex AI Veo access
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_CREDENTIALS=your_credentials_json
```

### 3. Get API Keys

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env` as `VITE_OPENAI_API_KEY`

**Models Available:**
- `gpt-image-1` - Latest natively multimodal model (limited access)
- `dall-e-3` - Established image generation model
- Realtime API for conversational audio

#### Google Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` as `VITE_GEMINI_API_KEY`

**Models Available:**
- `gemini-2.5-flash-image` - Nano Banana for image editing/composition
- `imagen-4` - High-quality text-to-image
- `veo-2` and `veo-3` - Video generation (8-second clips)

#### Replicate API Token
1. Visit [Replicate Account](https://replicate.com/account/api-tokens)
2. Create a new API token
3. Add it to your `.env` as `VITE_REPLICATE_API_TOKEN`

**100+ Models Available including:**
- FLUX models (FLUX-1.1-pro, FLUX-Fill, FLUX-Canny, FLUX-Depth, FLUX-Redux)
- SDXL for high-resolution image generation
- Kling v2.1 and Hailuo 2 for video generation
- ElevenLabs integration for voice synthesis

#### ElevenLabs API Key
1. Visit [ElevenLabs Settings](https://elevenlabs.io/app/settings/api-keys)
2. Create a new API key
3. Add it to your `.env` as `VITE_ELEVENLABS_API_KEY`

**Features Available:**
- Voice cloning from short audio samples
- 23-language text-to-speech
- Emotion control and expression
- Low latency (<400ms) synthesis

#### Anthropic Claude API Key
1. Visit [Anthropic Console](https://console.anthropic.com/settings/keys)
2. Create a new API key
3. Add it to your `.env` as `VITE_ANTHROPIC_API_KEY`

**Models Available:**
- `claude-sonnet-4-5` - Best for agents, coding, and computer use (September 2025)
- `claude-opus-4-1` - State-of-the-art performance for complex tasks
- `claude-haiku` - Fast, efficient responses for simpler tasks

**Features Available:**
- Advanced text generation and writing assistance
- Long-context processing (200K+ tokens)
- Streaming responses
- Tool use and function calling
- Code execution capabilities
- Up to 90% cost savings with prompt caching

**Pricing:**
- $3-15 per million tokens depending on model and tier
- Input/output token pricing varies by model
- Significant savings available with prompt caching

## 📋 Platform Capabilities Overview

### OpenAI (2025 Latest)

#### GPT-Image-1
- **Status**: Limited access (application required)
- **Pricing**: $0.02-$0.19 per image (quality-based)
- **Features**:
  - Streaming responses for faster feedback
  - C2PA metadata for authenticity
  - Superior text rendering
  - Custom style instructions

#### DALL-E 3
- **Status**: Generally available
- **Pricing**: $0.04-$0.08 per image
- **Sizes**: 1024×1024, 1792×1024, 1024×1792
- **Styles**: Natural, Vivid
- **Quality**: Standard, HD

### Google Gemini

#### Nano Banana (Gemini 2.5 Flash Image)
- **Pricing**: $0.039 per image (1290 tokens)
- **Unique Features**:
  - Advanced image editing and composition
  - Multi-image blending
  - Character consistency across generations
  - Natural language image manipulation

#### Veo Video Generation
- **Veo 2**: $0.35/second (Gemini API) or $0.50/second (Vertex AI)
- **Veo 3 Fast**: $0.05/second (budget option)
- **Veo 3 Premium**: $0.75/second (with audio)
- **Duration**: 8-second maximum clips
- **Quality**: Up to 720p cinema quality

### Replicate (100+ Models)

#### Image Generation
- **FLUX-1.1-pro**: State-of-the-art text-to-image
- **FLUX-Fill**: Inpainting and outpainting
- **FLUX-Canny**: Structural guidance with edge detection
- **FLUX-Depth**: Depth-map guided generation
- **FLUX-Redux**: Image-conditioned generation
- **SDXL**: High-resolution with fine-tuning support

#### Video Generation
- **Kling v2.1**: 5s-10s videos at 720p-1080p
- **Hailuo 2**: Excellent real-world physics simulation
- **Wan-S2V**: Static image + audio to video

#### Audio Generation
- **ElevenLabs Chatterbox**: Premium voice synthesis
- **MiniMax Speech-02 HD**: High-quality TTS
- **Dia TTS**: Dialog voice cloning

### Anthropic Claude

#### Text Generation & Writing
- **Claude Sonnet 4.5**: Best-in-class for agents, coding, reasoning (September 2025)
- **Claude Opus 4.1**: Exceptional performance for complex, long-horizon tasks
- **Claude Haiku**: Fast, efficient responses for simpler tasks

**Key Features:**
- **Long Context**: Process up to 200K+ tokens in a single request
- **Streaming**: Real-time token-by-token response streaming
- **Tool Use**: Function calling and code execution capabilities
- **Prompt Caching**: Up to 90% cost savings on repeated context
- **Vision**: Analyze images and extract information
- **Safety**: Built-in safety guardrails and content filtering

**Use Cases:**
- Content generation and copywriting
- Technical documentation and code generation
- Complex reasoning and analysis
- Long-form writing and editing
- Research summarization and synthesis
- Interactive chatbots and assistants

**Pricing (Sonnet 4.5):**
- Input: $3 per million tokens
- Output: $15 per million tokens
- Prompt caching: 90% reduction on cached tokens

## 🛠️ Usage Examples

### Basic Image Generation

```javascript
import { aiOrchestrator } from '@/lib/ai-orchestrator';

// Generate with automatic model selection
const result = await aiOrchestrator.generateImage(
  "Professional corporate headshot of a confident business executive",
  {
    quality: 'premium',
    width: 1200,
    height: 800,
    budget: 'high'
  }
);

console.log(result.url); // Generated image URL
console.log(result.provider); // Which service was used
console.log(result.cost); // Generation cost
```

### Video Generation

```javascript
// Generate professional business video
const video = await aiOrchestrator.generateVideo(
  "Professional business presentation with animated charts and graphs",
  {
    duration: 8,
    resolution: '1080p',
    quality: 'premium'
  }
);
```

### Audio Generation

```javascript
// Generate professional voiceover
const audio = await aiOrchestrator.generateAudio(
  "Welcome to Disruptors AI Marketing Hub, where innovation meets results",
  {
    voice: 'professional',
    language: 'en',
    specialization: 'conversation'
  }
);
```

### Text Generation with Claude

```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side usage
});

// Generate blog post content
const message = await anthropic.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Write a compelling 500-word blog post about the future of AI in marketing"
  }]
});

console.log(message.content[0].text);

// Streaming response for real-time feedback
const stream = await anthropic.messages.stream({
  model: "claude-sonnet-4-5",
  max_tokens: 4096,
  messages: [{
    role: "user",
    content: "Generate a marketing email for our new AI automation service"
  }]
});

for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    process.stdout.write(chunk.delta.text);
  }
}
```

### Batch Generation

```javascript
// Generate multiple assets simultaneously
const requests = [
  {
    type: 'image',
    prompt: 'Hero image for AI automation service',
    options: { width: 1200, height: 600 }
  },
  {
    type: 'image',
    prompt: 'Icon for social media marketing service',
    options: { width: 640, height: 360 }
  },
  {
    type: 'video',
    prompt: 'Short promotional video for lead generation',
    options: { duration: 5, resolution: '720p' }
  }
];

const results = await aiOrchestrator.generateBatch(requests);
```

## 🎯 Model Selection Strategy

The AI Orchestrator automatically selects the best model based on your requirements:

### For High-Quality Business Content
- **Images**: GPT-Image-1 → FLUX-1.1-pro → DALL-E 3
- **Videos**: Veo 2 → Kling v2.1 → Hailuo 2
- **Audio**: ElevenLabs → OpenAI Realtime → Resemble AI

### For Budget-Conscious Projects
- **Images**: SDXL → FLUX [schnell] → DALL-E 3 Standard
- **Videos**: Veo 3 Fast → Replicate alternatives
- **Audio**: Open-source models via Replicate

### For Specialized Tasks
- **Image Editing**: Nano Banana (Gemini 2.5 Flash Image)
- **Inpainting**: FLUX-Fill
- **Physics Simulation**: Hailuo 2
- **Voice Cloning**: ElevenLabs
- **Multilingual Audio**: Resemble AI

## 🧪 Testing Your Setup

### Test Image Generation
```bash
# Use the AI Media Generator component
# Navigate to /ai-generator in your app
# Or test programmatically:

node -e "
import('./src/lib/ai-orchestrator.js').then(module => {
  const { aiOrchestrator } = module;
  aiOrchestrator.generateImage('Test image: blue corporate background')
    .then(result => console.log('Success:', result.url))
    .catch(error => console.error('Error:', error));
});
"
```

### Verify API Connections
```javascript
// Check which services are properly configured
const orchestrator = new AIMediaOrchestrator();
const metrics = orchestrator.getPerformanceMetrics();
console.log('Available services:', metrics.preferredModels);
```

## 📊 Cost Optimization

### Budget Management
```javascript
// Set budget limits for different quality levels
const budgetConfig = {
  low: { maxCostPerImage: 0.01, maxCostPerVideo: 0.50 },
  medium: { maxCostPerImage: 0.05, maxCostPerVideo: 2.00 },
  high: { maxCostPerImage: 0.20, maxCostPerVideo: 5.00 }
};

// Generate with budget constraints
const result = await aiOrchestrator.generateImage(prompt, {
  budget: 'low', // Will auto-select cost-effective models
  quality: 'standard'
});
```

### Cost Monitoring
```javascript
// Track generation costs
const metrics = aiOrchestrator.getPerformanceMetrics();
console.log(`Average cost per generation: $${metrics.averageCost}`);
console.log(`Total generations: ${metrics.totalGenerations}`);
console.log(`Success rate: ${metrics.successRate}%`);
```

## 🔧 Component Integration

### Using the AI Media Generator Component

```jsx
import AIMediaGenerator from '@/components/shared/AIMediaGenerator';

function MyPage() {
  return (
    <div>
      <h1>Create Content</h1>
      <AIMediaGenerator />
    </div>
  );
}
```

### Custom Integration

```jsx
import { aiOrchestrator } from '@/lib/ai-orchestrator';
import { useState } from 'react';

function CustomGenerator() {
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    const generated = await aiOrchestrator.generateImage(
      "Professional business image",
      { quality: 'premium' }
    );
    setResult(generated);
  };

  return (
    <div>
      <button onClick={handleGenerate}>Generate</button>
      {result && <img src={result.url} alt="Generated" />}
    </div>
  );
}
```

## 🚨 Troubleshooting

### Common Issues

#### "API Key Not Found"
- Verify your `.env` file contains the correct key names
- Ensure keys start with `VITE_` for frontend access
- Restart your development server after adding keys

#### "Model Not Available"
- Check if you have access to premium models like GPT-Image-1
- Try fallback models (DALL-E 3, FLUX, SDXL)
- Verify your API key has sufficient credits

#### "Generation Failed"
- Check your prompt doesn't contain restricted content
- Verify file size limits for your chosen model
- Try reducing quality settings for budget models

#### "CORS Errors"
- Use server-side generation for production
- Configure proper API proxy for client-side usage
- Check API endpoint restrictions

### Performance Optimization

#### Reduce Latency
```javascript
// Use streaming responses where available
const result = await aiOrchestrator.generateImage(prompt, {
  streaming: true, // For supported models
  quality: 'standard' // Faster than premium
});
```

#### Batch Operations
```javascript
// Generate multiple assets efficiently
const results = await aiOrchestrator.generateBatch([
  { type: 'image', prompt: 'Image 1' },
  { type: 'image', prompt: 'Image 2' },
  { type: 'image', prompt: 'Image 3' }
]);
```

## 📈 Advanced Configuration

### Custom Model Preferences

```javascript
// Override default model selection
const customOrchestrator = new AIMediaOrchestrator();
customOrchestrator.defaultModels.image_generation.primary = 'flux-1.1-pro';
customOrchestrator.defaultModels.video_generation.primary = 'kling-v2-1';
```

### Brand Consistency

```javascript
// Customize brand guidelines
customOrchestrator.brandConfig = {
  colorPalette: {
    primary: ['#your-brand-colors'],
    // ... custom colors
  },
  designPrinciples: {
    style: 'Your brand style',
    // ... custom guidelines
  }
};
```

## 🔄 Updates and Maintenance

The AI Orchestrator automatically:
- **Daily**: Checks for new model releases
- **Weekly**: Updates performance benchmarks
- **Monthly**: Optimizes cost and model selection

To manually update model information:
```javascript
await aiOrchestrator.updateModelCatalog();
```

## 📚 Additional Resources

- [Comprehensive AI Models Guide](./AI_MODELS_COMPREHENSIVE_GUIDE.md)
- [AI Media Generation Orchestrator Agent](./agents/ai-media-generation-orchestrator.md)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Gemini API Docs](https://ai.google.dev/gemini-api)
- [Replicate Model Catalog](https://replicate.com/explore)

## 🎉 You're Ready!

Your AI generation setup is now complete with:
- ✅ All major platforms integrated (OpenAI, Google, Replicate, ElevenLabs)
- ✅ Automatic model selection and optimization
- ✅ Cost monitoring and budget management
- ✅ Brand consistency enforcement
- ✅ Professional UI components
- ✅ Comprehensive documentation

Start generating professional-quality images, videos, and audio with a single API call!