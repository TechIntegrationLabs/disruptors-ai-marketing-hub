#!/usr/bin/env node

/**
 * Image Generation API Test Script
 * Tests both OpenAI DALL-E 3 and Google Gemini 2.5 Flash Image APIs
 */

import { config } from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Load environment variables
config();

class ImageGenerationTester {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY
    });

    this.gemini = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

    this.testPrompt = "Ancient Egyptian hieroglyphs integrated with holographic displays, professional technology aesthetic, modern corporate design";
    this.outputDir = path.join(process.cwd(), 'generated', 'api-tests');

    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Test OpenAI DALL-E 3 API
   */
  async testOpenAI() {
    console.log('🎨 Testing OpenAI DALL-E 3...');

    try {
      const startTime = Date.now();

      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: this.testPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid",
        response_format: "url"
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      const result = {
        success: true,
        provider: 'OpenAI',
        model: 'dall-e-3',
        duration: `${duration}ms`,
        cost: '$0.04',
        url: response.data[0].url,
        revisedPrompt: response.data[0].revised_prompt,
        features: {
          autoPromptEnhancement: true,
          multipleResolutions: true,
          qualityOptions: ['standard', 'hd'],
          styleOptions: ['vivid', 'natural'],
          editing: false
        }
      };

      console.log('✅ OpenAI DALL-E 3 - SUCCESS');
      console.log(`   Duration: ${duration}ms`);
      console.log(`   Cost: $0.04`);
      console.log(`   URL: ${response.data[0].url}`);
      console.log(`   Revised Prompt: ${response.data[0].revised_prompt.substring(0, 100)}...`);

      return result;

    } catch (error) {
      console.error('❌ OpenAI DALL-E 3 - FAILED');
      console.error(`   Error: ${error.message}`);

      return {
        success: false,
        provider: 'OpenAI',
        model: 'dall-e-3',
        error: error.message,
        troubleshooting: this.getOpenAITroubleshooting(error)
      };
    }
  }

  /**
   * Test Google Gemini 2.5 Flash Image API
   */
  async testGemini() {
    console.log('🎨 Testing Google Gemini 2.5 Flash Image...');

    try {
      const startTime = Date.now();

      const model = this.gemini.getGenerativeModel({
        model: "gemini-2.5-flash-image-preview"
      });

      const result = await model.generateContent([this.testPrompt]);
      const response = await result.response;

      const endTime = Date.now();
      const duration = endTime - startTime;

      const resultData = {
        success: true,
        provider: 'Google',
        model: 'gemini-2.5-flash-image-preview',
        duration: `${duration}ms`,
        cost: '$0.039',
        response: response,
        features: {
          imageEditing: true,
          multiImageComposition: true,
          characterConsistency: true,
          conversationalRefinement: true,
          textRendering: true,
          synthIdWatermark: true
        }
      };

      console.log('✅ Google Gemini 2.5 Flash Image - SUCCESS');
      console.log(`   Duration: ${duration}ms`);
      console.log(`   Cost: $0.039`);
      console.log(`   Response type: ${typeof response}`);

      return resultData;

    } catch (error) {
      console.error('❌ Google Gemini 2.5 Flash Image - FAILED');
      console.error(`   Error: ${error.message}`);

      return {
        success: false,
        provider: 'Google',
        model: 'gemini-2.5-flash-image-preview',
        error: error.message,
        troubleshooting: this.getGeminiTroubleshooting(error)
      };
    }
  }

  /**
   * Test both APIs and generate comparison report
   */
  async runComparisonTest() {
    console.log('🚀 Starting Image Generation API Comparison Test\n');
    console.log(`Test Prompt: "${this.testPrompt}"\n`);

    const results = {
      timestamp: new Date().toISOString(),
      testPrompt: this.testPrompt,
      results: {}
    };

    // Test OpenAI
    results.results.openai = await this.testOpenAI();
    console.log('');

    // Test Gemini
    results.results.gemini = await this.testGemini();
    console.log('');

    // Generate comparison
    this.generateComparisonReport(results);

    // Save results
    const filename = `api-test-results-${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(this.outputDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
    console.log(`📁 Results saved to: ${filepath}`);

    return results;
  }

  /**
   * Generate comparison report
   */
  generateComparisonReport(results) {
    console.log('📊 COMPARISON REPORT');
    console.log('='.repeat(50));

    const { openai, gemini } = results.results;

    console.log('Provider Availability:');
    console.log(`  OpenAI DALL-E 3: ${openai.success ? '✅ Available' : '❌ Failed'}`);
    console.log(`  Google Gemini 2.5: ${gemini.success ? '✅ Available' : '❌ Failed'}`);
    console.log('');

    if (openai.success && gemini.success) {
      console.log('Performance Comparison:');
      console.log(`  OpenAI Duration: ${openai.duration}`);
      console.log(`  Gemini Duration: ${gemini.duration}`);
      console.log(`  OpenAI Cost: ${openai.cost}`);
      console.log(`  Gemini Cost: ${gemini.cost}`);
      console.log('');

      console.log('Feature Comparison:');
      console.log('  OpenAI DALL-E 3:');
      Object.entries(openai.features).forEach(([key, value]) => {
        console.log(`    ${key}: ${value ? '✅' : '❌'}`);
      });
      console.log('  Google Gemini 2.5:');
      Object.entries(gemini.features).forEach(([key, value]) => {
        console.log(`    ${key}: ${value ? '✅' : '❌'}`);
      });
    }

    console.log('');
    console.log('Recommendations:');
    if (openai.success && gemini.success) {
      console.log('  ✅ Both providers are working correctly');
      console.log('  💡 Use OpenAI DALL-E 3 for creative generation with automatic prompt enhancement');
      console.log('  💡 Use Google Gemini 2.5 for image editing and multi-image composition');
    } else if (openai.success) {
      console.log('  ⚠️  Only OpenAI is available - use as primary provider');
    } else if (gemini.success) {
      console.log('  ⚠️  Only Google Gemini is available - use as primary provider');
    } else {
      console.log('  ❌ Neither provider is working - check API keys and quotas');
    }
  }

  /**
   * Get OpenAI troubleshooting tips
   */
  getOpenAITroubleshooting(error) {
    const tips = [];

    if (error.message.includes('API key')) {
      tips.push('Check VITE_OPENAI_API_KEY environment variable');
      tips.push('Verify API key is valid at https://platform.openai.com/api-keys');
    }

    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      tips.push('Check usage limits at https://platform.openai.com/usage');
      tips.push('Upgrade plan or wait for quota reset');
    }

    if (error.message.includes('billing')) {
      tips.push('Add payment method at https://platform.openai.com/billing');
    }

    return tips.length > 0 ? tips : ['Check OpenAI API documentation for more details'];
  }

  /**
   * Get Gemini troubleshooting tips
   */
  getGeminiTroubleshooting(error) {
    const tips = [];

    if (error.message.includes('API key') || error.message.includes('401')) {
      tips.push('Check VITE_GEMINI_API_KEY environment variable');
      tips.push('Generate new API key at https://aistudio.google.com/');
    }

    if (error.message.includes('quota') || error.message.includes('429')) {
      tips.push('Free tier quota exceeded - wait 24 hours or upgrade');
      tips.push('Check quota at https://aistudio.google.com/');
    }

    if (error.message.includes('SAFETY')) {
      tips.push('Prompt triggered safety filters - try a different prompt');
    }

    return tips.length > 0 ? tips : ['Check Google AI documentation for more details'];
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  const tester = new ImageGenerationTester();

  tester.runComparisonTest()
    .then((results) => {
      console.log('\n🎉 Test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

export default ImageGenerationTester;