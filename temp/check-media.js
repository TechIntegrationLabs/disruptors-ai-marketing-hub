import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMedia() {
  const { data, error } = await supabase
    .from('site_media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('=== DATABASE MEDIA RECORDS ===');
  console.log('Total records:', data.length);
  console.log('');

  data.forEach((item, idx) => {
    console.log(`[${idx + 1}] ID: ${item.id}`);
    console.log(`    Type: ${item.type || 'NULL'}`);
    console.log(`    URL: ${item.url || 'NULL'}`);
    console.log(`    Alt: ${item.alt_text || 'NULL'}`);
    console.log(`    AI Generated: ${item.ai_generated || false}`);
    console.log(`    Created: ${item.created_at}`);
    console.log('');
  });
}

checkMedia();
