#!/bin/bash

echo "🚀 Deploying Python Bot to VPS..."

# 1. Stop current bot (if running)
echo "⏹️  Stopping current bot..."
pm2 stop checkscam-bot 2>/dev/null || echo "No bot running"
pm2 delete checkscam-bot 2>/dev/null || echo "No bot to delete"

# 2. Backup current .env (important!)
echo "💾 Backing up .env file..."
cp .env .env.backup 2>/dev/null || echo "No .env to backup"

# 3. Force pull latest code from GitHub
echo "📥 Force pulling latest code..."
git fetch origin
git reset --hard origin/main
git clean -fd

# 4. Restore .env file
echo "🔧 Restoring .env file..."
cp .env.backup .env 2>/dev/null || echo "No .env backup found"

# 5. Install Python dependencies
echo "📦 Installing Python dependencies..."
python3 -m pip install --upgrade pip
python3 -m pip install -r requirements.txt

# 6. Test bot startup
echo "🧪 Testing bot startup..."
timeout 10s python3 run.py simple &
sleep 5
pkill -f "python3 run.py" 2>/dev/null

# 7. Start bot with PM2
echo "🚀 Starting bot with PM2..."
pm2 start "python3 run.py" --name checkscam-bot-python --max-memory-restart 100M

# 8. Show status
echo "📊 Bot status:"
pm2 list
pm2 logs checkscam-bot-python --lines 10

echo "✅ Deployment complete!"
echo "📝 Commands:"
echo "  pm2 logs checkscam-bot-python  # View logs"
echo "  pm2 restart checkscam-bot-python  # Restart bot"
echo "  pm2 monit  # Monitor resources"