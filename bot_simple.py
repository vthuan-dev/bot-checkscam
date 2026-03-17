#!/usr/bin/env python3
"""
CheckScam Telegram Bot - Simple Python Version
Phiên bản đơn giản của bot, tương đương với bot-simple.js
"""

import os
import re
import json
import logging
from pathlib import Path
from typing import Optional, Dict, Any

from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Bot token
TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
if not TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN không được tìm thấy trong .env file")

# Load admin mapping
admin_mapping = {}
try:
    with open('admin-facebook-mapping.json', 'r', encoding='utf-8') as file:
        admin_mapping = json.load(file)
    logger.info(f"Đã load {len(admin_mapping)} admin từ mapping")
except Exception as error:
    logger.error(f"Không thể load admin mapping: {error}")

# Regex patterns
FACEBOOK_LINK_REGEX = re.compile(
    r'(https?://)?(www\.)?(facebook|fb)\.com/profile\.php\?id=\d+(?![a-zA-Z0-9])',
    re.IGNORECASE
)

def find_admin_by_facebook_url(facebook_url: str) -> Optional[Dict[str, Any]]:
    """Tìm admin từ Facebook URL"""
    try:
        # Extract Facebook ID từ URL
        id_match = re.search(r'(?:profile\.php\?id=|facebook\.com/)(\d+)', facebook_url)
        if not id_match:
            return None
        
        facebook_id = id_match.group(1)
        
        # Tìm admin có Facebook ID tương ứng
        for admin_name, admin_data in admin_mapping.items():
            if admin_data.get('facebookId') == facebook_id:
                return admin_data
        
        return None
    except Exception as error:
        logger.error(f"Lỗi khi tìm admin: {error}")
        return None

def create_standard_response(admin: Optional[Dict[str, Any]]) -> str:
    """Tạo response message chuẩn"""
    if admin:
        return f"""🕵️ FB Real của: "{admin['name']}"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 {admin['adminUrl']}"""
    else:
        return """🕵️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn"""

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Xử lý tin nhắn"""
    message_text = update.message.text or ''
    
    # Tìm link Facebook trong tin nhắn
    facebook_matches = FACEBOOK_LINK_REGEX.findall(message_text)
    
    if facebook_matches:
        # Lấy URL đầu tiên
        facebook_url = message_text
        if isinstance(facebook_matches[0], tuple):
            facebook_url = ''.join(facebook_matches[0])
        else:
            facebook_url = facebook_matches[0]
        
        logger.info(f"Phát hiện Facebook URL: {facebook_url}")
        
        try:
            # Gửi typing action
            await context.bot.send_chat_action(
                chat_id=update.effective_chat.id, 
                action='typing'
            )
            
            # Tìm admin
            admin = find_admin_by_facebook_url(facebook_url)
            
            # Tạo response
            response_message = create_standard_response(admin)
            
            if admin:
                logger.info(f"✅ Tìm thấy admin: {admin['name']}")
            else:
                logger.info("❌ Không tìm thấy admin")
            
            # Reply
            await update.message.reply_text(response_message)
            
        except Exception as error:
            logger.error(f"Lỗi khi xử lý: {error}")
            await update.message.reply_text(
                '❌ Có lỗi xảy ra khi kiểm tra link. Vui lòng thử lại sau.'
            )

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Command /start"""
    welcome_message = """🤖 **CheckScam Bot đã sẵn sàng!**

Bot sẽ tự động kiểm tra khi có ai đó gửi link Facebook trong group.

**Cách sử dụng:**
Chỉ cần gửi link Facebook vào group, bot sẽ tự động phản hồi!"""

    await update.message.reply_text(welcome_message, parse_mode='Markdown')

def main():
    """Main function"""
    # Tạo application
    application = Application.builder().token(TOKEN).build()
    
    # Thêm handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    # Chạy bot
    logger.info('🤖 CheckScam Telegram Bot (Simple) đã khởi động!')
    logger.info('🔍 Bot sẽ tự động phát hiện Facebook URL trong tin nhắn...')
    
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()