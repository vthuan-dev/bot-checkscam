#!/bin/bash

echo "🚀 Optimizing VPS for 2GB RAM..."

# Update PM2 ecosystem config for more instances
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'telegram-bot-js',
      script: 'bot.js',
      instances: 2,  // Increased from 1
      exec_mode: 'cluster',
      max_memory_restart: '800M',  // Increased limit
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'telegram-bot-py',
      script: 'bot.py',
      interpreter: 'python3',
      instances: 1,
      max_memory_restart: '400M',
      env: {
        PYTHONPATH: '.'
      }
    }
  ]
};
EOF

# Optimize Node.js memory settings
export NODE_OPTIONS="--max-old-space-size=1024"

# Update system swappiness for better RAM usage
echo "vm.swappiness=10" >> /etc/sysctl.conf
sysctl -p

# Install htop for better monitoring
apt update && apt install -y htop

echo "✅ Optimization complete!"
echo "📊 Current RAM status:"
free -h

echo "🔧 To apply PM2 changes:"
echo "pm2 reload ecosystem.config.js"
echo "pm2 monit  # Monitor resource usage"