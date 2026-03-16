import { findAdminByContact, formatAdminContactInfo } from './contact-lookup.js';

// Simulate bot message processing cho contact info
function simulateBotContactMessage(messageText) {
    console.log(`📨 Tin nhắn: ${messageText}`);
    
    // Regex để phát hiện phone và bank account (giống trong bot)
    const phoneRegex = /(?:0|\+84)[0-9]{8,10}/g;
    const bankAccountRegex = /\b\d{10,20}\b/g;
    
    const hasPhone = phoneRegex.test(messageText);
    const hasBankAccount = bankAccountRegex.test(messageText);
    
    if (hasPhone || hasBankAccount) {
        console.log(`🔍 Phát hiện contact info`);
        
        // Tìm admin
        const admin = findAdminByContact(messageText);
        
        if (admin) {
            const response = formatAdminContactInfo(admin);
            console.log('✅ Bot response:');
            console.log(response);
        } else {
            const response = `⚠️ **Chưa xác định**
❌ Không phải GDV của Checkscam.vn
🔍 SĐT/STK không có trong database

*Lưu ý: Chỉ kiểm tra được admin có thông tin liên hệ trong database CheckScam*`;
            
            console.log('❌ Bot response:');
            console.log(response);
        }
    } else {
        console.log('❌ Không phát hiện phone/bank account');
    }
    
    console.log('---\n');
}

// Test cases
console.log('🤖 Simulation Bot Contact Lookup\n');

// Test với SĐT của Duy Nguyễn
simulateBotContactMessage('Anh em check giúp số này: 0763666222');

// Test với STK của Duy Nguyễn
simulateBotContactMessage('STK này: 0491000133345 có phải admin không?');

// Test với STK khác của Duy Nguyễn
simulateBotContactMessage('Check stk BIDV: 16010000460071');

// Test với cả SĐT và STK
simulateBotContactMessage('SĐT: 0763666222, STK Vietcombank: 0491000133345');

// Test với số không có trong database
simulateBotContactMessage('Số này thế nào: 0987654321');

// Test với STK không có trong database
simulateBotContactMessage('STK: 1234567890123456');

// Test với tin nhắn không có contact info
simulateBotContactMessage('Xin chào mọi người!');

console.log('🎉 Simulation hoàn thành!');