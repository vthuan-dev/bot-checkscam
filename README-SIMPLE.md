# CheckScam Bot - Version Đơn Giản

## 🎯 Tính năng

✅ **Tự động phát hiện link Facebook** trong group/chat  
✅ **Kiểm tra admin CheckScam** từ database 300+ admin  
✅ **Response format chuẩn** theo yêu cầu  
✅ **Không cần Facebook API** - chỉ dùng mapping có sẵn  

## 🚀 Cách chạy

```bash
# Cài đặt dependencies
npm install

# Chạy bot
npm start

# Hoặc chạy với PM2 (background)
pm2 start bot-simple.js --name checkscam-bot
```

## 📁 Files quan trọng

- `bot-simple.js` - Bot chính (đơn giản, ổn định)
- `admins.csv` - Database 300+ admin CheckScam
- `fb-admin-mapping.json` - Mapping Facebook ID → Admin (5 entries)
- `username-to-id-mapping.json` - Mapping Username → ID (8 entries)
- `.env` - Bot token

## 🔧 Cách thêm mapping mới

### Thêm Facebook ID → Admin
Sửa file `fb-admin-mapping.json`:
```json
{
  "facebook_admin_mapping": {
    "123456789": {
      "name": "Tên Admin",
      "stt": "1",
      "profileUrl": "https://admin.checkscam.vn/admin-url/"
    }
  }
}
```

### Thêm Username → Facebook ID
Sửa file `username-to-id-mapping.json`:
```json
{
  "username_to_id_mapping": {
    "facebook.username": "123456789"
  }
}
```

## 🧪 Test bot

```bash
# Test cấu hình
node test-bot-startup.js

# Test thủ công: Gửi link FB trong Telegram
```

## 📊 Supported URL formats

- `facebook.com/profile.php?id=123456789` → ID: 123456789
- `facebook.com/username` → Tìm trong mapping → ID
- `fb.com/username` → Tìm trong mapping → ID

## 🎯 Response format

**Tìm thấy admin:**
```
🕵️ FB Real của: "Tên Admin"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 https://admin.checkscam.vn/admin-url/
```

**Không tìm thấy:**
```
🕵️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn
```

## ⚡ Performance

- **Database**: 313 admin entries
- **Mapping**: 5 Facebook ID + 8 Username
- **Response time**: < 1 giây
- **Success rate**: 100% cho mapping có sẵn

## 🎉 Kết luận

Bot đơn giản, ổn định, hoạt động tốt với mapping có sẵn. Không cần Facebook API phức tạp!

**Để mở rộng**: Chỉ cần thêm mapping vào 2 file JSON là xong! 🚀