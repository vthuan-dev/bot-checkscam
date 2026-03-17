#!/usr/bin/env python3
"""
Facebook Admin Lookup Module - Python Version
Tìm kiếm admin từ Facebook URL
"""

import json
import re
import logging
from typing import Optional, Dict, Any, List

logger = logging.getLogger(__name__)

# Load admin mapping
admin_mapping = {}
try:
    with open('admin-facebook-mapping.json', 'r', encoding='utf-8') as file:
        admin_mapping = json.load(file)
except Exception as error:
    logger.error(f"Không thể load admin mapping: {error}")

def find_admin_by_facebook_url(facebook_url: str) -> Optional[Dict[str, Any]]:
    """
    Tìm admin từ Facebook URL
    """
    try:
        # Extract Facebook ID từ URL (profile.php?id=XXXXX)
        id_match = re.search(r'(?:profile\.php\?id=|facebook\.com/)(\d+)', facebook_url)
        if id_match:
            facebook_id = id_match.group(1)
            
            # Tìm admin có Facebook ID tương ứng
            for admin_name, admin_data in admin_mapping.items():
                if admin_data.get('facebookId') == facebook_id:
                    return {
                        'name': admin_data['name'],
                        'adminUrl': admin_data['adminUrl'],
                        'facebookUrl': admin_data['facebookUrl'],
                        'facebookId': admin_data['facebookId']
                    }
        
        # Extract username từ URL (facebook.com/username)
        username_match = re.search(r'facebook\.com/([a-zA-Z0-9\.\_\-]+)', facebook_url)
        if username_match:
            username = username_match.group(1)
            logger.info(f"Tìm kiếm username: {username}")
            
            # Tìm admin có Facebook URL chứa username này
            for admin_name, admin_data in admin_mapping.items():
                if admin_data.get('facebookUrl'):
                    admin_url = admin_data['facebookUrl']
                    # Check nếu URL chứa username
                    if f"facebook.com/{username}" in admin_url or f"fb.com/{username}" in admin_url:
                        return {
                            'name': admin_data['name'],
                            'adminUrl': admin_data['adminUrl'],
                            'facebookUrl': admin_data['facebookUrl'],
                            'facebookId': admin_data.get('facebookId', '')
                        }
        
        return None
    except Exception as error:
        logger.error(f"Lỗi khi tìm admin: {error}")
        return None
def find_admin_by_name(name: str) -> List[Dict[str, Any]]:
    """
    Tìm admin từ tên (fuzzy search)
    """
    results = []
    search_name = name.lower().strip()
    
    for admin_name, admin_data in admin_mapping.items():
        admin_name_lower = admin_name.lower()
        
        # Exact match
        if admin_name_lower == search_name:
            results.insert(0, admin_data)  # Đưa lên đầu
        # Contains match
        elif search_name in admin_name_lower or admin_name_lower in search_name:
            results.append(admin_data)
    
    return results[:5]  # Giới hạn 5 kết quả

def get_all_admins_with_facebook() -> List[Dict[str, Any]]:
    """
    Lấy tất cả admin có Facebook
    """
    return [admin for admin in admin_mapping.values() if admin.get('facebookUrl')]

def format_admin_info(admin: Dict[str, Any]) -> str:
    """
    Format thông tin admin để hiển thị
    """
    info = f"👤 **{admin['name']}**\n"
    info += f"🔗 Admin: {admin['adminUrl']}\n"
    if admin.get('facebookUrl'):
        info += f"📘 Facebook: {admin['facebookUrl']}"
    return info

# Test function
if __name__ == '__main__':
    # Test với URL có trong data
    test_url = 'https://www.facebook.com/profile.php?id=100013965611470'  # Khang Khang
    result = find_admin_by_facebook_url(test_url)
    
    if result:
        print('✅ Tìm thấy admin:')
        print(format_admin_info(result))
    else:
        print('❌ Không tìm thấy admin với URL này')
    
    # Test search by name
    print('\n--- Test search by name ---')
    name_results = find_admin_by_name('Khang')
    for admin in name_results:
        print(format_admin_info(admin))
        print('---')