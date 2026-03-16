import { findAdminByFacebookUrl } from './facebook-admin-lookup.js';

// Simulate bot message processing
function simulateBotMessage(messageText) {
    console.log(`📨 Tin nhắn: ${messageText}`);
    
    // Regex để phát hiện link Facebook (giống trong bot)
    const facebookLinkRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/[^\s]+/gi;
    const facebookLinks = messageText.match(facebookLinkRegex);
    
    if (facebookLinks && facebookLinks.length > 0) {
        const facebookUrl = facebookLinks[0];
        console.log(`🔍 Phát hiện Facebook URL: ${facebookUrl}`);
        
        // Tìm admin
        const admin = findAdminByFacebookUrl(facebookUrl);
        
        if (admin) {
            const response = `🕵️ **FB Real của: "${admin.name}"**
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 ${admin.adminUrl}
📘 Facebook: ${admin.facebookUrl}`;
            
            console.log('✅ Bot response:');
            console.log(response);
        } else {
            const response = `⚠️ **Chưa xác định**
❌ Không phải GDV của Checkscam.vn
🔍 Link: ${facebookUrl}

*Lưu ý: Chỉ kiểm tra được admin có trong database CheckScam*`;
            
            console.log('❌ Bot response:');
            console.log(response);
        }
    } else {
        console.log('❌ Không phát hiện Facebook link');
    }
    
    console.log('---\n');
}

// Test cases
console.log('🤖 Simulation Bot Facebook Lookup\n');

// Test với URL có trong database
simulateBotMessage('Anh em check giúp link này: https://www.facebook.com/profile.php?id=100013965611470');

// Test với URL không có trong database  
simulateBotMessage('https://www.facebook.com/profile.php?id=100055769731582 này thế nào?');

// Test với URL format khác
simulateBotMessage('Check link fb.com/profile.php?id=100005959991439 này');

// Test với tin nhắn không có Facebook link
simulateBotMessage('Xin chào mọi người!');

console.log('🎉 Simulation hoàn thành!');