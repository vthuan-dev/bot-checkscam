#!/usr/bin/env python3
"""
Setup script cho CheckScam Telegram Bot Python
"""

import subprocess
import sys
import os
from pathlib import Path

def install_requirements():
    """Cài đặt requirements"""
    print("📦 Cài đặt Python packages...")
    try:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'])
        print("✅ Đã cài đặt thành công tất cả packages!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Lỗi khi cài đặt packages: {e}")
        return False
    return True

def check_env_file():
    """Kiểm tra file .env"""
    env_file = Path('.env')
    if not env_file.exists():
        print("⚠️  File .env không tồn tại!")
        print("📝 Tạo file .env với nội dung:")
        print("TELEGRAM_BOT_TOKEN=your_bot_token_here")
        return False
    
    # Đọc và kiểm tra token
    with open(env_file, 'r') as f:
        content = f.read()
        if 'TELEGRAM_BOT_TOKEN=' not in content or 'your_bot_token_here' in content:
            print("⚠️  Vui lòng cập nhật TELEGRAM_BOT_TOKEN trong file .env")
            return False
    
    print("✅ File .env đã được cấu hình!")
    return True

def check_data_files():
    """Kiểm tra các file data cần thiết"""
    required_files = [
        'admin-facebook-mapping.json',
        'admin-contact-mapping.json'
    ]
    
    missing_files = []
    for file_name in required_files:
        if not Path(file_name).exists():
            missing_files.append(file_name)
    
    if missing_files:
        print(f"⚠️  Thiếu các file data: {', '.join(missing_files)}")
        print("📝 Tạo file data mẫu...")
        
        # Tạo file mẫu
        if 'admin-facebook-mapping.json' in missing_files:
            sample_mapping = {
                "Admin Sample": {
                    "name": "Admin Sample",
                    "adminUrl": "https://admin.checkscam.vn/admin/sample",
                    "facebookUrl": "https://facebook.com/profile.php?id=123456789",
                    "facebookId": "123456789"
                }
            }
            with open('admin-facebook-mapping.json', 'w', encoding='utf-8') as f:
                import json
                json.dump(sample_mapping, f, ensure_ascii=False, indent=2)
        
        if 'admin-contact-mapping.json' in missing_files:
            sample_contact = {
                "Admin Sample": {
                    "name": "Admin Sample",
                    "adminUrl": "https://admin.checkscam.vn/admin/sample",
                    "phone": "0123456789",
                    "bankAccounts": {
                        "Vietcombank": "1234567890"
                    }
                }
            }
            with open('admin-contact-mapping.json', 'w', encoding='utf-8') as f:
                import json
                json.dump(sample_contact, f, ensure_ascii=False, indent=2)
        
        print("✅ Đã tạo file data mẫu!")
    else:
        print("✅ Tất cả file data đã sẵn sàng!")
    
    return True

def main():
    """Main setup function"""
    print("🔧 Thiết lập CheckScam Telegram Bot (Python Version)")
    print("=" * 50)
    
    # Kiểm tra Python version
    if sys.version_info < (3, 8):
        print("❌ Cần Python 3.8 trở lên!")
        return
    
    print(f"✅ Python version: {sys.version}")
    
    # Cài đặt requirements
    if not install_requirements():
        return
    
    # Kiểm tra .env
    if not check_env_file():
        return
    
    # Kiểm tra data files
    check_data_files()
    
    print("\n🎉 Setup hoàn tất!")
    print("\n📋 Cách chạy bot:")
    print("  python run.py          # Chạy bot full version")
    print("  python run.py simple   # Chạy bot simple version")
    print("  python bot.py          # Chạy trực tiếp bot full")
    print("  python bot_simple.py   # Chạy trực tiếp bot simple")

if __name__ == '__main__':
    main()