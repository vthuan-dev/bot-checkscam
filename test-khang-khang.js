import fs from 'fs';
import path from 'path';

// Test Khang Khang specifically
console.log('🧪 Testing Khang Khang mapping...');

// Load mapping
const loadMapping = () => {
  try {
    const mappingPath = path.join(process.cwd(), 'fb-admin-mapping.json');
    const content = fs.readFileSync(mappingPath, 'utf8');
    const data = JSON.parse(content);
    return data.facebook_admin_mapping;
  } catch (error) {
    return {};
  }
};

const mapping = loadMapping();

// Find Khang Khang
const khangKhangEntries = Object.entries(mapping).filter(([id, admin]) => 
  admin.name.toLowerCase().includes('khang')
);

console.log(`\n📋 Found ${khangKhangEntries.length} entries with "Khang":`);
khangKhangEntries.forEach(([id, admin]) => {
  console.log(`- ID: ${id} → ${admin.name} (STT: ${admin.stt})`);
  console.log(`  URL: ${admin.profileUrl}`);
});

// Test specific ID from the image: looks like it might be 100139661479
const testIds = ['100139661479', '100055256255207']; // Second one is from our mapping

testIds.forEach(testId => {
  console.log(`\n🔍 Testing ID: ${testId}`);
  if (mapping[testId]) {
    const admin = mapping[testId];
    console.log(`✅ Found: ${admin.name} (STT: ${admin.stt})`);
    console.log(`🔗 ${admin.profileUrl}`);
    
    const response = `🕵️ FB Real của: "${admin.name}"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 ${admin.profileUrl}`;
    
    console.log(`\n📝 Bot response:`);
    console.log(response);
  } else {
    console.log(`❌ Not found in mapping`);
  }
});