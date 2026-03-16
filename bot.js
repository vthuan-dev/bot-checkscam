import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { findAdminByFacebookUrl, formatAdminInfo } from './facebook-admin-lookup.js';
import { findAdminByContact, formatAdminContactInfo } from './contact-lookup.js';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Load danh sách admin từ CSV
const loadAdminsData = () => {
  try {
    const csvPath = path.join(process.cwd(), '../src/admins.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').slice(1); // Bỏ header
    
    const admins = [];
    lines.forEach(line => {
      if (line.trim()) {
        const [stt, name, imageUrl, profileUrl] = line.split(',').map(item => 
          item.replace(/^"|"$/g, '').trim()
        );
        admins.push({ stt, name, imageUrl, profileUrl });
      }
    });
    
    console.log(`Đã load ${admins.length} admin từ database`);
    return admins;
  } catch (error) {
    console.error('Lỗi khi load dữ liệu admin:', error);
    return [];
  }
};

// Load danh sách Facebook links từ JSON (để test)
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

const adminsData = loadAdminsData();
const facebookLinks = loadFacebookLinks(); // Load để test

// Regex để phát hiện link Facebook (chỉ match URL đúng format)
const facebookLinkRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/profile\.php\?id=\d+(?![a-zA-Z0-9])/gi;

// Regex để phát hiện phone và bank account
const phoneRegex = /(?:^|\s)((?:0|\+84)[0-9]{8,10})(?=\s|$)/g;
const bankAccountRegex = /(?:^|\s)(\d{10,20})(?=\s|$)/g;

// Hàm trích xuất tên từ Telegram user thay vì Facebook
const getTelegramUserName = (msg) => {
  if (msg.from.first_name && msg.from.last_name) {
    return `${msg.from.first_name} ${msg.from.last_name}`;
  } else if (msg.from.first_name) {
    return msg.from.first_name;
  } else if (msg.from.username) {
    return `@${msg.from.username}`;
  } else {
    return 'User';
  }
};

