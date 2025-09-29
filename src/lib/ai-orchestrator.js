/**
 * AI Media Generation Orchestrator
 * Comprehensive service for managing all AI generation across platforms
 *
 * IMPORTANT: This system NEVER uses DALL-E 3 per project requirements.
 * Approved models only: GPT-Image-1, Gemini 2.5 Flash Image, Replicate models
 */

import Replicate from 'replicate';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabaseMediaStorage } from './supabase-media-storage.js';

class AIMediaOrchestrator {
  constructor() {
    this.replicate = new Replicate({
      auth: import.meta.env.VITE_REPLICATE_API_TOKEN,
    });

    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    this.gemini = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

    // Default model configurations (browser-optimized)
    this.defaultModels = {
      image_generation: {
        primary: "gpt-image-1",                          // OpenAI GPT Image (latest)
        secondary: "gemini-2.5-flash-image",             // Google Gemini fallback
        budget: "gemini-2.5-flash-image",                // Google for budget option
        editing: "gpt-image-1",                          // OpenAI for editing
        specialized: {
          inpainting: "gpt-image-1",
          structural: "gpt-image-1",
          depth_guided: "gpt-image-1",
          image_conditioned: "gpt-image-1",
          text_rendering: "gpt-image-1",
          professional_creative: "gpt-image-1"
        }
      },
      video_generation: {
        primary: "google/veo-2",                          // Google via Replicate/API
        secondary: "kling-ai/kling-v2-1",                // Replicate
        budget: "veo-3-fast",                            // Google
        physics_focused: "hailuo/hailuo-2",              // Replicate
        audio_video: "wan-s2v"                           // Replicate
      },
      audio_generation: {
        primary: "elevenlabs/chatterbox",                 // ElevenLabs via Replicate
        conversational: "openai/realtime-api",           // OpenAI
        voice_cloning: "elevenlabs/instant-voice-clone", // ElevenLabs
        multilingual: "resemble-ai/multilingual-tts",    // Resemble AI
        dialogue: "minimax/speech-02-hd",                // Replicate
        multi_speaker: "dia-tts"                         // Replicate
      }
    };

    // Brand consistency settings
    this.brandConfig = {
      colorPalette: {
        primary: ["#1e3a8a", "#3730a3", "#7c3aed", "#8b5cf6"],
        accent: ["#06b6d4", "#0891b2", "#0e7490"],
        neutral: ["#f8fafc", "#e2e8f0", "#64748b", "#334155"]
      },
      designPrinciples: {
        style: "Professional, modern, technology-focused",
        aesthetic: "Clean minimal design with sophisticated gradients",
        typography: "Clear, readable, corporate-friendly",
        imagery: "High-tech, AI-forward, business-professional"
      }
    };
  }

  /**
   * Intelligent model selection based on context and requirements
   */
  selectOptimalModel(type, context = {}) {
    const {
      quality = 'standard',
      budget = 'medium',
      specialization = null,
    } = context;

    switch (type) {
      case 'image':
        if (specialization) {
          return this.defaultModels.image_generation.specialized[specialization] ||
                 this.defaultModels.image_generation.secondary;
        }
        if (budget === 'low') return this.defaultModels.image_generation.budget;
        if (quality === 'premium') return this.defaultModels.image_generation.primary;
        return this.defaultModels.image_generation.secondary;

      case 'video':
        if (budget === 'low') return this.defaultModels.video_generation.budget;
        if (specialization === 'physics') return this.defaultModels.video_generation.physics_focused;
        if (specialization === 'audio') return this.defaultModels.video_generation.audio_video;
        return this.defaultModels.video_generation.primary;

      case 'audio':
        if (specialization === 'conversation') return this.defaultModels.audio_generation.conversational;
        if (specialization === 'cloning') return this.defaultModels.audio_generation.voice_cloning;
        if (specialization === 'multilingual') return this.defaultModels.audio_generation.multilingual;
        return this.defaultModels.audio_generation.primary;

      default:
        throw new Error(`Unknown generation type: ${type}`);
    }
  }

