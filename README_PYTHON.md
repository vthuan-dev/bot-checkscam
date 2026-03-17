# CheckScam Telegram Bot - Python Version

Bot Telegram tự động kiểm tra admin CheckScam khi có link Facebook, số điện thoại, hoặc số tài khoản ngân hàng.

## 🚀 Cài đặt và chạy

### 1. Cài đặt Python dependencies
```bash
python setup.py
```

### 2. Cấu hình Bot Token
Cập nhật file `.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
```

### 3. Chạy bot
```bash
# Chạy bot full version (khuyến nghị)
python run.py

# Chạy bot simple version
python run.py simple

# Hoặc chạy trực tiếp
python bot.py
python bot_simple.py
```

## 📁 Cấu trúc file

```
telegram-bot/
├── bot.py                          # Bot chính (full features)
├── bot_simple.py                   # Bot đơn giản (chỉ Facebook)
├── facebook_admin_lookup.py        # Module tìm kiếm Facebook
├── contact_lookup.py               # Module tìm kiếm SĐT/STK
├── sync_admin_data.py              # Module đồng bộ data
├── run.py                          # Script chạy bot
├── setup.py                        # Script cài đặt
├── requirements.txt                # Python dependencies
├── .env                            # Cấu hình bot token
├── admin-facebook-mapping.json     # Data mapping Facebook
├── admin-contact-mapping.json      # Data mapping contact
└── README_PYTHON.md               # Hướng dẫn này
```

## 🔧 Tính năng

### Bot Full Version (`bot.py`)
- ✅ Tự động phát hiện Facebook URL
- ✅ Tự động phát hiện số điện thoại
- ✅ Tự động phát hiện số tài khoản ngân hàng
- ✅ Commands: `/start`, `/help`, `/stats`, `/sync`
- ✅ Hoạt động trong group và private chat
- ✅ Logging chi tiết

### Bot Simple Version (`bot_simple.py`)
- ✅ Chỉ phát hiện Facebook URL
- ✅ Nhẹ hơn, ít RAM hơn
- ✅ Command: `/start`

## 📊 So sánh với Node.js

| Tiêu chí | Node.js | Python |
|----------|---------|---------|
| RAM Usage | ~80-100MB | ~40-60MB |
| Startup Time | Nhanh | Nhanh hơn |
| Dependencies | 4 packages | 5 packages |
| Performance | Tốt | Tốt |
| Maintenance | Dễ | Dễ hơn |

## 🛠️ Development

### Test modules riêng lẻ
```bash
# Test Facebook lookup
python facebook_admin_lookup.py

# Test Contact lookup  
python contact_lookup.py

# Test Sync data
python sync_admin_data.py
```

### Debug bot
```bash
# Chạy với debug logging
export PYTHONPATH=.
python -c "import logging; logging.basicConfig(level=logging.DEBUG); from bot import main; main()"
```

## 📝 Cấu hình Data

### admin-facebook-mapping.json
```json
{
  "Admin Name": {
    "name": "Admin Name",
    "adminUrl": "https://admin.checkscam.vn/admin/123",
    "facebookUrl": "https://facebook.com/profile.php?id=123456789",
    "facebookId": "123456789"
  }
}
```

### admin-contact-mapping.json
```json
{
  "Admin Name": {
    "name": "Admin Name", 
    "adminUrl": "https://admin.checkscam.vn/admin/123",
    "phone": "0123456789",
    "bankAccounts": {
      "Vietcombank": "1234567890",
      "Techcombank": "0987654321"
    }
  }
}
```

## 🔄 Migration từ Node.js

1. **Backup data hiện tại:**
   ```bash
   cp admin-facebook-mapping.json admin-facebook-mapping.json.bak
   cp admin-contact-mapping.json admin-contact-mapping.json.bak
   ```

2. **Cài đặt Python version:**
   ```bash
   python setup.py
   ```

3. **Test trước khi deploy:**
   ```bash
   python run.py simple  # Test với bot đơn giản trước
   ```

4. **Deploy production:**
   ```bash
   # Stop Node.js bot
   pm2 stop checkscam-bot
   
   # Start Python bot
   pm2 start "python run.py" --name checkscam-bot-python
   ```

## 🚀 Deploy với PM2

```bash
# Cài đặt PM2 (nếu chưa có)
npm install -g pm2

# Start bot
pm2 start "python run.py" --name checkscam-bot-python

# Monitor
pm2 logs checkscam-bot-python
pm2 monit

# Auto restart on reboot
pm2 startup
pm2 save
```

## 🐛 Troubleshooting

### Bot không phản hồi
1. Kiểm tra token trong `.env`
2. Kiểm tra bot có quyền trong group
3. Xem logs: `pm2 logs checkscam-bot-python`

### Không tìm thấy admin
1. Kiểm tra file `admin-facebook-mapping.json`
2. Kiểm tra format Facebook URL
3. Test module: `python facebook_admin_lookup.py`

### Lỗi import module
```bash
export PYTHONPATH=.
python bot.py
```

## 📈 Performance Tips

1. **Sử dụng bot simple** nếu chỉ cần Facebook lookup
2. **Giới hạn logging** trong production
3. **Optimize JSON files** - remove unused fields
4. **Monitor RAM usage** với `htop` hoặc `pm2 monit`

## 🔐 Security

- ✅ Bot token được lưu trong `.env` (không commit)
- ✅ Validate input trước khi process
- ✅ Rate limiting tự động từ python-telegram-bot
- ✅ Error handling đầy đủ

## 📞 Support

Nếu có vấn đề, hãy:
1. Kiểm tra logs: `pm2 logs checkscam-bot-python`
2. Test modules riêng lẻ
3. So sánh với Node.js version để debug