import fs from 'fs';
import path from 'path';

// Test specific Facebook ID
const testFacebookId = '100015075061788';
const testUrl = `https://www.facebook.com/profile.php?id=${testFacebookId}`;

console.log(`🧪 Testing Facebook ID: ${testFacebookId}`);
console.log(`🔗 URL: ${testUrl}`);

// Load mappings
const loadFacebookAdminMapping = () => {
  try {
    const mappingPath = path.join(process.cwd(), 'fb-admin-mapping.json');
    const mappingContent = fs.readFileSync(mappingPath, 'utf8');
    const data = JSON.parse(mappingContent);
    return data.facebook_admin_mapping;
  } catch (error) {
    console.error('Error loading mapping:', error);
    return {};
  }
};

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
        admins.push({ stt, name, imageUrl, profileUrl });
      }
    });
    
    return admins;
  } catch (error) {
    console.error('Error loading admins:', error);
    return [];
  }
};

// Extract ID from URL
const extractFacebookId = (url) => {
  const patterns = [
    /(?:profile\.php\?id=)(\d+)/,
    /facebook\.com\/(\d+)/,
    /fb\.com\/(\d+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
};

// Find admin by Facebook ID
const findAdminByFacebookId = (fbId, fbMapping, adminsData) => {
  if (!fbId) return null;
  
  if (fbMapping[fbId]) {
    const mappedAdmin = fbMapping[fbId];
    return adminsData.find(admin => 
      admin.name === mappedAdmin.name || admin.stt === mappedAdmin.stt
    ) || mappedAdmin;
  }
  
  return null;
};

// Create response message
const createResponseMessage = (admin) => {
  if (admin) {
    return `🕵️ FB Real của: "${admin.name}"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 ${admin.profileUrl}`;
  } else {
    return `🕵️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn`;
  }
};

// Run test
const fbMapping = loadFacebookAdminMapping();
const adminsData = loadAdminsData();

console.log(`\n📊 Loaded data:`);
console.log(`- Facebook mappings: ${Object.keys(fbMapping).length}`);
console.log(`- Admin entries: ${adminsData.length}`);

const extractedId = extractFacebookId(testUrl);
console.log(`\n🔍 Extracted ID: ${extractedId}`);

const admin = findAdminByFacebookId(extractedId, fbMapping, adminsData);
console.log(`\n👤 Found admin:`, admin);

const response = createResponseMessage(admin);
console.log(`\n📝 Bot response:`);
console.log(response);