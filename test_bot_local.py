#!/usr/bin/env python3
"""
Test bot locally để debug
"""

import re
from facebook_admin_lookup import find_admin_by_facebook_url

# Test regex patterns
FACEBOOK_LINK_REGEX = re.compile(
    r'https?://(?:www\.)?(?:facebook|fb)\.com/(?:profile\.php\?id=\d+|[\w\.]+)',
    re.IGNORECASE
)

def test_facebook_regex():
    """Test Facebook regex"""
    test_urls = [
        "https://www.facebook.com/Duong.GDTG.TichXanh",
        "https://www.facebook.com/profile.php?id=100005959991439",
        "facebook.com/testuser",
        "https://facebook.com/profile.php?id=123456789"
    ]
    
    print("🧪 Testing Facebook Regex:")
    for url in test_urls:
        matches = FACEBOOK_LINK_REGEX.findall(url)
        print(f"URL: {url}")
        print(f"Matches: {matches}")
        print(f"Match: {'✅' if matches else '❌'}")
        print("---")

def test_admin_lookup():
    """Test admin lookup"""
    test_urls = [
        "https://www.facebook.com/Duong.GDTG.TichXanh",  # Không có trong DB
        "https://www.facebook.com/profile.php?id=100005959991439",  # Nguyễn Hoàng Dương
        "https://www.facebook.com/profile.php?id=183405541",  # Tống Hoàng Phương Dương
    ]
    
    print("\n🔍 Testing Admin Lookup:")
    for url in test_urls:
        print(f"Testing: {url}")
        admin = find_admin_by_facebook_url(url)
        if admin:
            print(f"✅ Found: {admin['name']}")
            print(f"   Admin URL: {admin['adminUrl']}")
        else:
            print("❌ Not found")
        print("---")

def test_message_processing():
    """Test message processing như trong bot"""
    test_messages = [
        "Xin chào https://www.facebook.com/Duong.GDTG.TichXanh",
        "Check admin này: https://www.facebook.com/profile.php?id=100005959991439",
        "Không có link Facebook",
        "Multiple links: https://facebook.com/user1 và https://facebook.com/profile.php?id=123"
    ]
    
    print("\n📨 Testing Message Processing:")
    for message in test_messages:
        print(f"Message: {message}")
        matches = FACEBOOK_LINK_REGEX.findall(message)
        print(f"Facebook matches: {matches}")
        
        if matches:
            # Lấy URL đầu tiên
            facebook_url = matches[0]
            print(f"Processed URL: {facebook_url}")
            
            admin = find_admin_by_facebook_url(facebook_url)
            if admin:
                print(f"✅ Admin found: {admin['name']}")
            else:
                print("❌ Admin not found")
        print("---")

if __name__ == '__main__':
    test_facebook_regex()
    test_admin_lookup()
    test_message_processing()