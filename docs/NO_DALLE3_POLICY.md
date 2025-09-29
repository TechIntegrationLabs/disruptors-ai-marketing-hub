# 🚫 NO DALL-E 3 POLICY

## CRITICAL PROJECT RULE

**DALL-E 3 IS ABSOLUTELY FORBIDDEN IN THIS PROJECT**

This is a strict project requirement with **ZERO EXCEPTIONS**.

## Enforcement

### Code Level Protection
- ✅ AI Orchestrator has explicit DALL-E 3 blocking
- ✅ All OpenAI image generation methods throw errors
- ✅ Fallback systems use Gemini/Replicate only
- ✅ Model selection never includes DALL-E variants

### Approved Image Generation Models

#### Primary: OpenAI gpt-image-1
- **Model ID**: `gpt-image-1`
- **Features**:
  - Natively multimodal (images + text in single model)
  - Streaming support for progressive generation
  - C2PA metadata for content authenticity
  - Input fidelity control (use "high" for logos/faces)
- **Sizes**: 1024x1024, 1536x1024, 1024x1536
- **Pricing**: $0.02 - $0.19 per image (depending on size and fidelity)
- **SDK**: OpenAI official SDK
- **Documentation**: https://platform.openai.com/docs/guides/images

#### Secondary: Google Gemini 2.5 Flash Image (Nano Banana)
- **Model ID**: `gemini-2.5-flash-image-preview`
- **Features**:
  - Image generation and editing
  - Multi-image composition (up to 3 images recommended)
  - Character consistency across generations
  - High-quality text rendering
  - SynthID invisible watermarking (automatic)
  - Conversational refinement for iterative improvements
- **Pricing**: $0.039 per image (fixed)
- **SDK**: @google/genai v1.21.0+ (new unified SDK)
- **Documentation**: https://ai.google.dev/gemini-api/docs/image-generation

#### Tertiary: Replicate Flux Models
- **Model ID**: `black-forest-labs/flux-1.1-pro`
- **Features**: High-quality creative image generation
- **Platform**: Replicate API
- **Use Case**: Specialized creative workflows

### Blocked Models
- ❌ `dall-e-3`
- ❌ `dall-e-2`
- ❌ Any OpenAI image generation models
- ❌ Any model containing "dall-e" or "DALL-E"

## Implementation Rules

### For Developers
1. **USE** OpenAI gpt-image-1 as primary image generation model
2. **USE** Google gemini-2.5-flash-image-preview (Nano Banana) as secondary
3. **FALLBACK** to Replicate Flux models for specialized use cases
4. **VALIDATE** all image generation calls against APPROVED_IMAGE_MODELS constants
5. **NEVER** use DALL-E models - runtime validation will throw errors
6. **IMPORT** approved helpers: `src/lib/openai-image.js`, `src/lib/gemini-image.js`

### For AI Agents
1. **REFUSE** any requests to use DALL-E 3
2. **REDIRECT** to approved models (Gemini/Replicate)
3. **THROW ERRORS** if DALL-E is accidentally referenced
4. **VALIDATE** model names before API calls

## Error Messages

When DALL-E 3 usage is attempted:
```
DALL-E 3 usage is ABSOLUTELY FORBIDDEN! Use approved models only.
```

## Code Examples

### OpenAI gpt-image-1 (Recommended)
```javascript
import { openaiGenerate } from './src/lib/openai-image.js';

const buffer = await openaiGenerate({
  prompt: "A professional tech workspace",
  size: "1024x1024",
  quality: "standard",
  inputFidelity: "high" // Use for logos/faces
});
```

### Google Gemini 2.5 Flash Image (Nano Banana)
```javascript
import { geminiGenerate } from './src/lib/gemini-image.js';

const buffer = await geminiGenerate({
  prompt: "A professional tech workspace"
});
// Includes SynthID watermark automatically
```

### Using AI Orchestrator (Automatic Selection)
```javascript
import { aiOrchestrator } from './src/lib/ai-orchestrator.js';

const result = await aiOrchestrator.generateImage(
  "A professional tech workspace",
  { quality: "standard", provider: "openai" }
);
```

## Compliance Verification

Run these commands to verify compliance:
```bash
npm run validate:image-apis  # Should show only approved models
npm run lint                 # Should pass without DALL-E references
```

## Consequences of Violation

- ❌ Code will throw runtime errors
- ❌ Build/deployment may fail
- ❌ Project requirements violated
- ❌ Must be immediately fixed

## Summary

**USE ONLY**: Gemini 2.5 Flash Image & Replicate Flux
**NEVER USE**: DALL-E 3 or any OpenAI image models

*This policy is non-negotiable and enforced at the code level.*