  /**
   * Generate brand-consistent prompts
   */
  enhancePrompt(basePrompt, type) {
    let enhancedPrompt = basePrompt;

    // Add brand consistency elements
    const brandElements = [
      "professional corporate design",
      "modern technology aesthetic",
      "clean minimal design",
      "sophisticated blue and purple gradients",
      "business-appropriate",
      "high-quality commercial photography style"
    ];

    // Add quality enhancers
    const qualityEnhancers = [
      "high resolution",
      "professional photography",
      "commercial quality",
      "award-winning design",
      "sharp details",
      "optimal lighting",
      "perfect composition"
    ];

    // Add negative prompts
    const negativePrompts = [
      "low quality",
      "blurry",
      "unprofessional",
      "childish",
      "cartoon",
      "amateur"
    ];

    if (type === 'image') {
      enhancedPrompt += `, ${brandElements.join(', ')}, ${qualityEnhancers.join(', ')}`;
      enhancedPrompt += `. Avoid: ${negativePrompts.join(', ')}`;
    }

    return enhancedPrompt;
  }

  /**
   * Generate image using optimal model
   */
  async generateImage(prompt, options = {}) {
    const context = {
      quality: options.quality || 'standard',
      budget: options.budget || 'medium',
      specialization: options.specialization,
      width: options.width || 1024,
      height: options.height || 1024
    };

    const model = this.selectOptimalModel('image', context);
    const enhancedPrompt = this.enhancePrompt(prompt, 'image', context);

    try {
      let result;
      if (model === 'gpt-image-1') {
        result = await this.generateWithOpenAI(enhancedPrompt, options);
      } else if (model === 'gemini-2.5-flash-image') {
        result = await this.generateWithGemini(enhancedPrompt, options);
      } else {
        // For browser deployment, always use OpenAI or Gemini to avoid CORS issues
        console.warn(`Model ${model} not available in browser, using OpenAI fallback`);
        result = await this.generateWithOpenAI(enhancedPrompt, options);
      }

      // Store in Supabase with Cloudinary upload
      try {
        const storedMedia = await supabaseMediaStorage.storeGeneratedMedia(
          {
            type: 'image',
            prompt: prompt,
            options: options,
            context: options.context || 'manual_generation'
          },
          result
        );

        // Return result with Supabase metadata
        return {
          ...result,
          id: storedMedia.id,
          stored_url: storedMedia.url,
          cloudinary_public_id: storedMedia.cloudinary_public_id
        };
      } catch (storageError) {
        console.error('Failed to store media, returning original result:', storageError);
        return result;
      }

    } catch (error) {
      console.error(`Failed to generate with ${model}, trying fallback:`, error);
      // If original was Replicate and failed due to CORS, use OpenAI instead
      if (error.message && error.message.includes('Browser-based Replicate generation not supported')) {
        const fallbackResult = await this.generateWithOpenAI(enhancedPrompt, options);
        return fallbackResult;
      }
      // Fallback to secondary model (but avoid Replicate in browser)
      const fallbackResult = await this.generateWithOpenAI(enhancedPrompt, options);

      // Try to store fallback result too
      try {
        const storedMedia = await supabaseMediaStorage.storeGeneratedMedia(
          {
            type: 'image',
            prompt: prompt,
            options: options,
            context: options.context || 'fallback_generation'
          },
          fallbackResult
        );

        return {
          ...fallbackResult,
          id: storedMedia.id,
          stored_url: storedMedia.url,
          cloudinary_public_id: storedMedia.cloudinary_public_id
        };
      } catch (storageError) {
        console.error('Fallback storage failed:', storageError);
        return fallbackResult;
      }
    }
  }

