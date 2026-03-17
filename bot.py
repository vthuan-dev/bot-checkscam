#!/usr/bin/env python3
"""
CheckScam Telegram Bot - Python Version
Bot tự động kiểm tra admin CheckScam khi có link Facebook, SĐT, hoặc STK
"""

import os
import re
import json
import csv
import logging
from pathlib import Path
from typing import Optional, Dict, Any
from datetime import datetime

from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
from dotenv import load_dotenv

from facebook_admin_lookup import find_admin_by_facebook_url, format_admin_info
from contact_lookup import find_admin_by_contact, format_admin_contact_info

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

# Global data
admins_data = []
facebook_links = []

def load_admins_data():
    """Load danh sách admin từ CSV"""
    global admins_data
    try:
        # Thử các đường dẫn có thể có
        possible_paths = [
            Path('admins.csv'),           # Cùng thư mục
            Path('../src/admins.csv'),    # Thư mục src
            Path('./admins.csv')          # Current directory
        ]
        
        csv_path = None
        for path in possible_paths:
            if path.exists():
                csv_path = path
                break
        
        if not csv_path:
            logger.warning("Không tìm thấy file admins.csv, sử dụng dữ liệu rỗng")
            return []
        
        admins_data = []
        
        with open(csv_path, 'r', encoding='utf-8') as file:
            csv_reader = csv.reader(file)
            next(csv_reader)  # Skip header
            
            for row in csv_reader:
                if len(row) >= 4 and row[0].strip():
                    stt, name, image_url, profile_url = [col.strip().strip('"') for col in row[:4]]
                    admins_data.append({
                        'stt': stt,
                        'name': name,
                        'imageUrl': image_url,
                        'profileUrl': profile_url
                    })
        
        logger.info(f"Đã load {len(admins_data)} admin từ {csv_path}")
        return admins_data
    except Exception as error:
        logger.error(f"Lỗi khi load dữ liệu admin: {error}")
        return []

