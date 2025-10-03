import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvcvxhzmt',
  api_key: process.env.CLOUDINARY_API_KEY || '935251962635945',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'CNppaSbbi3IevxjuRvg5-8CKCds'
});

async function checkCloudinary() {
  try {
    // Check all folders
    console.log('=== CLOUDINARY FOLDERS ===\n');
    const folders = await cloudinary.api.root_folders();
    console.log('Root folders:', folders.folders.map(f => f.name).join(', '));
    console.log('');

    // Check all resources (no prefix)
    console.log('=== ALL CLOUDINARY RESOURCES ===\n');
    const allResources = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100
    });

    console.log(`Total resources: ${allResources.resources.length}\n`);

    allResources.resources.forEach((item, idx) => {
      console.log(`[${idx + 1}] ${item.public_id}`);
      console.log(`    URL: ${item.secure_url}`);
      console.log(`    Format: ${item.format}`);
      console.log(`    Size: ${Math.round(item.bytes / 1024)}KB`);
      console.log('');
    });

  } catch (error) {
    console.error('Cloudinary error:', error.message);
  }
}

checkCloudinary();
