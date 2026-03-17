#!/usr/bin/env python3
"""
Test RAM usage của CheckScam Telegram Bot Python
"""

import os
import psutil
import time
import threading
from datetime import datetime

def get_memory_usage():
    """Lấy memory usage của process hiện tại"""
    process = psutil.Process(os.getpid())
    memory_info = process.memory_info()
    return {
        'rss': memory_info.rss / 1024 / 1024,  # MB
        'vms': memory_info.vms / 1024 / 1024,  # MB
        'percent': process.memory_percent()
    }

def monitor_memory(duration=60):
    """Monitor memory usage trong duration giây"""
    print(f"🔍 Monitoring memory usage for {duration} seconds...")
    print("Time\t\tRSS (MB)\tVMS (MB)\tPercent")
    print("-" * 50)
    
    start_time = time.time()
    max_rss = 0
    min_rss = float('inf')
    samples = []
    
    while time.time() - start_time < duration:
        memory = get_memory_usage()
        rss = memory['rss']
        vms = memory['vms']
        percent = memory['percent']
        
        max_rss = max(max_rss, rss)
        min_rss = min(min_rss, rss)
        samples.append(rss)
        
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"{timestamp}\t{rss:.1f}\t\t{vms:.1f}\t\t{percent:.1f}%")
        
        time.sleep(5)  # Sample every 5 seconds
    
    avg_rss = sum(samples) / len(samples)
    
    print("\n📊 Memory Usage Summary:")
    print(f"Min RSS: {min_rss:.1f} MB")
    print(f"Max RSS: {max_rss:.1f} MB") 
    print(f"Avg RSS: {avg_rss:.1f} MB")
    print(f"Samples: {len(samples)}")

def test_bot_startup():
    """Test memory usage khi startup bot"""
    print("🚀 Testing bot startup memory usage...")
    
    # Memory trước khi import
    print("📊 Memory before imports:")
    memory_before = get_memory_usage()
    print(f"RSS: {memory_before['rss']:.1f} MB")
    
    # Import bot modules
    print("\n📦 Importing bot modules...")
    try:
        from telegram.ext import Application
        from facebook_admin_lookup import find_admin_by_facebook_url
        from contact_lookup import find_admin_by_contact
        
        print("✅ Modules imported successfully")
        
        # Memory sau khi import
        print("\n📊 Memory after imports:")
        memory_after = get_memory_usage()
        print(f"RSS: {memory_after['rss']:.1f} MB")
        print(f"Import overhead: {memory_after['rss'] - memory_before['rss']:.1f} MB")
        
        # Test tạo Application (không start)
        print("\n🤖 Creating Telegram Application...")
        token = os.getenv('TELEGRAM_BOT_TOKEN', 'dummy_token_for_test')
        
        if token == 'dummy_token_for_test':
            print("⚠️  No real token found, using dummy token for memory test")
        
        try:
            app = Application.builder().token(token).build()
            print("✅ Application created successfully")
            
            # Memory sau khi tạo app
            print("\n📊 Memory after creating Application:")
            memory_app = get_memory_usage()
            print(f"RSS: {memory_app['rss']:.1f} MB")
            print(f"Application overhead: {memory_app['rss'] - memory_after['rss']:.1f} MB")
            
        except Exception as e:
            print(f"⚠️  Could not create Application: {e}")
            print("This is normal if no valid token is provided")
        
    except Exception as e:
        print(f"❌ Error importing modules: {e}")
        return False
    
    return True

def test_data_loading():
    """Test memory usage khi load data"""
    print("\n📁 Testing data loading memory usage...")
    
    memory_before = get_memory_usage()
    print(f"Memory before loading data: {memory_before['rss']:.1f} MB")
    
    try:
        import json
        
        # Load admin mappings
        files_to_load = [
            'admin-facebook-mapping.json',
            'admin-contact-mapping.json',
            'facebook-links.json'
        ]
        
        total_size = 0
        for filename in files_to_load:
            if os.path.exists(filename):
                with open(filename, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    size = len(str(data))
                    total_size += size
                    print(f"✅ Loaded {filename}: {len(data)} items, ~{size/1024:.1f} KB")
            else:
                print(f"⚠️  File not found: {filename}")
        
        memory_after = get_memory_usage()
        print(f"\nMemory after loading data: {memory_after['rss']:.1f} MB")
        print(f"Data loading overhead: {memory_after['rss'] - memory_before['rss']:.1f} MB")
        print(f"Total data size: ~{total_size/1024:.1f} KB")
        
    except Exception as e:
        print(f"❌ Error loading data: {e}")

def main():
    """Main test function"""
    print("🐍 CheckScam Telegram Bot - RAM Usage Test")
    print("=" * 50)
    
    # System info
    print(f"🖥️  System: {psutil.virtual_memory().total / 1024 / 1024 / 1024:.1f} GB RAM")
    print(f"🐍 Python: {os.sys.version}")
    print(f"📁 Working directory: {os.getcwd()}")
    
    # Initial memory
    print(f"\n📊 Initial memory usage:")
    initial_memory = get_memory_usage()
    print(f"RSS: {initial_memory['rss']:.1f} MB")
    print(f"VMS: {initial_memory['vms']:.1f} MB")
    print(f"Percent: {initial_memory['percent']:.1f}%")
    
    # Test startup
    if test_bot_startup():
        print("\n✅ Bot startup test completed")
    
    # Test data loading
    test_data_loading()
    
    # Final memory
    print(f"\n📊 Final memory usage:")
    final_memory = get_memory_usage()
    print(f"RSS: {final_memory['rss']:.1f} MB")
    print(f"Total overhead: {final_memory['rss'] - initial_memory['rss']:.1f} MB")
    
    # Monitor for a short time
    print(f"\n🔍 Monitoring memory for 30 seconds...")
    monitor_memory(30)
    
    print(f"\n🎉 Test completed!")
    print(f"💡 Estimated bot RAM usage: {final_memory['rss']:.1f} MB")

if __name__ == '__main__':
    main()