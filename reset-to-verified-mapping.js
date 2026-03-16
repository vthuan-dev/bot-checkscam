import fs from 'fs';
import path from 'path';

// Reset mapping về chỉ những ID đã được verify
console.log('🔄 Resetting to verified mappings only...');

// Những mapping đã được verify (từ conversation)
const verifiedMappings = {
  // Từ username mapping
  "100052185460324": {
    "name": "Nguyễn Văn Tài", 
    "stt": "177",
    "profileUrl": "https://admin.checkscam.vn/nguyen-duc-tai/"
  },
  "61588203634595": {
    "name": "Nguyễn Vân",
    "stt": "159", 
    "profileUrl": "https://admin.checkscam.vn/nguyen-bich-van/"
  },
  "100045800718530": {
    "name": "Nguyễn Hoàng Dương",
    "stt": "1",
    "profileUrl": "https://admin.checkscam.vn/nguyen-hoang-duong/"
  },
  "100039629906753": {
    "name": "Tống Hoàng Phương Dương", 
    "stt": "2",
    "profileUrl": "https://admin.checkscam.vn/tong-hoang-phuong-duong/"
  },
  "692606902": {
    "name": "Nguyễn Hồng Dương",
    "stt": "3", 
    "profileUrl": "https://admin.checkscam.vn/nguyen-hong-duong/"
  },
  
  // Từ conversation - đã verify
  "100015075061788": {
    "name": "Phan Anh Quân",
    "stt": "17",
    "profileUrl": "https://admin.checkscam.vn/phan-anh-quan/"
  },
  "100139661479": {
    "name": "Khang Khang", 
    "stt": "22",
    "profileUrl": "https://admin.checkscam.vn/khang-khang/"
  }
};

// Save verified mappings
const outputData = {
  facebook_admin_mapping: verifiedMappings
};

const mappingPath = path.join(process.cwd(), 'fb-admin-mapping.json');
fs.writeFileSync(mappingPath, JSON.stringify(outputData, null, 2));

console.log(`✅ Reset to ${Object.keys(verifiedMappings).length} verified mappings:`);

Object.entries(verifiedMappings).forEach(([id, admin]) => {
  console.log(`- ${id} → ${admin.name} (STT: ${admin.stt})`);
});

console.log('\n💡 Để thêm mapping mới:');
console.log('1. Test Facebook ID trong Telegram bot');
console.log('2. Nếu bot báo "Chưa xác định", note lại ID đó');
console.log('3. Dùng tool add-mapping.js để thêm mapping chính xác');

console.log('\n📝 Saved to fb-admin-mapping.json');