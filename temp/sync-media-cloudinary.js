import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';

const supabaseUrl = 'https://ubqxflzuvxowigbjmqfb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicXhmbHp1dnhvd2lnYmptcWZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODUxMjQzOCwiZXhwIjoyMDc0MDg4NDM4fQ.FnhnaAxWjMo41M7Gmm_bXFXZuegzW5HfitvB1APNDDk';

cloudinary.config({
  cloud_name: 'dvcvxhzmt',
  api_key: '935251962635945',
  api_secret: 'CNppaSbbi3IevxjuRvg5-8CKCds'
});

const supabase = createClient(supabaseUrl, supabaseKey);

// Mapping of alt text patterns to Cloudinary paths
const mediaMapping = [
  // Service icons
  { altPattern: 'AI Automation service', cloudinaryPrefix: 'disruptors-ai/services/ai-automation' },
  { altPattern: 'Social Media Marketing service', cloudinaryPrefix: 'disruptors-ai/services/social-media-marketing' },
  { altPattern: 'SEO & GEO service', cloudinaryPrefix: 'disruptors-ai/services/seo-geo' },
  { altPattern: 'Lead Generation service', cloudinaryPrefix: 'disruptors-ai/services/lead-generation' },
  { altPattern: 'Paid Advertising service', cloudinaryPrefix: 'disruptors-ai/services/paid-advertising' },
  { altPattern: 'Podcasting service', cloudinaryPrefix: 'disruptors-ai/services/podcasting' },
  { altPattern: 'Custom Apps service', cloudinaryPrefix: 'disruptors-ai/services/custom-apps' },
  { altPattern: 'CRM Management service', cloudinaryPrefix: 'disruptors-ai/services/crm-management' },
  { altPattern: 'Fractional CMO service', cloudinaryPrefix: 'disruptors-ai/services/fractional-cmo' },

  // Case study logos
  { altPattern: 'TradeWorx USA', cloudinaryPrefix: 'case-studies/case-studies/tradeworxusa_logo' },
  { altPattern: 'The Wellness Way', cloudinaryPrefix: 'case-studies/case-studies/thewellnessway_logo' },
  { altPattern: 'Sound Corrections', cloudinaryPrefix: 'case-studies/case-studies/soundcorrections_logo' },
  { altPattern: 'SegPro', cloudinaryPrefix: 'case-studies/case-studies/segpro_logo' },
  { altPattern: 'Neuro Mastery', cloudinaryPrefix: 'case-studies/case-studies/neuromastery_logo' },
  { altPattern: 'Muscle Works', cloudinaryPrefix: 'case-studies/case-studies/muscleworks_logo' },
  { altPattern: 'Granite Paving', cloudinaryPrefix: 'case-studies/case-studies/granitepaving_logo' },
  { altPattern: 'Auto Trim Utah', cloudinaryPrefix: 'case-studies/case-studies/autotrimutah_logo' },
  { altPattern: 'Timber View Financial', cloudinaryPrefix: 'case-studies/case-studies/timberviewfinancial_logo' },

  // Logo
  { altPattern: 'Disruptors Media Logo', cloudinaryPrefix: 'logo' },
];

async function syncMedia() {
  console.log('=== SYNCING MEDIA WITH CLOUDINARY ===\n');

  // Get all media from database
  const { data: mediaRecords, error } = await supabase
    .from('site_media')
    .select('*');

  if (error) {
    console.error('Database error:', error);
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const record of mediaRecords) {
    // Skip if already has URL and type
    if (record.media_url && record.media_type) {
      skipped++;
      continue;
    }

    // Find matching Cloudinary resource
    const mapping = mediaMapping.find(m =>
      record.alt_text?.includes(m.altPattern)
    );

    if (!mapping) {
      console.log(`⚠️  No mapping for: ${record.alt_text}`);
      continue;
    }

    try {
      // Get resource from Cloudinary
      const resource = await cloudinary.api.resource(mapping.cloudinaryPrefix, {
        resource_type: 'image'
      });

      const url = resource.secure_url;
      const type = `image/${resource.format}`;

      // Update database with correct column names
      const { error: updateError } = await supabase
        .from('site_media')
        .update({
          media_url: url,
          media_type: type,
          cloudinary_public_id: resource.public_id,
          cloudinary_format: resource.format
        })
        .eq('id', record.id);

      if (updateError) {
        console.error(`❌ Failed to update ${record.alt_text}:`, updateError.message);
      } else {
        console.log(`✅ Updated: ${record.alt_text}`);
        console.log(`   URL: ${url}`);
        console.log(`   Type: ${type}`);
        updated++;
      }

    } catch (cloudinaryError) {
      console.error(`❌ Cloudinary error for ${mapping.cloudinaryPrefix}:`, cloudinaryError.message);
    }
  }

  console.log(`\n=== SYNC COMPLETE ===`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped (already has data): ${skipped}`);
  console.log(`Failed/No mapping: ${mediaRecords.length - updated - skipped}`);
}

syncMedia();