  /**
   * Generate video using optimal model
   */
  async generateVideo(prompt, options = {}) {
    const context = {
      quality: options.quality || 'standard',
      budget: options.budget || 'medium',
      specialization: options.specialization,
      duration: options.duration || 8,
      resolution: options.resolution || '720p'
    };

    const model = this.selectOptimalModel('video', context);
    const enhancedPrompt = this.enhancePrompt(prompt, 'video', context);

    try {
      if (model.includes('veo')) {
        return await this.generateVideoWithVeo(enhancedPrompt, options);
      } else {
        return await this.generateWithReplicate(model, enhancedPrompt, options);
      }
    } catch (error) {
      console.error(`Failed to generate video with ${model}, trying fallback:`, error);
      const fallbackModel = this.defaultModels.video_generation.secondary;
      return await this.generateWithReplicate(fallbackModel, enhancedPrompt, options);
    }
  }

  /**
   * Generate audio using optimal model
   */
  async generateAudio(prompt, options = {}) {
    const context = {
      quality: options.quality || 'standard',
      budget: options.budget || 'medium',
      specialization: options.specialization,
      voice: options.voice || 'professional',
      language: options.language || 'en'
    };

    const model = this.selectOptimalModel('audio', context);

    try {
      if (model === 'openai/realtime-api') {
        return await this.generateAudioWithOpenAI(prompt, options);
      } else {
        return await this.generateWithReplicate(model, prompt, options);
      }
    } catch (error) {
      console.error(`Failed to generate audio with ${model}, trying fallback:`, error);
      const fallbackModel = this.defaultModels.audio_generation.primary;
      return await this.generateWithReplicate(fallbackModel, prompt, options);
    }
  }

  /**
   * OpenAI Image Generation
   * NOTE: Uses only GPT-Image-1, NEVER DALL-E 3 per project requirements
   */
  async generateWithOpenAI(prompt, options = {}) {
    // CRITICAL: Only use GPT-Image-1, never DALL-E 3
    const approvedModel = "gpt-image-1";

    const response = await this.openai.images.generate({
      model: approvedModel,
      prompt: prompt,
      n: 1,
      size: `${options.width || 1024}x${options.height || 1024}`,
      quality: options.quality === 'premium' ? 'high' : 'medium',
      response_format: 'b64_json'
    });

    return {
      url: `data:image/png;base64,${response.data[0].b64_json}`,
      provider: 'openai',
      model: approvedModel,
      cost: this.calculateCost('openai', 'image', options),
      metadata: {
        prompt: prompt,
        size: `${options.width || 1024}x${options.height || 1024}`,
        quality: options.quality,
        note: 'Generated with GPT-Image-1 (DALL-E 3 explicitly excluded)'
      }
    };
  }

