#!/bin/bash

echo "🚀 Starting CheckScam Bot with isolated Node.js..."

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 16 for bot
nvm use checkscam-bot

echo "📋 Current Node.js version: $(node --version)"

# Tạo thư mục logs
mkdir -p logs

# Stop bot cũ nếu có
pm2 stop checkscam-bot 2>/dev/null || true
pm2 delete checkscam-bot 2>/dev/null || true

# Reinstall dependencies với Node.js 16
echo "📦 Installing dependencies with Node.js 16..."
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Start bot với PM2 sử dụng wrapper script
echo "🔄 Starting bot with PM2..."
pm2 start run-bot.sh --name checkscam-bot --log logs/bot.log --error logs/error.log

# Save PM2 process list
pm2 save

echo "✅ Bot started successfully with Node.js $(node --version)!"
echo "📊 Check status: pm2 status"
echo "📝 View logs: pm2 logs checkscam-bot"
echo "🔄 Restart: pm2 restart checkscam-bot"
echo "⏹️  Stop: pm2 stop checkscam-bot"