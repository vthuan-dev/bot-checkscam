#!/bin/bash

echo "🔍 Checking Node.js versions on system..."

echo "📋 System Node.js version:"
/usr/bin/node --version 2>/dev/null || echo "System Node.js not found"

echo ""
echo "📋 NVM Node.js versions:"
if [ -d "$HOME/.nvm" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    echo "Available versions:"
    nvm list
    
    echo ""
    echo "Current version:"
    nvm current
    
    echo ""
    echo "Bot alias (checkscam-bot):"
    nvm version checkscam-bot 2>/dev/null || echo "Not set"
else
    echo "NVM not installed"
fi

echo ""
echo "📋 PM2 processes:"
pm2 list 2>/dev/null || echo "PM2 not running"