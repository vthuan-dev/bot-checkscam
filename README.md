# Bot CheckScam Telegram

Bot Telegram tự động phát hiện và kiểm tra link Facebook trong group, so sánh với database admin CheckScam.

## Tính năng

- ✅ **Tự động phát hiện** link Facebook trong tin nhắn group
- ✅ **Không cần tag** bot (@bot) - hoạt động tự động
- ✅ **Kiểm tra admin** trong database CheckScam
- ✅ **Hiển thị thông tin bảo hiểm** nếu là admin hợp lệ
- ✅ **Cảnh báo** nếu không tìm thấy trong danh sách
- ✅ **Reply tin nhắn gốc** để dễ theo dõi

## Cài đặt

1. **Clone repository:**
   ```bash
   git clone https://github.com/vthuan-dev/bot-checkscam.git
   cd bot-checkscam
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Cấu hình environment:**
   ```bash
   cp .env.example .env
   # Sửa file .env và thêm Bot Token từ @BotFather
   ```

4. **Chạy bot:**
   ```bash
   npm start
   ```

## Cấu hình Bot Token

Tạo file `.env` với nội dung:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
CHECKSCAM_API_URL=https://admin.checkscam.vn
```

## Sử dụng

1. **Thêm bot vào group Telegram**
2. **Cấp quyền gửi tin nhắn cho bot**
3. **Gửi link Facebook** - bot sẽ tự động phản hồi

## Commands

- `/start` - Khởi động bot
- `/help` - Hướng dẫn sử dụng  
- `/stats` - Thống kê database admin
- `/test` - Test với link Facebook ngẫu nhiên

## Ví dụ hoạt động

### Trường hợp tìm thấy admin:
```
User: https://www.facebook.com/profile.php?id=123456789

Bot: 👤 Tên User
https://www.facebook.com/profile.php?id=123456789

⭐ FB Real của: "Tên Admin"
⭐ GDV này có bảo hiểm tại Checkscam.vn
🔗 https://admin.checkscam.vn/admin-profile/

🛡️ QUỸ BẢO HIỂM CHECKSCAM.VN
[Tên Admin] BH 80.000.000.vnđ tại Checkscam.vn
```

### Trường hợp không tìm thấy:
```
User: https://www.facebook.com/profile.php?id=123456789

Bot: 👤 Tên User
https://www.facebook.com/profile.php?id=123456789

⚠️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn
```

## Lưu ý

- Bot hoạt động trong cả chat 1-1 và group
- Cần kết nối internet để truy cập Facebook
- Database admin được load từ file CSV
- Bot tự động reply tin nhắn chứa link Facebook

## License

MIT License