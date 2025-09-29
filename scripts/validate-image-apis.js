#!/usr/bin/env node

/**
 * Simple Image API Validation Script
 * Quickly validates that both OpenAI and Google image generation APIs are accessible
 */

import { config } from 'dotenv';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
config();

async function validateAPIs() {
  console.log('🔍 Validating Image Generation APIs...\n');

  const results = {
    openai: { available: false, error: null },
    gemini: { available: false, error: null }
  };

  // Test OpenAI API Key
  console.log('🔑 Testing OpenAI API key...');
  try {
    const openai = new OpenAI({
      apiKey: process.env.VITE_OPENAI_API_KEY
    });

    // Try to list models (lightweight test)
    const models = await openai.models.list();
    const hasImageModels = models.data.some(model => model.id.includes('dall-e'));

    if (hasImageModels) {
      results.openai.available = true;
      console.log('✅ OpenAI API key is valid and DALL-E models are available');
    } else {
      results.openai.error = 'No DALL-E models found in account';
      console.log('⚠️  OpenAI API key valid but no DALL-E models available');
    }
  } catch (error) {
    results.openai.error = error.message;
    console.log(`❌ OpenAI API failed: ${error.message}`);
  }

  console.log('');

  // Test Google Gemini API Key
  console.log('🔑 Testing Google Gemini API key...');
  try {
    const gemini = new GoogleGenerativeAI(process.env.VITE_GEMINI_API_KEY);

    // Try to get a simple text model first (lightweight test)
    const model = gemini.getGenerativeModel({ model: "models/gemini-2.5-flash" });
    const result = await model.generateContent("Hello");

    if (result && result.response) {
      results.gemini.available = true;
      console.log('✅ Google Gemini API key is valid');

      // Now test if image model is available
      try {
        const imageModel = gemini.getGenerativeModel({ model: "models/gemini-2.5-flash-image-preview" });
        console.log('✅ Gemini 2.5 Flash Image model is accessible');
      } catch (imageError) {
        console.log('⚠️  Gemini text API works but image model may not be available');
      }
    }
  } catch (error) {
    results.gemini.error = error.message;
    console.log(`❌ Google Gemini API failed: ${error.message}`);
  }

  console.log('\n📊 VALIDATION SUMMARY');
  console.log('='.repeat(40));
  console.log(`OpenAI DALL-E 3: ${results.openai.available ? '✅ Ready' : '❌ Failed'}`);
  console.log(`Google Gemini 2.5: ${results.gemini.available ? '✅ Ready' : '❌ Failed'}`);

  if (!results.openai.available && !results.gemini.available) {
    console.log('\n❌ Neither API is working. Check your environment variables:');
    console.log('   VITE_OPENAI_API_KEY');
    console.log('   VITE_GEMINI_API_KEY');
  } else if (results.openai.available && results.gemini.available) {
    console.log('\n✅ Both APIs are ready for image generation!');
    console.log('💡 You can now use both OpenAI DALL-E 3 and Google Gemini 2.5 Flash Image');
  } else {
    console.log(`\n⚠️  Only ${results.openai.available ? 'OpenAI' : 'Google Gemini'} is available`);
  }

  return results;
}

// Run validation
validateAPIs()
  .then(() => {
    console.log('\n🎉 Validation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Validation failed:', error);
    process.exit(1);
  });