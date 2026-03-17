// PM2 Ecosystem config cho CheckScam Telegram Bot Python Version
module.exports = {
  apps: [{
    name: 'checkscam-bot-python',
    script: 'python3',
    args: 'run.py',
    cwd: '/path/to/telegram-bot',  // Thay đổi path này
    interpreter: 'none',
    env: {
      PYTHONPATH: '.',
      PYTHONUNBUFFERED: '1'
    },
    env_production: {
      NODE_ENV: 'production',
      PYTHONPATH: '.',
      PYTHONUNBUFFERED: '1'
    },
    // Giảm memory limit vì Python ít RAM hơn
    max_memory_restart: '100M',  // Giảm từ 200M của Node.js
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Advanced options
    kill_timeout: 5000,
    listen_timeout: 3000,
    
    // Environment variables
    env_file: '.env'
  }, {
    // Simple version cho testing hoặc backup
    name: 'checkscam-bot-simple',
    script: 'python3',
    args: 'run.py simple',
    cwd: '/path/to/telegram-bot',  // Thay đổi path này
    interpreter: 'none',
    env: {
      PYTHONPATH: '.',
      PYTHONUNBUFFERED: '1'
    },
    max_memory_restart: '80M',  // Còn ít hơn nữa
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Disable by default
    disabled: true
  }]
};