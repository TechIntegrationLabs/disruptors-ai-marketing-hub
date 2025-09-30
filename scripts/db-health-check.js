import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

async function healthCheck() {
  console.log('\n=== Supabase Database Health Check ===\n');

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing environment variables');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  try {
    // Check posts table
    console.log('Checking posts table...');
    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('❌ Posts table error:', error.message);
    } else {
      console.log(`✅ Posts table accessible (${count || 0} rows)`);
    }

    // Check published posts
    const { count: publishedCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);

    console.log(`   Published posts: ${publishedCount || 0}`);

    // Check featured posts
    const { count: featuredCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_featured', true);

    console.log(`   Featured posts: ${featuredCount || 0}`);

    // Check content types
    const { data: types } = await supabase
      .from('posts')
      .select('content_type')
      .not('content_type', 'is', null);

    if (types) {
      const typeCounts = types.reduce((acc, { content_type }) => {
        acc[content_type] = (acc[content_type] || 0) + 1;
        return acc;
      }, {});

      console.log('   Content types:');
      Object.entries(typeCounts).forEach(([type, count]) => {
        console.log(`     - ${type}: ${count}`);
      });
    }

    console.log('\n✅ Database health check passed\n');

  } catch (error) {
    console.error('\n❌ Health check failed:', error.message);
    process.exit(1);
  }
}

healthCheck();