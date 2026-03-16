import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Load danh sách admin từ CSV
const loadAdminsData = () => {
  try {
    const possiblePaths = [
      path.join(process.cwd(), '../src/admins.csv'),
      path.join(process.cwd(), 'admins.csv'),
      path.join(process.cwd(), 'src/admins.csv'),
      './admins.csv'
    ];
    
    let csvContent = '';
    let usedPath = '';
    
    for (const csvPath of possiblePaths) {
      try {
        csvContent = fs.readFileSync(csvPath, 'utf8');
        usedPath = csvPath;
        break;
      } catch (err) {
        continue;
      }
    }
    
    if (!csvContent) {
      console.log('⚠️ Không tìm thấy file admins.csv');
      return [];
    }
    
    console.log(`📁 Đã tìm thấy file: ${usedPath}`);
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

// Load mapping Facebook ID với admin
const loadFacebookAdminMapping = () => {
  try {
    const mappingPath = path.join(process.cwd(), 'fb-admin-mapping.json');
    const mappingContent = fs.readFileSync(mappingPath, 'utf8');
    const data = JSON.parse(mappingContent);
    console.log(`📱 Đã load ${Object.keys(data.facebook_admin_mapping).length} Facebook ID mapping`);
    return data.facebook_admin_mapping;
  } catch (error) {
    console.error('Lỗi khi load Facebook mapping:', error);
    return {};
  }
};

// Load mapping username → ID
const loadUsernameToIdMapping = () => {
  try {
    const mappingPath = path.join(process.cwd(), 'username-to-id-mapping.json');
    const mappingContent = fs.readFileSync(mappingPath, 'utf8');
    const data = JSON.parse(mappingContent);
    console.log(`🔄 Đã load ${Object.keys(data.username_to_id_mapping).length} username mapping`);
    return data.username_to_id_mapping;
  } catch (error) {
    console.error('Lỗi khi load username mapping:', error);
    return {};
  }
};

const adminsData = loadAdminsData();
const fbAdminMapping = loadFacebookAdminMapping();
const usernameToIdMapping = loadUsernameToIdMapping();

// Regex để phát hiện link Facebook
const facebookLinkRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/[^\s]+/gi;

// Hàm extract Facebook ID từ URL
const extractFacebookId = (url) => {
  const patterns = [
    /(?:profile\.php\?id=)(\d+)/,           // profile.php?id=123456789
    /facebook\.com\/(\d+)/,                 // facebook.com/123456789
    /fb\.com\/(\d+)/,                       // fb.com/123456789
    /facebook\.com\/([a-zA-Z0-9._]+)\/?$/,  // facebook.com/username
    /fb\.com\/([a-zA-Z0-9._]+)\/?$/         // fb.com/username
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const extracted = match[1];
      
      // Nếu là số thì return luôn
      if (/^\d+$/.test(extracted)) {
        console.log(`✅ Facebook ID found: ${extracted}`);
        return extracted;
      }
      
      // Nếu là username thì convert thành ID
      console.log(`🔍 Username detected: ${extracted}`);
      
      if (usernameToIdMapping[extracted]) {
        console.log(`🔄 Convert username "${extracted}" → ID "${usernameToIdMapping[extracted]}"`);
        return usernameToIdMapping[extracted];
      }
      
      // Fallback: return username
      console.log(`⚠️ Username "${extracted}" chưa có mapping, sử dụng fallback`);
      return extracted;
    }
  }
  return null;
};

// Hàm tìm admin bằng Facebook ID
const findAdminByFacebookId = (fbId) => {
  if (!fbId) return null;
  
  // Tìm trong mapping trước
  if (fbAdminMapping[fbId]) {
    const mappedAdmin = fbAdminMapping[fbId];
    // Tìm thông tin đầy đủ từ adminsData
    return adminsData.find(admin => 
      admin.name === mappedAdmin.name || admin.stt === mappedAdmin.stt
    ) || mappedAdmin;
  }
  
  return null;
};

// Hàm tạo response message
const createResponseMessage = (admin) => {
  if (admin) {
    return `🕵️ FB Real của: "${admin.name}"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 ${admin.profileUrl}`;
  } else {
    return `🕵️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn`;
  }
};

// Lắng nghe tất cả tin nhắn
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text || '';
  
  // Xử lý cả private chat và group chat
  if (msg.chat.type !== 'group' && msg.chat.type !== 'supergroup' && msg.chat.type !== 'private') {
    return;
  }
  
  // Tìm link Facebook trong tin nhắn
  const facebookLinks = messageText.match(facebookLinkRegex);
  
  if (facebookLinks && facebookLinks.length > 0) {
    console.log(`Phát hiện link Facebook: ${facebookLinks[0]}`);
    
    try {
      // Gửi typing action
      await bot.sendChatAction(chatId, 'typing');
      
      // Extract Facebook ID từ link
      const fbId = extractFacebookId(facebookLinks[0]);
      console.log(`🔍 Facebook ID extracted: ${fbId}`);
      
      // Tìm admin bằng Facebook ID
      const admin = findAdminByFacebookId(fbId);
      
      if (admin) {
        console.log(`✅ Tìm thấy admin: ${admin.name}`);
      } else {
        console.log(`❌ Không tìm thấy admin cho FB ID: ${fbId}`);
      }
      
      // Tạo response message
      const responseMessage = createResponseMessage(admin);
      
      // Reply tin nhắn gốc
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

// Command /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `🤖 CheckScam Bot đã sẵn sàng!

Bot sẽ tự động kiểm tra khi có ai đó gửi link Facebook.

Tính năng:
✅ Tự động phát hiện link FB
✅ Kiểm tra admin trong database CheckScam
✅ Hiển thị thông tin bảo hiểm
✅ Cảnh báo nếu không tìm thấy

Cách sử dụng:
Chỉ cần gửi link Facebook, bot sẽ tự động phản hồi!`;

  bot.sendMessage(chatId, welcomeMessage);
});

// Command /stats
bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  const statsMessage = `📊 Thống kê Database CheckScam

👥 Tổng số Admin: ${adminsData.length}
📱 Facebook ID Mapping: ${Object.keys(fbAdminMapping).length}
🔄 Username Mapping: ${Object.keys(usernameToIdMapping).length}
🛡️ Bảo hiểm: 80.000.000 VNĐ/admin
🔄 Cập nhật: ${new Date().toLocaleDateString('vi-VN')}

Database được đồng bộ từ: admin.checkscam.vn`;

  bot.sendMessage(chatId, statsMessage);
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
console.log(`📱 Đã load ${Object.keys(fbAdminMapping).length} Facebook ID mapping`);
console.log(`🔄 Đã load ${Object.keys(usernameToIdMapping).length} username → ID mapping`);
console.log('🔍 Bot sẽ tự động phát hiện link Facebook...');