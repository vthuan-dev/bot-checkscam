#!/bin/bash

# Bot Manager Script

BOT_NAME="checkscam-bot"
BOT_DIR="/opt/bot-checkscam/telegram-bot"

case "$1" in
    start)
        echo "🚀 Starting $BOT_NAME..."
        cd $BOT_DIR
        pm2 start ecosystem.config.js
        ;;
    stop)
        echo "⏹️  Stopping $BOT_NAME..."
        pm2 stop $BOT_NAME
        ;;
    restart)
        echo "🔄 Restarting $BOT_NAME..."
        pm2 restart $BOT_NAME
        ;;
    status)
        echo "📊 Status of $BOT_NAME:"
        pm2 status $BOT_NAME
        ;;
    logs)
        echo "📝 Logs of $BOT_NAME:"
        pm2 logs $BOT_NAME
        ;;
    update)
        echo "🔄 Updating bot..."
        cd $BOT_DIR
        git pull
        npm install
        pm2 restart $BOT_NAME
        echo "✅ Bot updated and restarted!"
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs|update}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the bot"
        echo "  stop    - Stop the bot"
        echo "  restart - Restart the bot"
        echo "  status  - Show bot status"
        echo "  logs    - Show bot logs"
        echo "  update  - Update and restart bot"
        exit 1
        ;;
esac