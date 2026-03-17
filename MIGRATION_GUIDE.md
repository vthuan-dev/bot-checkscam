# Migration Guide: Node.js → Python

Hướng dẫn chuyển đổi CheckScam Telegram Bot từ Node.js sang Python để tiết kiệm RAM.

## 📊 So sánh Performance

| Tiêu chí | Node.js | Python | Cải thiện |
|----------|---------|---------|-----------|
| **RAM Usage** | ~80-100MB | ~40-60MB | **-40% RAM** |
| **Startup Time** | ~2-3s | ~1-2s | Nhanh hơn |
| **CPU Usage** | 0.1-0.3% | 0.1-0.2% | Tương đương |
| **Dependencies** | 4 packages | 5 packages | Tương đương |
| **File Size** | ~15MB | ~8MB | Nhẹ hơn |

## 🔄 Quy trình Migration

### Bước 1: Backup dữ liệu hiện tại
```bash
# Backup trên VPS
cp admin-facebook-mapping.json admin-facebook-mapping.json.bak
cp admin-contact-mapping.json admin-contact-mapping.json.bak
cp .env .env.bak

# Backup PM2 config
pm2 save
```

### Bước 2: Cài đặt Python (nếu chưa có)
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install python3 python3-pip python3-venv

# CentOS/RHEL
sudo yum install python3 python3-pip

# Kiểm tra version
python3 --version  # Cần >= 3.8
```

### Bước 3: Setup Python Bot
```bash
# Cài đặt dependencies
python3 setup.py

# Hoặc manual
pip3 install -r requirements.txt
```

### Bước 4: Test Python Bot
```bash
# Test với simple version trước
python3 run.py simple

# Test full version
python3 run.py
```

### Bước 5: Deploy Production
```bash
# Stop Node.js bot
pm2 stop checkscam-bot

# Start Python bot
pm2 start "python3 run.py" --name checkscam-bot-python

# Monitor
pm2 logs checkscam-bot-python
pm2 monit
```

### Bước 6: Cleanup (sau khi confirm Python bot hoạt động tốt)
```bash
# Remove Node.js bot từ PM2
pm2 delete checkscam-bot

# Backup Node.js files
mkdir nodejs-backup
mv bot.js bot-simple.js package.json nodejs-backup/

# Save PM2 config
pm2 save
```

## 🔧 Cấu hình PM2 cho Python

### ecosystem.config.js cho Python
```javascript
module.exports = {
  apps: [{
    name: 'checkscam-bot-python',
    script: 'python3',
    args: 'run.py',
    cwd: '/path/to/telegram-bot',
    interpreter: 'none',
    env: {
      NODE_ENV: 'production'
    },
    max_memory_restart: '100M',  // Giảm từ 200M
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### Chạy với ecosystem
```bash
pm2 start ecosystem.config.js
```

## 📋 Checklist Migration

### Pre-Migration
- [ ] Backup tất cả file data (.json, .env)
- [ ] Test Python bot trên local/staging
- [ ] Kiểm tra Python version >= 3.8
- [ ] Cài đặt pip và virtual environment
- [ ] Verify bot token hoạt động

### During Migration
- [ ] Stop Node.js bot: `pm2 stop checkscam-bot`
- [ ] Start Python bot: `pm2 start "python3 run.py" --name checkscam-bot-python`
- [ ] Monitor logs: `pm2 logs checkscam-bot-python`
- [ ] Test bot trong Telegram group
- [ ] Kiểm tra RAM usage: `free -h`

### Post-Migration
- [ ] Bot phản hồi Facebook links ✅
- [ ] Bot phản hồi phone numbers ✅
- [ ] Bot phản hồi bank accounts ✅
- [ ] Commands hoạt động (/start, /help, /stats) ✅
- [ ] RAM usage giảm xuống ~40-60MB ✅
- [ ] Không có error trong logs ✅

## 🐛 Troubleshooting

### Bot không start
```bash
# Kiểm tra Python path
which python3

# Kiểm tra dependencies
pip3 list | grep telegram

# Chạy trực tiếp để debug
python3 bot.py
```

### Import errors
```bash
# Set PYTHONPATH
export PYTHONPATH=.
python3 bot.py

# Hoặc chạy từ đúng directory
cd telegram-bot
python3 bot.py
```

### Bot không phản hồi
```bash
# Kiểm tra logs
pm2 logs checkscam-bot-python

# Kiểm tra token
grep TELEGRAM_BOT_TOKEN .env

# Test connection
python3 -c "
import os
from dotenv import load_dotenv
load_dotenv()
print('Token:', os.getenv('TELEGRAM_BOT_TOKEN')[:10] + '...')
"
```

### RAM vẫn cao
```bash
# Kiểm tra process
ps aux | grep python

# Restart bot
pm2 restart checkscam-bot-python

# Sử dụng simple version
pm2 stop checkscam-bot-python
pm2 start "python3 run.py simple" --name checkscam-bot-simple
```

## 🔄 Rollback Plan

Nếu có vấn đề với Python bot:

```bash
# Stop Python bot
pm2 stop checkscam-bot-python
pm2 delete checkscam-bot-python

# Restore Node.js bot
cp nodejs-backup/* .
npm install
pm2 start bot.js --name checkscam-bot

# Restore data
cp admin-facebook-mapping.json.bak admin-facebook-mapping.json
cp admin-contact-mapping.json.bak admin-contact-mapping.json
cp .env.bak .env
```

## 📈 Monitoring sau Migration

### RAM Usage
```bash
# Kiểm tra RAM trước và sau
free -h

# Monitor real-time
watch -n 1 'free -h && echo "---" && ps aux | grep python'
```

### Bot Performance
```bash
# PM2 monitoring
pm2 monit

# Logs
pm2 logs checkscam-bot-python --lines 100

# Process info
pm2 show checkscam-bot-python
```

### Telegram Bot Stats
- Test các commands: `/start`, `/help`, `/stats`
- Test Facebook URL detection
- Test phone number detection  
- Test bank account detection
- Kiểm tra response time

## ✅ Success Criteria

Migration thành công khi:
1. **RAM usage giảm 30-50%** (từ ~100MB xuống ~50MB)
2. **Bot phản hồi chính xác** tất cả loại input
3. **Không có error** trong logs sau 24h
4. **Response time** tương đương hoặc nhanh hơn
5. **Uptime 99.9%** trong 1 tuần đầu

## 📞 Support

Nếu gặp vấn đề trong quá trình migration:
1. Kiểm tra logs: `pm2 logs checkscam-bot-python`
2. So sánh với Node.js version
3. Test từng module riêng lẻ
4. Sử dụng rollback plan nếu cần thiết