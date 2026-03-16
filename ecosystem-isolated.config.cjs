module.exports = {
  apps: [{
    name: 'checkscam-bot',
    script: 'run-bot.sh',
    cwd: '/opt/bot-checkscam/telegram-bot',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    interpreter: '/bin/bash',
    env: {
      NODE_ENV: 'production',
      NVM_DIR: process.env.HOME + '/.nvm'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};