// Hàm tìm kiếm admin trong database
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
  
  return adminsData.find(admin => {
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

// Hàm tạo card thông tin admin (nếu tìm thấy)
const createAdminCard = async (chatId, admin, messageId) => {
  if (!admin || !admin.imageUrl) return;
  
  try {
    const cardText = `🛡️ QUỸ BẢO HIỂM CHECKSCAM.VN

${admin.name}

Thông Tin Bảo Hiểm:
📱 Fb (chính): ${admin.stt}
📱 Fb (phụ): 
📞 Inbox Zalo: 
🏪 Shop trên Cs:

Quỹ Bảo Hiểm CS:
Từ ngày 10/07/2025 CS sẽ bảo đảm an toàn cho bạn với số tiền trong Quỹ Bảo Hiểm 80.000.000 vnđ của ${admin.name}`;

    // Gửi ảnh với caption
    await bot.sendPhoto(chatId, admin.imageUrl, {
      caption: cardText,
      reply_to_message_id: messageId
    });
  } catch (error) {
    console.error('Lỗi khi gửi card admin:', error.message);
  }
};
/**
 * Tạo response message chuẩn cho bot dựa trên loại match
 * @param {object|null} admin - Admin info hoặc null
 * @param {string} matchType - Loại match: 'facebook', 'phone', 'bank'
 * @returns {string} - Formatted response message
 */
const createStandardResponse = (admin, matchType = 'facebook') => {
  if (admin) {
    let prefix = '🕵️ FB Real của:';
    
    // Thay đổi prefix dựa trên loại match
    if (matchType === 'phone') {
      prefix = '🕵️ SĐT của:';
    } else if (matchType === 'bank') {
      prefix = '🕵️ STK của:';
    }
    
    return `${prefix} "${admin.name}"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 ${admin.adminUrl}`;
  } else {
    return `🕵️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn`;
  }
};

// Lắng nghe tất cả tin nhắn trong group
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text || '';
  
  // Debug log để kiểm tra bot có nhận tin nhắn không
  console.log(`📨 Nhận tin nhắn từ ${msg.chat.type}: ${messageText.substring(0, 50)}...`);
  console.log(`👤 User: ${msg.from.first_name}, Chat ID: ${chatId}`);
  
  // Xử lý cả private chat và group chat
  if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup' && msg.chat.type !== 'private') {
    return;
  }
  
  // Tìm link Facebook trong tin nhắn
  const facebookLinks = messageText.match(facebookLinkRegex);
  
  // Tìm phone/bank account trong tin nhắn
  const hasPhone = phoneRegex.test(messageText);
  const hasBankAccount = bankAccountRegex.test(messageText);
  
  // Xử lý Facebook links
  if (facebookLinks && facebookLinks.length > 0) {
    console.log(`Phát hiện link Facebook trong group ${msg.chat.title}: ${facebookLinks[0]}`);
    
    try {
      // Gửi typing action
      await bot.sendChatAction(chatId, 'typing');
      
      const facebookUrl = facebookLinks[0];
      console.log(`Đang kiểm tra Facebook URL: ${facebookUrl}`);
      
      // Tìm admin từ Facebook URL
      const admin = findAdminByFacebookUrl(facebookUrl);
      
      // Tạo response message chuẩn
      const responseMessage = createStandardResponse(admin, 'facebook');
      
      if (admin) {
        console.log(`✅ Tìm thấy admin: ${admin.name}`);
      } else {
        console.log(`❌ Không tìm thấy admin cho URL: ${facebookUrl}`);
      }
      
      // Reply tin nhắn gốc với thông tin
      await bot.sendMessage(chatId, responseMessage, {
        reply_to_message_id: msg.message_id
      });
      
    } catch (error) {
      console.error('Lỗi khi xử lý link Facebook:', error);
      await bot.sendMessage(chatId, 
        '❌ Có lỗi xảy ra khi kiểm tra link. Vui lòng thử lại sau.', 
        { reply_to_message_id: msg.message_id }
      );
    }
  }
  // Xử lý Phone/Bank Account (nếu không có Facebook link)
  else if (hasPhone || hasBankAccount) {
    console.log(`Phát hiện phone/bank trong group ${msg.chat.title}: ${messageText.substring(0, 50)}...`);
    
    try {
      // Gửi typing action
      await bot.sendChatAction(chatId, 'typing');
      
      console.log(`Đang kiểm tra contact info: ${messageText}`);
      
      // Tìm admin từ phone/bank account
      const admin = findAdminByContact(messageText);
      
      // Tạo response message chuẩn với loại match phù hợp
      let matchType = 'phone'; // default
      if (admin && admin.matchType === 'bank') {
        matchType = 'bank';
      }
      const responseMessage = createStandardResponse(admin, matchType);
      
      if (admin) {
        console.log(`✅ Tìm thấy admin qua ${admin.matchType}: ${admin.name}`);
      } else {
        console.log(`❌ Không tìm thấy admin cho contact info`);
      }
      
      // Reply tin nhắn gốc với thông tin
      await bot.sendMessage(chatId, responseMessage, {
        reply_to_message_id: msg.message_id
      });
      
    } catch (error) {
      console.error('Lỗi khi xử lý contact info:', error);
      await bot.sendMessage(chatId, 
        '❌ Có lỗi xảy ra khi kiểm tra thông tin liên hệ. Vui lòng thử lại sau.', 
        { reply_to_message_id: msg.message_id }
      );
    }
  }
});

// Command /start cho bot
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `🤖 **CheckScam Bot đã sẵn sàng!**

Bot sẽ tự động kiểm tra khi có ai đó gửi link Facebook trong group.

**Tính năng:**
✅ Tự động phát hiện link FB
✅ Kiểm tra admin trong database CheckScam
✅ Hiển thị thông tin bảo hiểm
✅ Cảnh báo nếu không tìm thấy

**Cách sử dụng:**
Chỉ cần gửi link Facebook vào group, bot sẽ tự động phản hồi!`;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// Command /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `📋 **Hướng dẫn sử dụng CheckScam Bot**

