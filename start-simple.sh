#!/bin/bash

echo "🚀 Starting CheckScam Bot (Simple Mode)..."

# Tạo thư mục logs
mkdir -p logs

# Kill process cũ
pkill -f "node bot.js" 2>/dev/null || true

# Start bot với PM2 trực tiếp
pm2 start bot.js --name checkscam-bot --log logs/bot.log --error logs/error.log

# Save PM2 process list
pm2 save

echo "✅ Bot started successfully!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs checkscam-bot"
echo "🔄 Restart: pm2 restart checkscam-bot"
echo "⏹️  Stop: pm2 stop checkscam-bot"