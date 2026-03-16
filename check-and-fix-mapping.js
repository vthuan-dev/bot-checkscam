import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Tool để check và fix mapping Facebook ID → Admin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

// Load data
const loadFacebookLinks = () => {
  try {
    const linksPath = path.join(process.cwd(), 'facebook-links.json');
    const content = fs.readFileSync(linksPath, 'utf8');
    const data = JSON.parse(content);
    return data.facebook_links;
  } catch (error) {
    return [];
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

// Extract Facebook ID from URL
const extractFacebookId = (url) => {
  const match = url.match(/profile\.php\?id=(\d+)/);
  return match ? match[1] : null;
};

// Main function
const checkAndFixMapping = async () => {
  console.log('🔧 Tool Check và Fix Facebook ID Mapping\n');
  
  const facebookLinks = loadFacebookLinks();
  const adminsData = loadAdminsData();
  const currentMapping = loadCurrentMapping();
  
  console.log(`📊 Loaded:`);
  console.log(`- Facebook links: ${facebookLinks.length}`);
  console.log(`- Admin entries: ${adminsData.length}`);
  console.log(`- Current mappings: ${Object.keys(currentMapping).length}\n`);
  
  // Extract Facebook IDs
  const facebookIds = facebookLinks
    .map(url => extractFacebookId(url))
    .filter(id => id !== null);
  
  console.log('🎯 Options:');
  console.log('1. Check specific Facebook ID');
  console.log('2. Add/Fix mapping manually');
  console.log('3. Clear all mappings (start fresh)');
  console.log('4. Show current mappings');
  console.log('5. Batch check (show unmapped IDs)');
  console.log('6. Exit');
  
  while (true) {
    const choice = await question('\nChọn option (1-6): ');
    
    if (choice === '1') {
      // Check specific ID
      const fbId = await question('Nhập Facebook ID cần check: ');
      
      if (currentMapping[fbId]) {
        const admin = currentMapping[fbId];
        console.log(`✅ ID ${fbId} đã có mapping:`);
        console.log(`   → ${admin.name} (STT: ${admin.stt})`);
        console.log(`   → ${admin.profileUrl}`);
        
        const confirm = await question('Có muốn sửa mapping này không? (y/n): ');
        if (confirm.toLowerCase() === 'y') {
          await addOrFixMapping(fbId, adminsData, currentMapping);
        }
      } else {
        console.log(`❌ ID ${fbId} chưa có mapping`);
        const confirm = await question('Có muốn thêm mapping không? (y/n): ');
        if (confirm.toLowerCase() === 'y') {
          await addOrFixMapping(fbId, adminsData, currentMapping);
        }
      }
    }
    
    else if (choice === '2') {
      // Add/Fix mapping manually
      const fbId = await question('Nhập Facebook ID: ');
      await addOrFixMapping(fbId, adminsData, currentMapping);
    }
    
    else if (choice === '3') {
      // Clear all mappings
      const confirm = await question('⚠️ Xóa tất cả mapping? (y/n): ');
      if (confirm.toLowerCase() === 'y') {
        const emptyMapping = {};
        saveMapping(emptyMapping);
        console.log('✅ Đã xóa tất cả mapping');
        Object.keys(currentMapping).forEach(key => delete currentMapping[key]);
      }
    }
    
    else if (choice === '4') {
      // Show current mappings
      console.log('\n📋 Current mappings:');
      Object.entries(currentMapping).slice(0, 10).forEach(([id, admin], index) => {
        console.log(`${index + 1}. ${id} → ${admin.name} (STT: ${admin.stt})`);
      });
      if (Object.keys(currentMapping).length > 10) {
        console.log(`... và ${Object.keys(currentMapping).length - 10} mapping khác`);
      }
    }
    
    else if (choice === '5') {
      // Batch check unmapped IDs
      console.log('\n🔍 Checking unmapped Facebook IDs...');
      const unmappedIds = facebookIds.filter(id => !currentMapping[id]);
      console.log(`Found ${unmappedIds.length} unmapped IDs:`);
      
      unmappedIds.slice(0, 20).forEach((id, index) => {
        console.log(`${index + 1}. ${id} - https://facebook.com/profile.php?id=${id}`);
      });
      
      if (unmappedIds.length > 20) {
        console.log(`... và ${unmappedIds.length - 20} ID khác`);
      }
    }
    
    else if (choice === '6') {
      break;
    }
  }
  
  rl.close();
  console.log('\n👋 Bye!');
};

// Function to add or fix mapping
const addOrFixMapping = async (fbId, adminsData, currentMapping) => {
  console.log('\n👥 Chọn admin tương ứng:');
  console.log('0. Tìm kiếm admin theo tên');
  
  // Show first 10 admins
  adminsData.slice(0, 10).forEach((admin, index) => {
    console.log(`${index + 1}. ${admin.name} (STT: ${admin.stt})`);
  });
  console.log('... (gõ 0 để tìm kiếm)');
  
  const adminChoice = await question('\nChọn admin (0 để tìm kiếm, số để chọn): ');
  
  let selectedAdmin = null;
  
  if (adminChoice === '0') {
    // Search admin by name
    const searchName = await question('Nhập tên admin cần tìm: ');
    const searchResults = adminsData.filter(admin => 
      admin.name.toLowerCase().includes(searchName.toLowerCase())
    );
    
    if (searchResults.length === 0) {
      console.log('❌ Không tìm thấy admin nào');
      return;
    }
    
    console.log('\n🔍 Kết quả tìm kiếm:');
    searchResults.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name} (STT: ${admin.stt})`);
    });
    
    const resultChoice = await question('Chọn admin từ kết quả tìm kiếm: ');
    const resultIndex = parseInt(resultChoice) - 1;
    
    if (resultIndex >= 0 && resultIndex < searchResults.length) {
      selectedAdmin = searchResults[resultIndex];
    }
  } else {
    // Select from list
    const adminIndex = parseInt(adminChoice) - 1;
    if (adminIndex >= 0 && adminIndex < 10) {
      selectedAdmin = adminsData[adminIndex];
    }
  }
  
  if (selectedAdmin) {
    currentMapping[fbId] = {
      name: selectedAdmin.name,
      stt: selectedAdmin.stt,
      profileUrl: selectedAdmin.profileUrl
    };
    
    saveMapping(currentMapping);
    
    console.log(`✅ Đã mapping: ${fbId} → ${selectedAdmin.name}`);
    console.log(`🔗 ${selectedAdmin.profileUrl}`);
  } else {
    console.log('❌ Không chọn được admin');
  }
};

// Run the tool
checkAndFixMapping();