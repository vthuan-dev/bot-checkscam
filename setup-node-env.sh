#!/bin/bash

echo "🔧 Setting up isolated Node.js environment for CheckScam Bot..."

# Cài đặt nvm nếu chưa có
if [ ! -d "$HOME/.nvm" ]; then
    echo "📦 Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
else
    echo "✅ NVM already installed"
    # Load nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
fi

# Cài Node.js 16 LTS cho bot
echo "📦 Installing Node.js 16 LTS..."
nvm install 16
nvm alias checkscam-bot 16

echo "✅ Node.js 16 installed for bot!"
echo "Current Node version: $(nvm current)"

# Tạo script wrapper để chạy bot với Node.js 16
echo "📝 Creating bot wrapper script..."

cat > run-bot.sh << 'EOF'
#!/bin/bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 16 for this bot
nvm use checkscam-bot

# Run the bot
node bot.js
EOF

chmod +x run-bot.sh

echo "✅ Setup completed!"
echo "🚀 To run bot: ./run-bot.sh"
echo "📊 To check Node version: nvm current"