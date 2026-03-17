#!/bin/bash

echo "⚡ Quick VPS Update..."

# Backup .env
cp .env .env.backup 2>/dev/null

# Force pull
git fetch origin
git reset --hard origin/main

# Restore .env  
cp .env.backup .env 2>/dev/null

# Restart bot
pm2 restart checkscam-bot-python 2>/dev/null || pm2 start "python3 run.py" --name checkscam-bot-python

echo "✅ Updated!"