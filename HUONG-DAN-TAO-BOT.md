# 🤖 Hướng dẫn tạo Bot Telegram từ A-Z

## Bước 1: Tạo Bot với BotFather

### 1.1 Mở Telegram và tìm BotFather
- Mở ứng dụng Telegram trên điện thoại hoặc máy tính
- Tìm kiếm: `@BotFather`
- Nhấn vào kết quả đầu tiên (có dấu tick xanh ✅)

### 1.2 Bắt đầu tạo bot
1. **Nhấn START** hoặc gửi `/start`
2. **Gửi lệnh tạo bot:** `/newbot`
3. **BotFather sẽ hỏi tên bot:**
   ```
   Alright, a new bot. How are we going to call it? 
   Please choose a name for your bot.
   ```
   - Nhập tên bot (ví dụ: `CheckScam Verify Bot`)

4. **BotFather sẽ hỏi username:**
   ```
   Good. Now let's choose a username for your bot. 
   It must end in `bot`. Like this, for example: TetrisBot or tetris_bot.
   ```
   - Nhập username (phải kết thúc bằng `bot`)
   - Ví dụ: `checkscam_verify_bot` hoặc `cs_check_bot`

### 1.3 Lấy Bot Token
Sau khi tạo thành công, BotFather sẽ gửi tin nhắn như này:
```
Done! Congratulations on your new bot. You will find it at 
t.me/checkscam_verify_bot. You can now add a description, 
about section and profile picture for your bot, see /help for a list of commands.

Use this token to access the HTTP API:
1234567890:ABCdefGHIjklMNOpqrsTUVwxyz-123456789

Keep your token secure and store it safely, it can be used by 
anyone to control your bot.
```

**⚠️ QUAN TRỌNG:** Lưu lại Bot Token này! Đây là chìa khóa để điều khiển bot.

## Bước 2: Cấu hình Bot (Tùy chọn)

### 2.1 Thêm mô tả cho bot
```
/setdescription
```
Chọn bot của bạn, sau đó nhập mô tả:
```
Bot tự động kiểm tra admin CheckScam khi có link Facebook trong group
```

### 2.2 Thêm thông tin About
```
/setabouttext
```
Nhập thông tin về bot:
```
🤖 CheckScam Verify Bot
✅ Tự động phát hiện link Facebook
✅ Kiểm tra admin trong database
✅ Hiển thị thông tin bảo hiểm
```

### 2.3 Thêm ảnh đại diện
```
/setuserpic
```
Chọn bot và upload ảnh đại diện

### 2.4 Thêm commands menu
```
/setcommands
```
Chọn bot và nhập danh sách commands:
```
start - Khởi động bot
help - Hướng dẫn sử dụng
stats - Thống kê database
test - Test với link Facebook ngẫu nhiên
```

## Bước 3: Cấu hình quyền Bot

### 3.1 Cho phép bot vào group
```
/setjoingroups
```
- Chọn bot của bạn
- Chọn `Enable` để bot có thể được thêm vào group

### 3.2 Cấu hình Group Privacy
```
/setprivacy
```
- Chọn bot của bạn  
- Chọn `Disable` để bot có thể đọc tất cả tin nhắn trong group
- (Cần thiết để bot tự động phát hiện link Facebook)

## Bước 4: Test Bot

### 4.1 Tìm bot của bạn
- Tìm kiếm username bot (ví dụ: `@checkscam_verify_bot`)
- Nhấn START để kích hoạt

### 4.2 Test cơ bản
- Gửi `/start` - Bot sẽ phản hồi nếu hoạt động
- Gửi `/help` - Xem danh sách lệnh

## Bước 5: Lấy thông tin Bot

### 5.1 Lấy Bot ID
```
/getme
```
BotFather sẽ hiển thị thông tin bot bao gồm ID

### 5.2 Lấy lại Token (nếu quên)
```
/token
```
Chọn bot để xem lại token

## Bước 6: Cài đặt code Bot

### 6.1 Tạo file .env
```bash
cd telegram-bot
cp .env.example .env
```

### 6.2 Thêm Bot Token vào .env
```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz-123456789
```

### 6.3 Cài đặt và chạy
```bash
npm install
npm start
```

## Bước 7: Thêm Bot vào Group

### 7.1 Thêm bot vào group
- Vào group Telegram
- Nhấn tên group → Add Members
- Tìm và thêm bot của bạn

### 7.2 Cấp quyền cho bot
- Vào Group Settings → Administrators
- Thêm bot làm admin (hoặc cấp quyền gửi tin nhắn)

### 7.3 Test trong group
- Gửi link Facebook bất kỳ
- Bot sẽ tự động phát hiện và phản hồi

## 🔧 Commands hữu ích khác của BotFather

```
/mybots - Xem danh sách bot của bạn
/deletebot - Xóa bot
/setname - Đổi tên bot
/setusername - Đổi username bot
/revoke - Tạo token mới (token cũ sẽ không dùng được)
/setinline - Cấu hình inline mode
/setinlinefeedback - Cấu hình inline feedback
```

## ⚠️ Lưu ý quan trọng

1. **Bảo mật Token:** Không chia sẻ Bot Token với ai
2. **Username duy nhất:** Mỗi username chỉ được dùng 1 lần
3. **Group Privacy:** Phải disable để bot đọc được tin nhắn
4. **Quyền admin:** Bot cần quyền gửi tin nhắn trong group
5. **Rate limit:** Telegram giới hạn số tin nhắn bot có thể gửi

## 🎯 Kết quả cuối cùng

Sau khi hoàn thành, bạn sẽ có:
- ✅ Bot Telegram hoạt động
- ✅ Bot tự động phát hiện link Facebook
- ✅ Bot kiểm tra admin CheckScam
- ✅ Bot reply với format chính xác
- ✅ Bot gửi card thông tin admin

**Chúc mừng! Bot của bạn đã sẵn sàng hoạt động! 🚀**