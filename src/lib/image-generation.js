/**
 * Image Generation Service
 * Integrates with Google Gemini (nano-banana), OpenAI GPT-image-1, and Replicate API
 */

// API Configuration
const API_ENDPOINTS = {
  gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
  openai: 'https://api.openai.com/v1/images/generations',
  replicate: 'https://api.replicate.com/v1/predictions'
};

class ImageGenerationService {
  constructor() {
    this.apiKeys = {
      gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
      openai: import.meta.env.VITE_OPENAI_API_KEY || '',
      replicate: import.meta.env.VITE_REPLICATE_API_TOKEN || ''
    };
  }

  /**
   * Generate image using Google Gemini (nano-banana)
   * @param {string} prompt - Text description for image generation
   * @param {Object} options - Additional options (size, style, etc.)
   * @returns {Promise<Object>} Generated image data
   */
  async generateWithGemini(prompt, options = {}) {
    try {
      const response = await fetch(`${API_ENDPOINTS.gemini}?key=${this.apiKeys.gemini}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate an image: ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: 1290
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        provider: 'gemini',
        imageUrl: data.candidates[0]?.content?.parts[0]?.text,
        metadata: {
          model: 'gemini-2.5-flash-image',
          prompt,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Gemini generation error:', error);
      throw error;
    }
  }

  /**
   * Generate image using OpenAI GPT-image-1
   * @param {string} prompt - Text description for image generation
   * @param {Object} options - Additional options (size, quality, etc.)
   * @returns {Promise<Object>} Generated image data
   */
  async generateWithOpenAI(prompt, options = {}) {
    try {
      const response = await fetch(API_ENDPOINTS.openai, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.openai}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt,
          n: options.count || 1,
          size: options.size || '1024x1024',
          quality: options.quality || 'standard',
          response_format: 'url'
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        provider: 'openai',
        imageUrl: data.data[0]?.url,
        metadata: {
          model: 'gpt-image-1',
          prompt,
          size: options.size || '1024x1024',
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('OpenAI generation error:', error);
      throw error;
    }
  }

  /**
   * Generate image using Replicate API
   * @param {string} prompt - Text description for image generation
   * @param {Object} options - Additional options (model, parameters, etc.)
   * @returns {Promise<Object>} Generated image data
   */
  async generateWithReplicate(prompt, options = {}) {
    try {
      const model = options.model || 'black-forest-labs/flux-schnell';

      const response = await fetch(API_ENDPOINTS.replicate, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKeys.replicate}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: options.version || 'latest',
          input: {
            prompt,
            width: options.width || 1024,
            height: options.height || 1024,
            num_outputs: options.count || 1,
            guidance_scale: options.guidance_scale || 7.5,
            num_inference_steps: options.steps || 50
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.statusText}`);
      }

      const prediction = await response.json();

      // Poll for completion
      const result = await this.waitForReplicateCompletion(prediction.id);

      return {
        provider: 'replicate',
        imageUrl: result.output?.[0],
        predictionId: prediction.id,
        metadata: {
          model,
          prompt,
          parameters: options,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Replicate generation error:', error);
      throw error;
    }
  }

  /**
   * Wait for Replicate prediction to complete
   * @param {string} predictionId - Prediction ID to poll
   * @returns {Promise<Object>} Completed prediction result
   */
  async waitForReplicateCompletion(predictionId) {
    const pollInterval = 1000; // 1 second
    const maxWaitTime = 300000; // 5 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const response = await fetch(`${API_ENDPOINTS.replicate}/${predictionId}`, {
        headers: {
          'Authorization': `Token ${this.apiKeys.replicate}`,
        },
      });

      const prediction = await response.json();

      if (prediction.status === 'succeeded') {
        return prediction;
      } else if (prediction.status === 'failed') {
        throw new Error(`Replicate prediction failed: ${prediction.error}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Replicate prediction timed out');
  }

  /**
   * Generate image using all three providers in parallel for comparison
   * @param {string} prompt - Text description for image generation
   * @param {Object} options - Provider-specific options
   * @returns {Promise<Array>} Array of results from all providers
   */
  async generateWithAllProviders(prompt, options = {}) {
    const promises = [
      this.generateWithGemini(prompt, options.gemini),
      this.generateWithOpenAI(prompt, options.openai),
      this.generateWithReplicate(prompt, options.replicate)
    ];

    try {
      const results = await Promise.allSettled(promises);
      return results.map((result, index) => ({
        provider: ['gemini', 'openai', 'replicate'][index],
        success: result.status === 'fulfilled',
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      }));
    } catch (error) {
      console.error('Multi-provider generation error:', error);
      throw error;
    }
  }

  /**
   * Get available models for each provider
   * @returns {Object} Available models by provider
   */
  getAvailableModels() {
    return {
      gemini: [
        {
          id: 'gemini-2.5-flash-image',
          name: 'Gemini 2.5 Flash Image (nano-banana)',
          description: 'Google\'s state-of-the-art image generation and editing model'
        }
      ],
      openai: [
        {
          id: 'gpt-image-1',
          name: 'GPT-image-1',
          description: 'OpenAI\'s latest high-resolution image generation model'
        }
      ],
      replicate: [
        {
          id: 'black-forest-labs/flux-schnell',
          name: 'FLUX Schnell',
          description: 'Fast, high-quality image generation'
        },
        {
          id: 'stability-ai/stable-diffusion-xl-base-1.0',
          name: 'Stable Diffusion XL',
          description: 'High-resolution image generation with excellent prompt adherence'
        }
      ]
    };
  }
}

export default ImageGenerationService;