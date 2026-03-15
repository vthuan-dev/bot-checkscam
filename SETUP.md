# Hướng dẫn Setup Bot Telegram CheckScam

## Bước 1: Tạo Bot Telegram

1. **Mở Telegram và tìm @BotFather**
2. **Gửi lệnh `/newbot`**
3. **Đặt tên bot** (ví dụ: CheckScam Bot)
4. **Đặt username** (ví dụ: checkscam_verify_bot)
5. **Lưu Bot Token** (dạng: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)

## Bước 2: Cài đặt Dependencies

```bash
cd telegram-bot
npm install
```

## Bước 3: Cấu hình Environment

```bash
# Copy file .env.example thành .env
cp .env.example .env

# Sửa file .env và thêm Bot Token
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

## Bước 4: Test Bot

```bash
# Chạy test để kiểm tra
node test-bot.js

# Kết quả mong đợi:
# ✅ 10/10 link được phát hiện
# ✅ Tìm kiếm admin hoạt động
```

## Bước 5: Chạy Bot

```bash
# Chạy bot
npm start

# Hoặc chạy development mode (auto restart)
npm run dev
```

## Bước 6: Thêm Bot vào Group

1. **Invite bot vào group Telegram**
2. **Cấp quyền gửi tin nhắn cho bot**
3. **Test bằng cách gửi link Facebook**

## Commands Bot

- `/start` - Khởi động bot
- `/help` - Hướng dẫn sử dụng
- `/stats` - Thống kê database
- `/test` - Test với link Facebook ngẫu nhiên

## Cách hoạt động

1. **Tự động phát hiện** - Bot tự động phát hiện link Facebook trong tin nhắn
2. **Không cần tag** - Không cần gõ @bot
3. **Reply tin nhắn gốc** - Bot reply đúng tin nhắn chứa link
4. **Kiểm tra admin** - So sánh với database CheckScam
5. **Hiển thị kết quả** - Thông tin bảo hiểm hoặc cảnh báo

## Ví dụ hoạt động

### Trường hợp tìm thấy admin:
```
User: https://www.facebook.com/share/1EBScXCjWK/?mibextid=wwXIfr

Bot: 👤 Huy Đình
https://www.facebook.com/share/1EBScXCjWK/?mibextid=wwXIfr

⭐ FB Real của: "Bích Tuyền"
⭐ GDV này có bảo hiểm tại Checkscam.vn
🔗 https://admin.checkscam.vn/bich-tuyen/

🛡️ QUỸ BẢO HIỂM CHECKSCAM.VN
[Bích Tuyền] BH 80.000.000.vnđ tại Checkscam.vn

+ Gửi kèm ảnh card thông tin admin
```

### Trường hợp không tìm thấy:
```
User: https://www.facebook.com/share/1HEUVGn...

Bot: 👤 Lê Nam
https://www.facebook.com/share/1HEUVGn...

⚠️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn
```

## Troubleshooting

### Bot không phản hồi:
- Kiểm tra Bot Token trong .env
- Kiểm tra bot có quyền gửi tin nhắn trong group
- Xem log console có lỗi gì

### Không phát hiện link Facebook:
- Kiểm tra format link có đúng không
- Xem regex có match không (chạy test-bot.js)

### Không tìm thấy admin:
- Kiểm tra file admins.csv có tồn tại
- Kiểm tra tên admin có trong database không

## File cấu trúc

```
telegram-bot/
├── bot.js              # File chính của bot
├── test-bot.js         # File test các chức năng
├── facebook-links.json # Danh sách link FB để test
├── package.json        # Dependencies
├── .env               # Cấu hình (tạo từ .env.example)
└── README.md          # Hướng dẫn chi tiết
```

## Lưu ý quan trọng

- Bot chỉ hoạt động trong group/supergroup
- Cần kết nối internet để truy cập Facebook
- Database admin được load từ file CSV trong project chính
- Bot sẽ tự động reply tin nhắn chứa link Facebook