def load_facebook_links():
    """Load danh sách Facebook links từ JSON (để test)"""
    global facebook_links
    try:
        json_path = Path('facebook-links.json')
        with open(json_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            facebook_links = data.get('facebook_links', [])
        return facebook_links
    except Exception as error:
        logger.error(f"Lỗi khi load Facebook links: {error}")
        return []

# Load data
admins_data = load_admins_data()
facebook_links = load_facebook_links()

# Regex patterns
FACEBOOK_LINK_REGEX = re.compile(
    r'https?://(?:www\.)?(?:facebook|fb)\.com/(?:profile\.php\?id=\d+|[\w\.]+)',
    re.IGNORECASE
)
PHONE_REGEX = re.compile(r'(?:^|\s)((?:0|\+84)[0-9]{8,10})(?=\s|$)')
BANK_ACCOUNT_REGEX = re.compile(r'(?:^|\s)(\d{10,20})(?=\s|$)')

def get_telegram_user_name(update: Update) -> str:
    """Hàm trích xuất tên từ Telegram user"""
    user = update.effective_user
    if user.first_name and user.last_name:
        return f"{user.first_name} {user.last_name}"
    elif user.first_name:
        return user.first_name
    elif user.username:
        return f"@{user.username}"
    else:
        return "User"

def find_admin(search_name: str) -> Optional[Dict[str, Any]]:
    """Hàm tìm kiếm admin trong database"""
    if not search_name:
        return None
    
    # Normalize Vietnamese characters
    def normalize_vietnamese(text: str) -> str:
        text = text.lower()
        replacements = {
            'àáạảãâầấậẩẫăằắặẳẵ': 'a',
            'èéẹẻẽêềếệểễ': 'e',
            'ìíịỉĩ': 'i',
            'òóọỏõôồốộổỗơờớợởỡ': 'o',
            'ùúụủũưừứựửữ': 'u',
            'ỳýỵỷỹ': 'y',
            'đ': 'd'
        }
        for chars, replacement in replacements.items():
            for char in chars:
                text = text.replace(char, replacement)
        return text
    
    normalized_search = normalize_vietnamese(search_name)
    
    for admin in admins_data:
        normalized_admin_name = normalize_vietnamese(admin['name'])
        if (normalized_admin_name in normalized_search or 
            normalized_search in normalized_admin_name):
            return admin
    
    return None

async def create_admin_card(context: ContextTypes.DEFAULT_TYPE, chat_id: int, admin: Dict[str, Any], message_id: int):
    """Hàm tạo card thông tin admin (nếu tìm thấy)"""
    if not admin or not admin.get('imageUrl'):
        return
    
    try:
        card_text = f"""🛡️ QUỸ BẢO HIỂM CHECKSCAM.VN

{admin['name']}

Thông Tin Bảo Hiểm:
📱 Fb (chính): {admin['stt']}
📱 Fb (phụ): 
📞 Inbox Zalo: 
🏪 Shop trên Cs:

Quỹ Bảo Hiểm CS:
Từ ngày 10/07/2025 CS sẽ bảo đảm an toàn cho bạn với số tiền trong Quỹ Bảo Hiểm 80.000.000 vnđ của {admin['name']}"""

        # Gửi ảnh với caption
        await context.bot.send_photo(
            chat_id=chat_id,
            photo=admin['imageUrl'],
            caption=card_text,
            reply_to_message_id=message_id
        )
    except Exception as error:
        logger.error(f"Lỗi khi gửi card admin: {error}")

def create_standard_response(admin: Optional[Dict[str, Any]], match_type: str = 'facebook') -> str:
    """
    Tạo response message chuẩn cho bot dựa trên loại match
    """
    if admin:
        prefix_map = {
            'facebook': '🕵️ FB Real của:',
            'phone': '🕵️ SĐT của:',
            'bank': '🕵️ STK của:'
        }
        
        prefix = prefix_map.get(match_type, '🕵️ FB Real của:')
        admin_url = admin.get('adminUrl', admin.get('profileUrl', ''))
        
        return f"""{prefix} "{admin['name']}"
🎖 GDV này có bảo hiểm tại Checkscam.vn
🔗 {admin_url}"""
    else:
        return """🕵️ Chưa xác định.
❌ Không phải GDV của Checkscam.vn"""

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Lắng nghe tất cả tin nhắn trong group"""
    chat_id = update.effective_chat.id
    message_text = update.message.text or ''
    
    # Debug log
    logger.info(f"📨 Nhận tin nhắn từ {update.effective_chat.type}: {message_text[:50]}...")
    logger.info(f"👤 User: {update.effective_user.first_name}, Chat ID: {chat_id}")
    
    # Xử lý cả private chat và group chat
    if update.effective_chat.type not in ['group', 'supergroup', 'private']:
        return
    
    # Tìm link Facebook trong tin nhắn
    facebook_matches = FACEBOOK_LINK_REGEX.findall(message_text)
    
    # Tìm phone/bank account trong tin nhắn
    has_phone = PHONE_REGEX.search(message_text)
    has_bank_account = BANK_ACCOUNT_REGEX.search(message_text)
    
    # Xử lý Facebook links
    if facebook_matches:
        facebook_url = facebook_matches[0]  # Lấy match đầu tiên
        logger.info(f"Phát hiện link Facebook trong group {update.effective_chat.title}: {facebook_url}")
        
        try:
            # Gửi typing action
            await context.bot.send_chat_action(chat_id=chat_id, action='typing')
            
            logger.info(f"Đang kiểm tra Facebook URL: {facebook_url}")
            
            # Tìm admin từ Facebook URL
            admin = find_admin_by_facebook_url(facebook_url)
            
            # Tạo response message chuẩn
            response_message = create_standard_response(admin, 'facebook')
            
            if admin:
                logger.info(f"✅ Tìm thấy admin: {admin['name']}")
            else:
                logger.info(f"❌ Không tìm thấy admin cho URL: {facebook_url}")
            
            # Reply tin nhắn gốc với thông tin
            await update.message.reply_text(response_message)
            
        except Exception as error:
            logger.error(f"Lỗi khi xử lý link Facebook: {error}")
            await update.message.reply_text(
                '❌ Có lỗi xảy ra khi kiểm tra link. Vui lòng thử lại sau.'
            )
    
    # Xử lý Phone/Bank Account (nếu không có Facebook link)
    elif has_phone or has_bank_account:
        logger.info(f"Phát hiện phone/bank trong group {update.effective_chat.title}: {message_text[:50]}...")
        
        try:
            # Gửi typing action
            await context.bot.send_chat_action(chat_id=chat_id, action='typing')
            
            logger.info(f"Đang kiểm tra contact info: {message_text}")
            
            # Tìm admin từ phone/bank account
            admin = find_admin_by_contact(message_text)
            
            # Tạo response message chuẩn với loại match phù hợp
            match_type = 'phone'  # default
            if admin and admin.get('matchType') == 'bank':
                match_type = 'bank'
            
            response_message = create_standard_response(admin, match_type)
            
            if admin:
                logger.info(f"✅ Tìm thấy admin qua {admin.get('matchType', 'contact')}: {admin['name']}")
            else:
                logger.info("❌ Không tìm thấy admin cho contact info")
            
            # Reply tin nhắn gốc với thông tin
            await update.message.reply_text(response_message)
            
        except Exception as error:
            logger.error(f"Lỗi khi xử lý contact info: {error}")
            await update.message.reply_text(
                '❌ Có lỗi xảy ra khi kiểm tra thông tin liên hệ. Vui lòng thử lại sau.'
            )

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Command /start cho bot"""
    welcome_message = """🤖 **CheckScam Bot đã sẵn sàng!**

Bot sẽ tự động kiểm tra khi có ai đó gửi link Facebook trong group.

**Tính năng:**
✅ Tự động phát hiện link FB
✅ Kiểm tra admin trong database CheckScam
✅ Hiển thị thông tin bảo hiểm
✅ Cảnh báo nếu không tìm thấy

**Cách sử dụng:**
Chỉ cần gửi link Facebook vào group, bot sẽ tự động phản hồi!"""

    await update.message.reply_text(welcome_message, parse_mode='Markdown')

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Command /help"""
    help_message = """📋 **Hướng dẫn sử dụng CheckScam Bot**

**Tính năng tự động:**
🔍 **Facebook Link** - Paste link FB để kiểm tra admin
📱 **Số điện thoại** - Paste SĐT để kiểm tra admin  
🏦 **Số tài khoản** - Paste STK để kiểm tra admin

**Commands:**
/start - Khởi động bot
/help - Hiển thị hướng dẫn
/stats - Thống kê database admin
/sync - Sync data (chỉ admin bot)

**Ví dụ sử dụng:**
• Paste: https://facebook.com/profile.php?id=123456
• Paste: 0763666222
• Paste: 0491000133345
• Paste: "Check số này: 0763666222"

**Lưu ý:**
- Bot hoạt động trong group/supergroup và private chat
- Tự động reply khi phát hiện FB link, SĐT, hoặc STK
- Chỉ kiểm tra được admin có trong database CheckScam"""

    await update.message.reply_text(help_message, parse_mode='Markdown')

async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Command /stats"""
    # Load admin mapping để lấy stats
    admin_mapping = {}
    try:
        with open('admin-facebook-mapping.json', 'r', encoding='utf-8') as file:
            admin_mapping = json.load(file)
    except Exception as error:
        logger.error(f"Không thể load admin mapping: {error}")
    
    total_admins = len(admin_mapping)
    admins_with_facebook = sum(1 for admin in admin_mapping.values() if admin.get('facebookUrl'))
    admins_without_facebook = total_admins - admins_with_facebook
    
    coverage_percent = (admins_with_facebook / total_admins * 100) if total_admins > 0 else 0
    
    stats_message = f"""📊 **Thống kê Database CheckScam**

👥 Tổng số Admin: {total_admins}
📘 Có Facebook: {admins_with_facebook}
❌ Chưa có Facebook: {admins_without_facebook}
🛡️ Bảo hiểm: 80.000.000 VNĐ/admin
🔄 Cập nhật: {datetime.now().strftime('%d/%m/%Y')}

**Tỷ lệ coverage:** {coverage_percent:.1f}%

Database được đồng bộ từ: admin.checkscam.vn"""

    await update.message.reply_text(stats_message, parse_mode='Markdown')

async def sync_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Command /sync - Sync admin data (chỉ admin bot)"""
    user_id = update.effective_user.id
    
    # Kiểm tra quyền admin (thay YOUR_ADMIN_ID bằng Telegram ID của bạn)
    admin_ids = [123456789]  # Thay bằng ID Telegram của bạn
    
    if user_id not in admin_ids:
        await update.message.reply_text('❌ Bạn không có quyền sử dụng lệnh này')
        return
    
    try:
        await update.message.reply_text('🔄 Đang sync admin data...')
        
        # Import sync function
        from sync_admin_data import sync_admin_data
        result = await sync_admin_data()
        
        sync_message = f"""✅ **Sync thành công!**

📊 Tổng admin: {result['totalAdmins']}
📘 Có Facebook: {result['adminsWithFacebook']}
📅 Cập nhật: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}

Bot đã reload data mới!"""

        await update.message.reply_text(sync_message, parse_mode='Markdown')
        
        # Reload admin mapping trong memory
        global admins_data
        admins_data = load_admins_data()
        
    except Exception as error:
        logger.error(f"Lỗi sync: {error}")
        await update.message.reply_text('❌ Có lỗi khi sync data. Kiểm tra log.')

def main():
    """Main function"""
    # Tạo application
    application = Application.builder().token(TOKEN).build()
    
    # Thêm handlers
    application.add_handler(CommandHandler("start", start_command))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("stats", stats_command))
    application.add_handler(CommandHandler("sync", sync_command))
    
    # Handler cho tất cả tin nhắn text
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    # Chạy bot
    logger.info('🤖 CheckScam Telegram Bot đã khởi động!')
    logger.info('🔍 Bot sẽ tự động phát hiện Facebook URL, SĐT, và STK trong tin nhắn...')
    
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()