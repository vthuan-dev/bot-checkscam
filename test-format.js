// Test format response message

// Mock data
const mockAdmin = {
  stt: "1",
  name: "Bích Tuyền", 
  imageUrl: "https://admin.checkscam.vn/wp-content/uploads/test.jpg",
  profileUrl: "https://admin.checkscam.vn/bich-tuyen/"
};

// Hàm tạo response message (copy từ bot.js)
const createResponseMessage = (admin, fbName, fbUrl) => {
  if (admin) {
    return `👤 ${fbName}
${fbUrl}

⭐ FB Real của: "${admin.name}"
⭐ GDV này có bảo hiểm tại Checkscam.vn
🔗 ${admin.profileUrl}

🛡️ QUỸ BẢO HIỂM CHECKSCAM.VN
[${admin.name}] BH 80.000.000.vnđ tại Checkscam.vn

Checkscam Cam Kết Bảo Hiểm 80.000.000.vnđ cho mọi giao dịch của bạn với "${admin.name}" khi bạn tuân theo Nội Quy Giao Dịch của Checkscam`;
  } else {
    return `👤 ${fbName}
${fbUrl}

⚠️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn`;
  }
};

// Test case 1: Tìm thấy admin
console.log('🔍 TEST CASE 1: Tìm thấy admin');
console.log('=====================================');
const response1 = createResponseMessage(
  mockAdmin, 
  "Huy Đình", 
  "https://www.facebook.com/share/1EBScXCjWK/?mibextid=wwXIfr"
);
console.log(response1);

console.log('\n');

// Test case 2: Không tìm thấy admin  
console.log('🔍 TEST CASE 2: Không tìm thấy admin');
console.log('=====================================');
const response2 = createResponseMessage(
  null, 
  "Lê Nam", 
  "https://www.facebook.com/share/1HEUVGn..."
);
console.log(response2);

console.log('\n');

// Test card format
console.log('🔍 TEST CASE 3: Card thông tin admin');
console.log('=====================================');
const cardText = `🛡️ QUỸ BẢO HIỂM CHECKSCAM.VN

${mockAdmin.name}

Thông Tin Bảo Hiểm:
📱 Fb (chính): ${mockAdmin.stt}
📱 Fb (phụ): 
📞 Inbox Zalo: 
🏪 Shop trên Cs:

Quỹ Bảo Hiểm CS:
Từ ngày 10/07/2025 CS sẽ bảo đảm an toàn cho bạn với số tiền trong Quỹ Bảo Hiểm 80.000.000 vnđ của ${mockAdmin.name}`;

console.log(cardText);

console.log('\n✅ Format test hoàn thành!');