**Tính năng tự động:**
🔍 **Facebook Link** - Paste link FB để kiểm tra admin
📱 **Số điện thoại** - Paste SĐT để kiểm tra admin  
🏦 **Số tài khoản** - Paste STK để kiểm tra admin

**Commands:**
/start - Khởi động bot
/help - Hiển thị hướng dẫn
/stats - Thống kê database admin
/sync - Sync data (chỉ admin bot)

**Ví dụ sử dụng:**
• Paste: https://facebook.com/profile.php?id=123456
• Paste: 0763666222
• Paste: 0491000133345
• Paste: "Check số này: 0763666222"

**Lưu ý:**
- Bot hoạt động trong group/supergroup và private chat
- Tự động reply khi phát hiện FB link, SĐT, hoặc STK
- Chỉ kiểm tra được admin có trong database CheckScam`;

  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Command /stats
bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  
  // Load admin mapping để lấy stats
  let adminMapping = {};
  try {
    const mappingData = fs.readFileSync('admin-facebook-mapping.json', 'utf8');
    adminMapping = JSON.parse(mappingData);
  } catch (error) {
    console.error('Không thể load admin mapping:', error.message);
  }
  
  const totalAdmins = Object.keys(adminMapping).length;
  const adminsWithFacebook = Object.values(adminMapping).filter(admin => admin.facebookUrl).length;
  const adminsWithoutFacebook = totalAdmins - adminsWithFacebook;
  
  const statsMessage = `📊 **Thống kê Database CheckScam**

👥 Tổng số Admin: ${totalAdmins}
📘 Có Facebook: ${adminsWithFacebook}
❌ Chưa có Facebook: ${adminsWithoutFacebook}
🛡️ Bảo hiểm: 80.000.000 VNĐ/admin
🔄 Cập nhật: ${new Date().toLocaleDateString('vi-VN')}

**Tỷ lệ coverage:** ${((adminsWithFacebook/totalAdmins)*100).toFixed(1)}%

Database được đồng bộ từ: admin.checkscam.vn`;

  bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
});

// Command /sync - Sync admin data (chỉ admin bot)
bot.onText(/\/sync/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Kiểm tra quyền admin (thay YOUR_ADMIN_ID bằng Telegram ID của bạn)
  const adminIds = [123456789]; // Thay bằng ID Telegram của bạn
  
  if (!adminIds.includes(userId)) {
    bot.sendMessage(chatId, '❌ Bạn không có quyền sử dụng lệnh này');
    return;
  }
  
  try {
    bot.sendMessage(chatId, '🔄 Đang sync admin data...');
    
    // Import sync function
    const { syncAdminData } = await import('./sync-admin-data.js');
    const result = await syncAdminData();
    
    const syncMessage = `✅ **Sync thành công!**

📊 Tổng admin: ${result.totalAdmins}
📘 Có Facebook: ${result.adminsWithFacebook}
📅 Cập nhật: ${new Date().toLocaleString('vi-VN')}

Bot đã reload data mới!`;

    bot.sendMessage(chatId, syncMessage, { parse_mode: 'Markdown' });
    
    // Reload admin mapping trong memory
    const fs = await import('fs');
    const mappingData = fs.readFileSync('admin-facebook-mapping.json', 'utf8');
    // Note: Cần restart bot để reload hoàn toàn, hoặc implement hot reload
    
  } catch (error) {
    console.error('Lỗi sync:', error);
    bot.sendMessage(chatId, '❌ Có lỗi khi sync data. Kiểm tra log.');
  }
});

// Error handling
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('🤖 CheckScam Telegram Bot đã khởi động!');
console.log('🔍 Bot sẽ tự động phát hiện Facebook URL, SĐT, và STK trong tin nhắn...');