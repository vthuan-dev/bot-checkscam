#!/bin/bash

# Script để start bot trên server

echo "🚀 Starting CheckScam Telegram Bot..."

# Tạo thư mục logs nếu chưa có
mkdir -p logs

# Cài đặt PM2 nếu chưa có
if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# Stop bot cũ nếu đang chạy
pm2 stop checkscam-bot 2>/dev/null || true
pm2 delete checkscam-bot 2>/dev/null || true

# Start bot với PM2
echo "🔄 Starting bot with PM2..."
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 startup (chạy khi server restart)
pm2 startup

echo "✅ Bot started successfully!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs checkscam-bot"
echo "🔄 Restart: pm2 restart checkscam-bot"
echo "⏹️  Stop: pm2 stop checkscam-bot"