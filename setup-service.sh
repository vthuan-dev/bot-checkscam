#!/bin/bash

# Script để setup systemd service

echo "🔧 Setting up CheckScam Bot as systemd service..."

# Copy service file
sudo cp checkscam-bot.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable service (auto start on boot)
sudo systemctl enable checkscam-bot

# Start service
sudo systemctl start checkscam-bot

echo "✅ Service setup complete!"
echo "📊 Check status: sudo systemctl status checkscam-bot"
echo "📝 View logs: sudo journalctl -u checkscam-bot -f"
echo "🔄 Restart: sudo systemctl restart checkscam-bot"
echo "⏹️  Stop: sudo systemctl stop checkscam-bot"