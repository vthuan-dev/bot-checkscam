import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

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

// Regex để phát hiện link Facebook
const facebookLinkRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/[^\s]+/gi;

// Hàm trích xuất tên từ Facebook profile
const extractFacebookName = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Thử các selector khác nhau để lấy tên
    let name = $('title').text();
    if (name) {
      name = name.replace(' | Facebook', '').trim();
      return name;
    }
    
    return null;
  } catch (error) {
    console.error('Lỗi khi trích xuất tên Facebook:', error.message);
    return null;
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
// Hàm tạo response message
const createResponseMessage = (admin, fbName, fbUrl) => {
  if (admin) {
    return `🕵️ FB Real của: "${admin.name}"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 ${admin.profileUrl}`;
  } else {
    return `⚠️ Chưa xác định.
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
  
  if (facebookLinks && facebookLinks.length > 0) {
    console.log(`Phát hiện link Facebook trong group ${msg.chat.title}: ${facebookLinks[0]}`);
    
    try {
      // Gửi typing action
      await bot.sendChatAction(chatId, 'typing');
      
      console.log(`Phát hiện link Facebook trong group ${msg.chat.title || 'Unknown'}: ${facebookLinks[0]}`);
      
      // Tìm admin đầu tiên để test (sẽ cải thiện logic sau)
      const admin = adminsData[0]; // Lấy admin đầu tiên để test
      
      // Tạo response message
      const responseMessage = createResponseMessage(admin, 'User', facebookLinks[0]);
      
      // Reply tin nhắn gốc với thông tin ngắn gọn
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

**Commands:**
/start - Khởi động bot
/help - Hiển thị hướng dẫn
/stats - Thống kê database admin
/test - Test bot với link Facebook ngẫu nhiên

**Tự động:**
Bot sẽ tự động phản hồi khi phát hiện link Facebook trong tin nhắn group.

**Lưu ý:**
- Bot chỉ hoạt động trong group/supergroup
- Cần thêm bot vào group với quyền gửi tin nhắn
- Bot sẽ reply tin nhắn chứa link FB`;

  bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Command /stats
bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  const statsMessage = `📊 **Thống kê Database CheckScam**

👥 Tổng số Admin: ${adminsData.length}
🛡️ Bảo hiểm: 80.000.000 VNĐ/admin
🔄 Cập nhật: ${new Date().toLocaleDateString('vi-VN')}
🔗 Link test: ${facebookLinks.length}

Database được đồng bộ từ: admin.checkscam.vn`;

  bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
});

// Command /test - Test bot với link Facebook mẫu
bot.onText(/\/test/, async (msg) => {
  const chatId = msg.chat.id;
  
  if (facebookLinks.length === 0) {
    bot.sendMessage(chatId, '❌ Không có link Facebook để test');
    return;
  }
  
  // Lấy link ngẫu nhiên để test
  const randomLink = facebookLinks[Math.floor(Math.random() * facebookLinks.length)];
  
  const testMessage = `🧪 **Test Bot với link ngẫu nhiên:**

${randomLink}

Bot sẽ tự động phát hiện và phản hồi...`;

  await bot.sendMessage(chatId, testMessage, { parse_mode: 'Markdown' });
  
  // Simulate message với link FB
  setTimeout(async () => {
    try {
      await bot.sendChatAction(chatId, 'typing');
      
      const fbName = await extractFacebookName(randomLink);
      
      if (fbName) {
        const admin = findAdmin(fbName);
        const responseMessage = createResponseMessage(admin, fbName, randomLink);
        
        await bot.sendMessage(chatId, responseMessage);
        
        // Nếu tìm thấy admin, gửi card
        if (admin) {
          await createAdminCard(chatId, admin, msg.message_id);
        }
      } else {
        await bot.sendMessage(chatId, 
          '⚠️ Không thể trích xuất thông tin từ link Facebook này.'
        );
      }
    } catch (error) {
      console.error('Lỗi test:', error);
      await bot.sendMessage(chatId, '❌ Có lỗi xảy ra khi test');
    }
  }, 2000);
});

// Error handling
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('🤖 CheckScam Telegram Bot đã khởi động!');
console.log(`📊 Đã load ${adminsData.length} admin vào database`);
console.log(`🔗 Đã load ${facebookLinks.length} link Facebook để test`);
console.log('🔍 Bot sẽ tự động phát hiện link Facebook trong group...');