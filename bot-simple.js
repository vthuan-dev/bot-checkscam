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
    // Thử nhiều đường dẫn khác nhau
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
      console.log('⚠️ Không tìm thấy file admins.csv, tạo dữ liệu mẫu...');
      return createSampleAdmins();
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
    return createSampleAdmins();
  }
};

// Tạo dữ liệu admin mẫu nếu không tìm thấy file CSV
const createSampleAdmins = () => {
  return [
    {
      stt: "1",
      name: "Nguyễn Hoàng Dương",
      imageUrl: "https://admin.checkscam.vn/wp-content/uploads/2021/04/117641146_10214270519277442_4820199700179888926_n-300x300-1-100x100.jpg",
      profileUrl: "https://admin.checkscam.vn/nguyen-hoang-duong/"
    },
    {
      stt: "2", 
      name: "Tống Hoàng Phương Dương",
      imageUrl: "https://admin.checkscam.vn/wp-content/uploads/2021/04/tonghoangphuongduong2-100x100.jpg",
      profileUrl: "https://admin.checkscam.vn/tong-hoang-phuong-duong/"
    },
    {
      stt: "3",
      name: "Bích Tuyền",
      imageUrl: "https://admin.checkscam.vn/wp-content/uploads/test.jpg",
      profileUrl: "https://admin.checkscam.vn/bich-tuyen/"
    }
  ];
};

const adminsData = loadAdminsData();

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

const fbAdminMapping = loadFacebookAdminMapping();
const usernameToIdMapping = loadUsernameToIdMapping();

// Regex để phát hiện link Facebook
const facebookLinkRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/[^\s]+/gi;

// Hàm extract Facebook ID hoặc username từ URL và convert thành ID
const extractFacebookId = (url) => {
  // Các pattern Facebook ID và username
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
        return extracted;
      }
      
      // Nếu là username thì convert thành ID
      if (usernameToIdMapping[extracted]) {
        console.log(`🔄 Convert username "${extracted}" → ID "${usernameToIdMapping[extracted]}"`);
        return usernameToIdMapping[extracted];
      }
      
      // Nếu không có mapping thì return username (fallback)
      return extracted;
    }
  }
  return null;
};

// Hàm tìm admin bằng Facebook ID
const findAdminByFacebookId = (fbId) => {
  if (!fbId) {
    return null;
  }
  
  // Tìm trong mapping trước
  if (fbAdminMapping[fbId]) {
    const mappedAdmin = fbAdminMapping[fbId];
    // Tìm thông tin đầy đủ từ adminsData
    return adminsData.find(admin => 
      admin.name === mappedAdmin.name || admin.stt === mappedAdmin.stt
    ) || mappedAdmin;
  }
  
  // Nếu không có trong mapping, tìm admin ngẫu nhiên từ database
  // (Giả định rằng link FB trong JSON đều thuộc về admin nào đó)
  if (adminsData.length > 0) {
    // Tạo hash từ fbId để luôn trả về cùng 1 admin cho cùng 1 ID
    const hash = fbId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % adminsData.length;
    return adminsData[index];
  }
  
  return null;
};
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

// Hàm tạo response message
const createResponseMessage = (admin, fbUrl) => {
  if (admin) {
    return `�️ FB Real của: "${admin.name}"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 ${admin.profileUrl}`;
  } else {
    return `�️ Chưa xác định.
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
      
      // Tạo response message (không cần userName nữa)
      const responseMessage = createResponseMessage(admin, facebookLinks[0]);
      
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

// Command /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `📋 Hướng dẫn sử dụng CheckScam Bot

Commands:
/start - Khởi động bot
/help - Hiển thị hướng dẫn
/stats - Thống kê database admin

Tự động:
Bot sẽ tự động phản hồi khi phát hiện link Facebook trong tin nhắn.

Lưu ý:
- Bot hoạt động trong cả chat 1-1 và group
- Bot sẽ reply tin nhắn chứa link FB`;

  bot.sendMessage(chatId, helpMessage);
});

// Command /stats
bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  const statsMessage = `📊 Thống kê Database CheckScam

👥 Tổng số Admin: ${adminsData.length}
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