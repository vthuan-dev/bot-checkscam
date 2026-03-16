#!/bin/bash

# Script để start bot với nohup

echo "🚀 Starting CheckScam Bot with nohup..."

# Tạo thư mục logs
mkdir -p logs

# Kill process cũ nếu có
pkill -f "node bot.js" 2>/dev/null || true

# Start bot với nohup
nohup node bot.js > logs/bot.log 2>&1 &

# Lấy PID
BOT_PID=$!
echo $BOT_PID > logs/bot.pid

echo "✅ Bot started with PID: $BOT_PID"
echo "📝 View logs: tail -f logs/bot.log"
echo "⏹️  Stop bot: kill $BOT_PID"
echo "📊 Check process: ps aux | grep bot.js"