# Image Generation API Guide

⚠️ **CRITICAL**: DALL-E 3 IS ABSOLUTELY FORBIDDEN IN THIS PROJECT

Comprehensive documentation for implementing Google Gemini and Replicate image generation APIs in the Disruptors AI Marketing Hub.

## Table of Contents

1. [Overview](#overview)
2. [Google Gemini 2.5 Flash Image](#google-gemini-25-flash-image)
3. [Replicate Flux Models](#replicate-flux-models)
4. [Implementation Examples](#implementation-examples)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers the APPROVED image generation models for the Disruptors AI Marketing Hub:

- **Google Gemini 2.5 Flash Image** (Nano Banana) - State-of-the-art image generation and editing
- **Replicate Flux Models** - High-quality creative image generation

🚫 **DALL-E 3 IS COMPLETELY FORBIDDEN AND BLOCKED**

### Key Differences

| Feature | Google Gemini 2.5 Flash Image | Replicate Flux 1.1 Pro |
|---------|------------------------------|-------------------------|
| **Model ID** | `models/gemini-2.5-flash-image-preview` | `flux-1.1-pro` |
| **Resolution** | 1024x1024px | Up to 2048x2048px |
| **Pricing** | $0.039 per image (1290 tokens) | ~$0.004 per second |
| **Editing** | ✅ Advanced editing capabilities | ❌ Generation only |
| **Multi-image** | ✅ Blend multiple images | ❌ Single image generation |
| **Text Rendering** | ✅ High-quality text in images | ✅ Excellent text rendering |
| **Watermarking** | ✅ SynthID invisible watermark | ❌ No watermarking |
| **Batch Generation** | ❌ One at a time | ✅ Batch support |

🚫 **DALL-E 3 REMOVED - ABSOLUTELY FORBIDDEN**

---

## Google Gemini 2.5 Flash Image

### Model Information

- **Model Name**: Gemini 2.5 Flash Image (aka "Nano Banana")
- **Model ID**: `gemini-2.5-flash-image-preview`
- **Release Date**: August 26, 2025
- **Pricing**: $30.00 per 1 million output tokens ($0.039 per image)
- **Token Count**: 1290 tokens per generated image

### Key Features

1. **Text-to-Image Generation**: Create images from natural language descriptions
2. **Image Editing**: Targeted transformations using natural language
3. **Multi-image Composition**: Blend multiple images into a single image
4. **Character Consistency**: Maintain character consistency across generations
5. **Conversational Refinement**: Iteratively improve images through conversation
6. **High-Quality Text**: Excellent text rendering within images
7. **SynthID Watermarking**: All images include invisible digital watermark

### API Access Methods

1. **Google AI Studio**: https://aistudio.google.com/
2. **Gemini API**: For developers
3. **Vertex AI**: For enterprise

### Implementation

#### Python Example

```python
import google.generativeai as genai

# Configure API
genai.configure(api_key="YOUR_GEMINI_API_KEY")

# Initialize model
model = genai.GenerativeModel('gemini-2.5-flash-image-preview')

# Generate image
response = model.generate_content([
    "Create a photorealistic portrait of an elderly ceramicist working at a pottery wheel, golden hour lighting"
])

# Access the generated image
image = response.candidates[0].content.parts[0]
```

#### JavaScript Example

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image-preview" });

async function generateImage(prompt) {
  const result = await model.generateContent([prompt]);
  const response = await result.response;
  return response;
}

// Usage
const imageResponse = await generateImage(
  "Ancient Egyptian hieroglyphs integrated with holographic displays"
);
```

### Advanced Features

#### Image Editing
```python
# Edit existing image
response = model.generate_content([
    input_image,  # PIL Image or file path
    "Remove the person from this photo and blur the background"
])
```

#### Multi-image Composition
```python
# Blend multiple images
response = model.generate_content([
    image1,
    image2,
    "Combine these two images into a single artistic composition"
])
```

### Best Practices

1. **Be Hyper-Specific**: Provide detailed, specific prompts
2. **Use Conversational Refinement**: Iterate to improve results
3. **Provide Context**: Include intent and context in prompts
4. **Step-by-Step for Complex Scenes**: Break complex requests into steps
5. **Limit Input Images**: Use up to 3 input images for best performance

---

## OpenAI DALL-E 3

### Model Information

- **Model Name**: DALL-E 3
- **Model ID**: `dall-e-3`
- **Pricing**: $0.040 (standard) - $0.080 (HD) per image
- **Resolutions**: 1024x1024, 1792x1024, 1024x1792
- **Generation Limit**: 1 image per request

### Key Features

1. **Automatic Prompt Enhancement**: Automatically creates detailed prompts
2. **High-Quality Generation**: Superior creative and artistic capabilities
3. **Style Control**: Vivid or natural style options
4. **Quality Settings**: Standard or HD quality options
5. **Multiple Aspect Ratios**: Square, portrait, and landscape formats

### API Parameters

#### Required Parameters
- `model`: Must be "dall-e-3"
- `prompt`: Text description (max 4000 characters)

#### Optional Parameters
- `size`: "1024x1024" (default), "1792x1024", or "1024x1792"
- `quality`: "standard" (default) or "hd"
- `style`: "vivid" (default) or "natural"
- `response_format`: "url" (default) or "b64_json"
- `n`: Must be 1 for DALL-E 3

### Implementation

#### Python Example

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_OPENAI_API_KEY")

def generate_image(prompt, size="1024x1024", quality="standard", style="vivid"):
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        n=1,
        size=size,
        quality=quality,
        style=style,
        response_format="url"
    )

    return {
        'url': response.data[0].url,
        'revised_prompt': response.data[0].revised_prompt
    }

# Usage
result = generate_image(
    "Renaissance paintings featuring AI neural networks",
    size="1024x1024",
    quality="hd",
    style="natural"
)
```

#### JavaScript Example

```javascript
async function generateImage(prompt, options = {}) {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'dall-e-3',
            prompt: prompt,
            size: options.size || '1024x1024',
            quality: options.quality || 'standard',
            style: options.style || 'vivid',
            n: 1
        })
    });

    const data = await response.json();
    return data;
}

// Usage
const result = await generateImage(
    "Ancient Greek sculptures with cybernetic enhancements",
    { quality: "hd", style: "natural" }
);
```

### Quality and Style Options

#### Quality Settings
- **Standard**: Faster generation, lower cost, good quality
- **HD**: Higher detail, increased cost and latency, premium quality

#### Style Options
- **Vivid**: Hyper-real, dramatic images with enhanced colors
- **Natural**: More natural, subdued aesthetic

---

## Implementation Examples

### Unified Image Generation Service

```javascript
// src/lib/image-generation-service.js

class ImageGenerationService {
    constructor() {
        this.openaiClient = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_API_KEY
        });
        this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    }

    async generateWithOpenAI(prompt, options = {}) {
        try {
            const response = await this.openaiClient.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                size: options.size || "1024x1024",
                quality: options.quality || "standard",
                style: options.style || "vivid",
                n: 1
            });

            return {
                success: true,
                provider: 'openai',
                model: 'dall-e-3',
                url: response.data[0].url,
                revisedPrompt: response.data[0].revised_prompt,
                cost: this.calculateOpenAICost(options.quality)
            };
        } catch (error) {
            return {
                success: false,
                provider: 'openai',
                error: error.message
            };
        }
    }

    async generateWithGemini(prompt, options = {}) {
        try {
            const genAI = new GoogleGenerativeAI(this.geminiApiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-flash-image-preview"
            });

            const result = await model.generateContent([prompt]);
            const response = await result.response;

            return {
                success: true,
                provider: 'google',
                model: 'gemini-2.5-flash-image-preview',
                response: response,
                cost: 0.039 // Fixed cost per image
            };
        } catch (error) {
            return {
                success: false,
                provider: 'google',
                error: error.message
            };
        }
    }

    calculateOpenAICost(quality) {
        return quality === 'hd' ? 0.080 : 0.040;
    }

    async generateWithBothProviders(prompt, options = {}) {
        const [openaiResult, geminiResult] = await Promise.allSettled([
            this.generateWithOpenAI(prompt, options),
            this.generateWithGemini(prompt, options)
        ]);

        return {
            openai: openaiResult.value || { success: false, error: openaiResult.reason },
            gemini: geminiResult.value || { success: false, error: geminiResult.reason }
        };
    }
}

export default ImageGenerationService;
```

### React Component Example

```jsx
// src/components/ImageGenerationDemo.jsx

import React, { useState } from 'react';
import ImageGenerationService from '../lib/image-generation-service';

const ImageGenerationDemo = () => {
    const [prompt, setPrompt] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const imageService = new ImageGenerationService();

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const results = await imageService.generateWithBothProviders(prompt, {
                size: '1024x1024',
                quality: 'hd',
                style: 'natural'
            });
            setResults(results);
        } catch (error) {
            console.error('Generation failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">AI Image Generation Comparison</h2>

            <div className="mb-6">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your image prompt here..."
                    className="w-full p-3 border rounded-lg"
                    rows={3}
                />
                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                    {loading ? 'Generating...' : 'Generate Images'}
                </button>
            </div>

            {results && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">OpenAI DALL-E 3</h3>
                        {results.openai.success ? (
                            <div>
                                <img src={results.openai.url} alt="OpenAI Generated" className="w-full rounded-lg" />
                                <p className="mt-2 text-sm text-gray-600">Cost: ${results.openai.cost}</p>
                            </div>
                        ) : (
                            <p className="text-red-600">Error: {results.openai.error}</p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Google Gemini 2.5 Flash Image</h3>
                        {results.gemini.success ? (
                            <div>
                                {/* Render Gemini image response */}
                                <p className="mt-2 text-sm text-gray-600">Cost: ${results.gemini.cost}</p>
                            </div>
                        ) : (
                            <p className="text-red-600">Error: {results.gemini.error}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageGenerationDemo;
```

---

## Best Practices

### Prompt Engineering

#### For Both Providers
1. **Be Specific**: Include detailed descriptions of style, lighting, composition
2. **Use Art Terms**: Reference specific art movements, techniques, or styles
3. **Specify Quality**: Mention resolution, detail level, and visual quality
4. **Include Context**: Provide background information and scene setting

#### Example Prompts

**Basic Prompt:**
```
"A robot"
```

**Optimized Prompt:**
```
"A sleek humanoid robot with polished chrome surfaces and blue LED accents, standing in a modern laboratory with soft ambient lighting, photorealistic style, high detail, 4K quality"
```

### Cost Optimization

1. **Start with Standard Quality**: Use standard quality for testing, HD for final versions
2. **Batch Planning**: Plan multiple variations before generating
3. **Provider Selection**: Use Gemini for editing, OpenAI for creative generation
4. **Iteration Strategy**: Use conversational refinement with Gemini for cost-effective improvements

### Error Handling

```javascript
async function safeImageGeneration(prompt, provider = 'openai') {
    try {
        const result = await generateImage(prompt, provider);
        return result;
    } catch (error) {
        // Fallback to alternative provider
        if (provider === 'openai') {
            console.warn('OpenAI failed, trying Gemini...');
            return await generateImage(prompt, 'gemini');
        } else {
            console.warn('Gemini failed, trying OpenAI...');
            return await generateImage(prompt, 'openai');
        }
    }
}
```

---

## Troubleshooting

### Common Issues

#### Google Gemini

**Quota Exceeded Error**
```
Error: quota exceeded (daily limits)
```
**Solution**:
- Wait for quota reset (24 hours)
- Upgrade to paid tier
- Implement request queuing

**Authentication Error**
```
Error: API key not valid
```
**Solution**:
- Verify API key in environment variables
- Check API key permissions
- Regenerate API key if necessary

#### OpenAI DALL-E 3

**Rate Limit Error**
```
Error: Rate limit exceeded
```
**Solution**:
- Implement exponential backoff
- Add request queuing
- Monitor rate limits

**Content Policy Violation**
```
Error: Your request was rejected due to our safety system
```
**Solution**:
- Review and modify prompt
- Remove potentially sensitive content
- Use more general descriptions

### Environment Setup

Ensure these environment variables are configured:

```bash
# .env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Testing Setup

```javascript
// Test API connectivity
async function testAPIs() {
    const testPrompt = "A simple red circle on white background";

    const openaiTest = await generateWithOpenAI(testPrompt);
    const geminiTest = await generateWithGemini(testPrompt);

    console.log('OpenAI Status:', openaiTest.success ? 'OK' : 'Failed');
    console.log('Gemini Status:', geminiTest.success ? 'OK' : 'Failed');
}
```

---

## Integration with Disruptors AI

### Brand Consistency

When generating images for Disruptors AI, include these brand elements:

```javascript
const brandPromptSuffix = `
Brand colors: deep blue (#1e3a8a), purple (#3730a3), cyan (#0ea5e9), teal (#06b6d4).
Professional, modern, technology-focused aesthetic.
Clean, minimalist composition with premium feel.
`;

const generateBrandedImage = (basePrompt) => {
    return `${basePrompt}. ${brandPromptSuffix}`;
};
```

### File Organization

Store generated images in the project structure:

```
public/images/ai-generated/
├── openai/
│   ├── concept-art/
│   ├── marketing/
│   └── hero-images/
└── gemini/
    ├── edited/
    ├── compositions/
    └── variations/
```

### Performance Optimization

1. **Image Optimization**: Use Cloudinary for automatic optimization
2. **Caching**: Implement response caching for repeated prompts
3. **Lazy Loading**: Load images only when needed
4. **Progressive Enhancement**: Show placeholders during generation

---

*Last Updated: September 29, 2025*
*For questions or issues, refer to the MCP orchestration system or contact the development team.*