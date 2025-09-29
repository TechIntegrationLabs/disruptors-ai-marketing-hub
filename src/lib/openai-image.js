/**
 * OpenAI gpt-image-1 Server-Side API Helper
 *
 * CRITICAL: This file uses gpt-image-1 ONLY
 * DALL-E 3 is absolutely forbidden and will cause errors
 *
 * This is a Node.js-only helper - DO NOT expose API keys in browser
 *
 * Features:
 * - Text-to-image generation with gpt-image-1
 * - Image editing with mask support
 * - Input fidelity control for logo/face preservation
 * - C2PA metadata support
 */

import OpenAI from 'openai';
import fs from 'node:fs';

// HARD-PINNED MODEL ID - DO NOT MODIFY
const MODEL_ID = 'gpt-image-1';

// Validate that we're never using DALL-E
const FORBIDDEN_MODELS = ['dall-e-3', 'dall-e-2', 'dall-e'];

/**
 * Validate model ID
 * @private
 */
function validateModel(model) {
  const modelLower = model.toLowerCase();
  for (const forbidden of FORBIDDEN_MODELS) {
    if (modelLower.includes(forbidden)) {
      throw new Error(
        `FORBIDDEN MODEL: "${model}"\n` +
        `Only ${MODEL_ID} is allowed. DALL-E is absolutely forbidden.`
      );
    }
  }
  return true;
}

/**
 * Initialize OpenAI client
 * @private
 */
function getClient() {
  const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not found in environment variables');
  }
  return new OpenAI({ apiKey });
}

/**
 * Generate image with OpenAI gpt-image-1
 *
 * @param {Object} params - Generation parameters
 * @param {string} params.prompt - Image description
 * @param {string} [params.size='1024x1024'] - Image size (1024x1024, 1536x1024, 1024x1536)
 * @param {string} [params.quality='standard'] - Quality level (standard, hd)
 * @param {string} [params.inputFidelity='medium'] - Fidelity level (low, medium, high) - use high for logos/faces
 * @returns {Promise<Buffer>} PNG image as Buffer
 */
export async function openaiGenerate({
  prompt,
  size = '1024x1024',
  quality = 'standard',
  inputFidelity = 'medium'
}) {
  validateModel(MODEL_ID);
  const client = getClient();

  try {
    const response = await client.images.generate({
      model: MODEL_ID,
      prompt,
      size,
      quality,
      input_fidelity: inputFidelity,
      n: 1,
      response_format: 'b64_json' // Get base64 for server-side processing
    });

    const b64 = response.data[0].b64_json;
    if (!b64) {
      throw new Error('No image data returned from OpenAI');
    }

    return Buffer.from(b64, 'base64');
  } catch (error) {
    console.error('OpenAI gpt-image-1 generation error:', error);
    throw error;
  }
}

/**
 * Edit image with OpenAI gpt-image-1
 *
 * @param {Object} params - Edit parameters
 * @param {string} params.prompt - Edit instructions
 * @param {string} params.imagePath - Path to input image file
 * @param {string} [params.maskPath] - Path to mask image (transparent areas = editable)
 * @param {string} [params.size='1024x1024'] - Output size
 * @param {string} [params.inputFidelity='high'] - Use high for faces/logos
 * @returns {Promise<Buffer>} Edited image as Buffer
 */
export async function openaiEdit({
  prompt,
  imagePath,
  maskPath,
  size = '1024x1024',
  inputFidelity = 'high' // Default to high for edits
}) {
  validateModel(MODEL_ID);
  const client = getClient();

  try {
    const requestParams = {
      model: MODEL_ID,
      prompt,
      image: fs.createReadStream(imagePath),
      size,
      input_fidelity: inputFidelity,
      n: 1,
      response_format: 'b64_json'
    };

    // Add mask if provided
    if (maskPath) {
      requestParams.mask = fs.createReadStream(maskPath);
    }

    const response = await client.images.edits(requestParams);

    const b64 = response.data[0].b64_json;
    if (!b64) {
      throw new Error('No image data returned from OpenAI edit');
    }

    return Buffer.from(b64, 'base64');
  } catch (error) {
    console.error('OpenAI gpt-image-1 edit error:', error);
    throw error;
  }
}

/**
 * Get model information
 */
export function getModelInfo() {
  return {
    model: MODEL_ID,
    provider: 'openai',
    capabilities: [
      'text-to-image',
      'image-editing',
      'input-fidelity-control',
      'c2pa-metadata'
    ],
    sizes: ['1024x1024', '1536x1024', '1024x1536'],
    qualities: ['standard', 'hd'],
    inputFidelityLevels: ['low', 'medium', 'high'],
    pricing: {
      '1024x1024': 0.02,
      '1536x1024': 0.03,
      '1024x1536': 0.03,
      'hd_with_high_fidelity': 0.19
    },
    notes: [
      'Use input_fidelity: "high" for logos, faces, or identity preservation',
      'Images include C2PA metadata in many contexts',
      'Streaming support available via API',
      'DALL-E is absolutely forbidden - only gpt-image-1 allowed'
    ]
  };
}

/**
 * Calculate cost for generation
 * @param {Object} params - Generation parameters
 * @returns {number} Estimated cost in USD
 */
export function calculateCost({ size, quality, inputFidelity }) {
  if (inputFidelity === 'high' && quality === 'hd') {
    return 0.19;
  }
  if (size === '1536x1024' || size === '1024x1536') {
    return 0.03;
  }
  return 0.02;
}

// Export model constant for validation
export { MODEL_ID as OPENAI_IMAGE_MODEL };