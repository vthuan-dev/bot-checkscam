import fs from 'fs';
import path from 'path';

// Script tự động tạo mapping cho tất cả Facebook ID
console.log('🔄 Auto-generating Facebook ID mappings...');

// Load facebook-links.json
const loadFacebookLinks = () => {
  try {
    const linksPath = path.join(process.cwd(), 'facebook-links.json');
    const content = fs.readFileSync(linksPath, 'utf8');
    const data = JSON.parse(content);
    return data.facebook_links;
  } catch (error) {
    console.error('Error loading facebook links:', error);
    return [];
  }
};

// Load admins CSV
const loadAdminsData = () => {
  try {
    const csvPath = path.join(process.cwd(), '../src/admins.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').slice(1);
    
    const admins = [];
    lines.forEach(line => {
      if (line.trim()) {
        const [stt, name, imageUrl, profileUrl] = line.split(',').map(item => 
          item.replace(/^"|"$/g, '').trim()
        );
        if (stt && name && profileUrl) {
          admins.push({ stt, name, imageUrl, profileUrl });
        }
      }
    });
    
    return admins;
  } catch (error) {
    console.error('Error loading admins:', error);
    return [];
  }
};

// Extract Facebook ID from URL
const extractFacebookId = (url) => {
  const match = url.match(/profile\.php\?id=(\d+)/);
  return match ? match[1] : null;
};

// Load existing mapping
const loadExistingMapping = () => {
  try {
    const mappingPath = path.join(process.cwd(), 'fb-admin-mapping.json');
    const content = fs.readFileSync(mappingPath, 'utf8');
    const data = JSON.parse(content);
    return data.facebook_admin_mapping;
  } catch (error) {
    return {};
  }
};

// Generate mapping
const facebookLinks = loadFacebookLinks();
const adminsData = loadAdminsData();
const existingMapping = loadExistingMapping();

console.log(`📊 Loaded:`);
console.log(`- Facebook links: ${facebookLinks.length}`);
console.log(`- Admin entries: ${adminsData.length}`);
console.log(`- Existing mappings: ${Object.keys(existingMapping).length}`);

// Extract all Facebook IDs
const facebookIds = facebookLinks
  .map(url => extractFacebookId(url))
  .filter(id => id !== null);

console.log(`🔍 Found ${facebookIds.length} Facebook IDs`);

// Create new mapping by distributing IDs across admins
const newMapping = { ...existingMapping };
let adminIndex = 0;

facebookIds.forEach(fbId => {
  if (!newMapping[fbId]) {
    const admin = adminsData[adminIndex % adminsData.length];
    newMapping[fbId] = {
      name: admin.name,
      stt: admin.stt,
      profileUrl: admin.profileUrl
    };
    
    console.log(`➕ ${fbId} → ${admin.name} (STT: ${admin.stt})`);
    adminIndex++;
  }
});

// Save new mapping
const outputData = {
  facebook_admin_mapping: newMapping
};

const mappingPath = path.join(process.cwd(), 'fb-admin-mapping.json');
fs.writeFileSync(mappingPath, JSON.stringify(outputData, null, 2));

console.log(`\n✅ Generated mapping for ${Object.keys(newMapping).length} Facebook IDs`);
console.log(`💾 Saved to: fb-admin-mapping.json`);

// Show some examples
console.log(`\n📋 Sample mappings:`);
const sampleIds = Object.keys(newMapping).slice(0, 5);
sampleIds.forEach(id => {
  const admin = newMapping[id];
  console.log(`- ${id} → ${admin.name}`);
});