  /**
   * Gemini (Nano Banana) Image Generation
   */
  async generateWithGemini(prompt, options = {}) {
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-2.5-flash-image-preview'
    });

    const result = await model.generateContent([prompt]);
    const response = await result.response;

    return {
      url: response.text(), // This would be handled differently in real implementation
      provider: 'google',
      model: 'gemini-2.5-flash-image',
      cost: this.calculateCost('google', 'image', options),
      metadata: {
        prompt: prompt,
        capabilities: ['editing', 'composition', 'character_consistency']
      }
    };
  }

  /**
   * Replicate Generation (Images, Videos, Audio)
   */
  async generateWithReplicate(model, prompt, options = {}) {
    try {
      const input = this.buildReplicateInput(model, prompt, options);

      const output = await this.replicate.run(model, { input });

      return {
        url: Array.isArray(output) ? output[0] : output,
        provider: 'replicate',
        model: model,
        cost: this.calculateCost('replicate', this.getMediaType(model), options),
        metadata: {
          prompt: prompt,
          input: input
        }
      };
    } catch (error) {
      // Handle CORS errors for browser-based usage
      if (error.message && error.message.includes('Failed to fetch')) {
        console.warn('Replicate API not available in browser due to CORS policy. Use server-side proxy for production.');
        throw new Error('Browser-based Replicate generation not supported. Please use OpenAI or Gemini models.');
      }
      throw error;
    }
  }

  /**
   * Veo Video Generation
   */
  async generateVideoWithVeo(prompt, options = {}) {
    // This would use Google's Vertex AI or Gemini API for Veo
    // Implementation depends on the specific API endpoint

    return {
      url: 'veo-generated-video-url',
      provider: 'google',
      model: 'veo-2',
      cost: this.calculateCost('google', 'video', options),
      metadata: {
        prompt: prompt,
        duration: options.duration || 8,
        resolution: options.resolution || '720p'
      }
    };
  }

  /**
   * OpenAI Audio Generation
   */
  async generateAudioWithOpenAI(prompt, options = {}) {
    // Implementation for OpenAI Realtime API
    return {
      url: 'openai-audio-url',
      provider: 'openai',
      model: 'realtime-api',
      cost: this.calculateCost('openai', 'audio', options),
      metadata: {
        prompt: prompt,
        voice: options.voice,
        language: options.language
      }
    };
  }

  /**
   * Build Replicate input based on model type
   */
  buildReplicateInput(model, prompt, options) {
    const baseInput = { prompt };

    if (model.includes('flux') || model.includes('sdxl')) {
      return {
        ...baseInput,
        width: options.width || 1024,
        height: options.height || 1024,
        num_inference_steps: options.steps || 50,
        guidance_scale: options.guidance || 7.5
      };
    }

    if (model.includes('veo') || model.includes('kling') || model.includes('hailuo')) {
      return {
        ...baseInput,
        duration: options.duration || 8,
        resolution: options.resolution || '720p'
      };
    }

    if (model.includes('elevenlabs') || model.includes('speech')) {
      return {
        ...baseInput,
        voice: options.voice || 'professional',
        language: options.language || 'en'
      };
    }

    return baseInput;
  }

  /**
   * Determine media type from model name
   */
  getMediaType(model) {
    if (model.includes('flux') || model.includes('sdxl') || model.includes('imagen')) {
      return 'image';
    }
    if (model.includes('veo') || model.includes('kling') || model.includes('hailuo')) {
      return 'video';
    }
    if (model.includes('speech') || model.includes('elevenlabs') || model.includes('tts')) {
      return 'audio';
    }
    return 'unknown';
  }

  /**
   * Calculate estimated cost
   */
  calculateCost(provider, type, options = {}) {
    const costs = {
      openai: {
        image: options.quality === 'premium' ? 0.08 : 0.04,
        audio: 0.001 // per token estimate
      },
      google: {
        image: 0.039,
        video: options.duration ? options.duration * 0.35 : 2.8, // $0.35/sec
        audio: 0.002
      },
      replicate: {
        image: 0.004, // per second estimate
        video: 0.1,   // per second estimate
        audio: 0.002  // per second estimate
      }
    };

    return costs[provider]?.[type] || 0.01;
  }

  /**
   * Batch generation for multiple assets
   */
  async generateBatch(requests) {
    const results = await Promise.allSettled(
      requests.map(async (request) => {
        const { type, prompt, options } = request;

        switch (type) {
          case 'image':
            return await this.generateImage(prompt, options);
          case 'video':
            return await this.generateVideo(prompt, options);
          case 'audio':
            return await this.generateAudio(prompt, options);
          default:
            throw new Error(`Unknown generation type: ${type}`);
        }
      })
    );

    return results.map((result, index) => ({
      request: requests[index],
      success: result.status === 'fulfilled',
      result: result.status === 'fulfilled' ? result.value : null,
      error: result.status === 'rejected' ? result.reason : null
    }));
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    // This would track actual usage metrics
    return {
      totalGenerations: 0,
      successRate: 100,
      averageCost: 0.05,
      averageLatency: 15000,
      preferredModels: {
        image: this.defaultModels.image_generation.primary,
        video: this.defaultModels.video_generation.primary,
        audio: this.defaultModels.audio_generation.primary
      }
    };
  }
}

// Export singleton instance
export const aiOrchestrator = new AIMediaOrchestrator();
export default AIMediaOrchestrator;