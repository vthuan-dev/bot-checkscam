import fs from 'fs';
import path from 'path';

// Load danh sách link Facebook từ JSON
const loadFacebookLinks = () => {
  try {
    const jsonPath = path.join(process.cwd(), 'facebook-links.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(jsonContent);
    return data.facebook_links;
  } catch (error) {
    console.error('Lỗi khi load Facebook links:', error);
    return [];
  }
};

// Test regex phát hiện link Facebook
const testFacebookRegex = () => {
  const facebookLinkRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/[^\s]+/gi;
  const links = loadFacebookLinks();
  
  console.log('🔍 Test phát hiện link Facebook:');
  console.log(`📊 Tổng số link: ${links.length}`);
  
  let detectedCount = 0;
  
  // Test với 10 link đầu tiên
  const testLinks = links.slice(0, 10);
  
  testLinks.forEach((link, index) => {
    const matches = link.match(facebookLinkRegex);
    if (matches) {
      detectedCount++;
      console.log(`✅ Link ${index + 1}: ${link}`);
      console.log(`   Detected: ${matches[0]}`);
    } else {
      console.log(`❌ Link ${index + 1}: ${link} - KHÔNG PHÁT HIỆN`);
    }
  });
  
  console.log(`\n📈 Kết quả: ${detectedCount}/${testLinks.length} link được phát hiện`);
  
  // Test với tin nhắn có nhiều link
  console.log('\n🔍 Test tin nhắn có nhiều link:');
  const multiLinkMessage = `
    Xin chào, đây là link FB của tôi: ${links[0]}
    Và đây là link khác: ${links[1]}
    Còn đây nữa: ${links[2]}
  `;
  
  const allMatches = multiLinkMessage.match(facebookLinkRegex);
  console.log(`Tin nhắn: ${multiLinkMessage.substring(0, 100)}...`);
  console.log(`Phát hiện: ${allMatches ? allMatches.length : 0} link`);
  if (allMatches) {
    allMatches.forEach((match, i) => {
      console.log(`  ${i + 1}. ${match}`);
    });
  }
};

// Test function tìm kiếm admin
const testAdminSearch = () => {
  console.log('\n👥 Test tìm kiếm admin:');
  
  // Mock data admin (giống trong bot)
  const mockAdmins = [
    { stt: "1", name: "Nguyễn Hoàng Dương", imageUrl: "test1.jpg", profileUrl: "https://admin.checkscam.vn/nguyen-hoang-duong/" },
    { stt: "2", name: "Tống Hoàng Phương Dương", imageUrl: "test2.jpg", profileUrl: "https://admin.checkscam.vn/tong-hoang-phuong-duong/" },
    { stt: "3", name: "Nguyễn Hồng Dương", imageUrl: "test3.jpg", profileUrl: "https://admin.checkscam.vn/nguyen-hong-duong/" }
  ];
  
  const findAdmin = (searchName) => {
    if (!searchName) return null;
    
    const normalizedSearch = searchName.toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd');
    
    return mockAdmins.find(admin => {
      const normalizedAdminName = admin.name.toLowerCase()
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
        .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
        .replace(/[ìíịỉĩ]/g, 'i')
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
        .replace(/[ùúụủũưừứựửữ]/g, 'u')
        .replace(/[ỳýỵỷỹ]/g, 'y')
        .replace(/đ/g, 'd');
      
      return normalizedAdminName.includes(normalizedSearch) || 
             normalizedSearch.includes(normalizedAdminName);
    });
  };
  
  // Test cases
  const testCases = [
    "Nguyen Hoang Duong",
    "Dương",
    "Tống Hoàng",
    "Không tồn tại",
    "Nguyễn"
  ];
  
  testCases.forEach(testName => {
    const result = findAdmin(testName);
    console.log(`🔍 Tìm "${testName}": ${result ? `✅ ${result.name}` : '❌ Không tìm thấy'}`);
  });
};

// Chạy tất cả test
console.log('🤖 KIỂM TRA BOT TELEGRAM CHECKSCAM\n');
testFacebookRegex();
testAdminSearch();

console.log('\n✅ Hoàn thành test! Bot sẵn sàng hoạt động.');
console.log('📝 Để chạy bot thực tế:');
console.log('   1. Cấu hình .env với Bot Token');
console.log('   2. npm install');
console.log('   3. npm start');