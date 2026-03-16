import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Simple tool để thêm mapping chính xác
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
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
        if (stt && name && profileUrl) {
          admins.push({ stt, name, imageUrl, profileUrl });
        }
      }
    });
    
    return admins;
  } catch (error) {
    return [];
  }
};

const loadCurrentMapping = () => {
  try {
    const mappingPath = path.join(process.cwd(), 'fb-admin-mapping.json');
    const content = fs.readFileSync(mappingPath, 'utf8');
    const data = JSON.parse(content);
    return data.facebook_admin_mapping;
  } catch (error) {
    return {};
  }
};

const saveMapping = (mapping) => {
  const mappingPath = path.join(process.cwd(), 'fb-admin-mapping.json');
  const data = { facebook_admin_mapping: mapping };
  fs.writeFileSync(mappingPath, JSON.stringify(data, null, 2));
};

const addMapping = async () => {
  console.log('➕ Tool thêm Facebook ID Mapping\n');
  
  const adminsData = loadAdminsData();
  const currentMapping = loadCurrentMapping();
  
  console.log(`📊 Current mappings: ${Object.keys(currentMapping).length}`);
  console.log(`📊 Available admins: ${adminsData.length}\n`);
  
  // Get Facebook ID
  const fbId = await question('🔗 Nhập Facebook ID (từ URL profile.php?id=...): ');
  
  if (currentMapping[fbId]) {
    const existing = currentMapping[fbId];
    console.log(`⚠️ ID ${fbId} đã có mapping: ${existing.name}`);
    const overwrite = await question('Có muốn ghi đè không? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      rl.close();
      return;
    }
  }
  
  // Search admin
  const searchName = await question('👤 Nhập tên admin cần tìm: ');
  
  const searchResults = adminsData.filter(admin => 
    admin.name.toLowerCase().includes(searchName.toLowerCase())
  );
  
  if (searchResults.length === 0) {
    console.log('❌ Không tìm thấy admin nào');
    rl.close();
    return;
  }
  
  console.log('\n🔍 Kết quả tìm kiếm:');
  searchResults.forEach((admin, index) => {
    console.log(`${index + 1}. ${admin.name} (STT: ${admin.stt})`);
    console.log(`   ${admin.profileUrl}`);
  });
  
  const choice = await question('\nChọn admin (số thứ tự): ');
  const adminIndex = parseInt(choice) - 1;
  
  if (adminIndex >= 0 && adminIndex < searchResults.length) {
    const selectedAdmin = searchResults[adminIndex];
    
    // Add mapping
    currentMapping[fbId] = {
      name: selectedAdmin.name,
      stt: selectedAdmin.stt,
      profileUrl: selectedAdmin.profileUrl
    };
    
    saveMapping(currentMapping);
    
    console.log(`\n✅ Đã thêm mapping:`);
    console.log(`   Facebook ID: ${fbId}`);
    console.log(`   Admin: ${selectedAdmin.name} (STT: ${selectedAdmin.stt})`);
    console.log(`   URL: ${selectedAdmin.profileUrl}`);
    
    // Test response
    const response = `🕵️ FB Real của: "${selectedAdmin.name}"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 ${selectedAdmin.profileUrl}`;
    
    console.log(`\n📝 Bot sẽ trả lời:`);
    console.log(response);
    
  } else {
    console.log('❌ Lựa chọn không hợp lệ');
  }
  
  rl.close();
};

addMapping();