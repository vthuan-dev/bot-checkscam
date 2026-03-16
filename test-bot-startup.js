import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

console.log('🧪 Testing bot startup...');

// Test 1: Check .env file
const token = process.env.TELEGRAM_BOT_TOKEN;
console.log(`✅ Bot token: ${token ? 'Found' : 'Missing'}`);

// Test 2: Check CSV file
const loadAdminsData = () => {
  try {
    const possiblePaths = [
      path.join(process.cwd(), '../src/admins.csv'),
      path.join(process.cwd(), 'admins.csv'),
      path.join(process.cwd(), 'src/admins.csv'),
      './admins.csv'
    ];
    
    for (const csvPath of possiblePaths) {
      try {
        const csvContent = fs.readFileSync(csvPath, 'utf8');
        const lines = csvContent.split('\n').slice(1);
        console.log(`✅ CSV file found: ${csvPath} (${lines.length} lines)`);
        return lines.length;
      } catch (err) {
        continue;
      }
    }
    
    console.log('❌ CSV file not found');
    return 0;
  } catch (error) {
    console.log('❌ Error loading CSV:', error.message);
    return 0;
  }
};

// Test 3: Check mapping files
const loadMapping = (filename) => {
  try {
    const mappingPath = path.join(process.cwd(), filename);
    const content = fs.readFileSync(mappingPath, 'utf8');
    const data = JSON.parse(content);
    const keys = Object.keys(data[Object.keys(data)[0]]);
    console.log(`✅ ${filename}: ${keys.length} entries`);
    return keys.length;
  } catch (error) {
    console.log(`❌ ${filename}: ${error.message}`);
    return 0;
  }
};

// Run tests
const adminCount = loadAdminsData();
const fbMappingCount = loadMapping('fb-admin-mapping.json');
const usernameMappingCount = loadMapping('username-to-id-mapping.json');

console.log('\n📊 Summary:');
console.log(`- Admins: ${adminCount}`);
console.log(`- FB Mapping: ${fbMappingCount}`);
console.log(`- Username Mapping: ${usernameMappingCount}`);

if (token && adminCount > 0) {
  console.log('\n✅ Bot ready to start!');
} else {
  console.log('\n❌ Bot has issues, check configuration');
}