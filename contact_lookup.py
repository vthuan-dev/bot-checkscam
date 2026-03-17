#!/usr/bin/env python3
"""
Contact Lookup Module - Python Version
Tìm kiếm admin từ số điện thoại và số tài khoản ngân hàng
"""

import json
import re
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

# Load admin contact mapping
admin_contact_mapping = {}
try:
    with open('admin-contact-mapping.json', 'r', encoding='utf-8') as file:
        admin_contact_mapping = json.load(file)
except Exception as error:
    logger.error(f"Không thể load admin contact mapping: {error}")

def find_admin_by_phone(phone: str) -> Optional[Dict[str, Any]]:
    """
    Tìm admin từ số điện thoại
    """
    try:
        # Normalize phone number (remove spaces, dashes, etc.)
        normalized_phone = re.sub(r'[\s\-\(\)]', '', phone)
        
        for admin_name, admin_data in admin_contact_mapping.items():
            if admin_data.get('phone'):
                admin_phone = re.sub(r'[\s\-\(\)]', '', admin_data['phone'])
                if admin_phone == normalized_phone:
                    return {
                        'name': admin_data['name'],
                        'adminUrl': admin_data['adminUrl'],
                        'facebookUrl': admin_data.get('facebookUrl'),
                        'phone': admin_data['phone'],
                        'matchType': 'phone'
                    }
        
        return None
    except Exception as error:
        logger.error(f"Lỗi khi tìm admin bằng phone: {error}")
        return None

def find_admin_by_bank_account(bank_account: str) -> Optional[Dict[str, Any]]:
    """
    Tìm admin từ số tài khoản ngân hàng
    """
    try:
        # Normalize bank account (remove spaces, dashes, etc.)
        normalized_account = re.sub(r'[\s\-]', '', bank_account)
        
        for admin_name, admin_data in admin_contact_mapping.items():
            if admin_data.get('bankAccounts'):
                for bank_name, account_number in admin_data['bankAccounts'].items():
                    if re.sub(r'[\s\-]', '', account_number) == normalized_account:
                        return {
                            'name': admin_data['name'],
                            'adminUrl': admin_data['adminUrl'],
                            'facebookUrl': admin_data.get('facebookUrl'),
                            'phone': admin_data.get('phone'),
                            'matchType': 'bank',
                            'matchedBank': bank_name,
                            'matchedAccount': account_number
                        }
        
        return None
    except Exception as error:
        logger.error(f"Lỗi khi tìm admin bằng bank account: {error}")
        return None
def find_admin_by_contact(text: str) -> Optional[Dict[str, Any]]:
    """
    Detect và tìm admin từ text (phone hoặc bank account)
    """
    # Regex patterns - cải thiện để lọc chính xác
    phone_pattern = re.compile(r'(?:^|\s)((?:0|\+84)[0-9]{8,10})(?=\s|$)')
    bank_account_pattern = re.compile(r'(?:^|\s)(\d{10,20})(?=\s|$)')
    
    # Tìm phone numbers
    phone_matches = phone_pattern.findall(text)
    if phone_matches:
        for phone in phone_matches:
            result = find_admin_by_phone(phone)
            if result:
                return result
    
    # Tìm bank accounts
    bank_matches = bank_account_pattern.findall(text)
    if bank_matches:
        for account in bank_matches:
            result = find_admin_by_bank_account(account)
            if result:
                return result
    
    return None

def format_admin_contact_info(admin: Dict[str, Any]) -> str:
    """
    Format thông tin admin contact để hiển thị
    """
    info = f"🕵️ **FB Real của: \"{admin['name']}\"**\n"
    info += "🎖 GDV này có bảo hiểm tại Checkscam.vn\n"
    info += f"🔗 {admin['adminUrl']}\n"
    
    if admin.get('facebookUrl'):
        info += f"📘 Facebook: {admin['facebookUrl']}\n"
    
    if admin.get('phone'):
        info += f"📱 Phone: {admin['phone']}\n"
    
    if admin.get('matchType') == 'phone':
        info += "✅ **Xác nhận qua SĐT**"
    elif admin.get('matchType') == 'bank':
        info += f"✅ **Xác nhận qua STK {admin.get('matchedBank', '')}**"
    
    return info

# Test function
if __name__ == '__main__':
    print('🧪 Testing Contact Lookup...\n')
    
    # Test phone
    print('=== Test Phone ===')
    phone_result = find_admin_by_phone('0763666222')
    if phone_result:
        print('✅ Found by phone:')
        print(format_admin_contact_info(phone_result))
    else:
        print('❌ Not found by phone')
    
    # Test bank account
    print('\n=== Test Bank Account ===')
    bank_result = find_admin_by_bank_account('0491000133345')
    if bank_result:
        print('✅ Found by bank account:')
        print(format_admin_contact_info(bank_result))
    else:
        print('❌ Not found by bank account')
    
    # Test mixed text
    print('\n=== Test Mixed Text ===')
    mixed_text = 'Anh em check giúp số này: 0763666222 và stk 0491000133345'
    mixed_result = find_admin_by_contact(mixed_text)
    if mixed_result:
        print('✅ Found in mixed text:')
        print(format_admin_contact_info(mixed_result))
    else:
        print('❌ Not found in mixed text')