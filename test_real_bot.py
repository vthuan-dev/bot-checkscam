#!/usr/bin/env python3
"""
Test bot thật với RAM monitoring
"""

import os
import psutil
import time
import threading
import signal
import sys
from datetime import datetime

# Global variables
monitoring = True
memory_samples = []

def get_memory_usage():
    """Lấy memory usage của process hiện tại"""
    process = psutil.Process(os.getpid())
    memory_info = process.memory_info()
    return {
        'rss': memory_info.rss / 1024 / 1024,  # MB
        'vms': memory_info.vms / 1024 / 1024,  # MB
        'percent': process.memory_percent()
    }

def memory_monitor():
    """Background thread để monitor memory"""
    global monitoring, memory_samples
    
    print("🔍 Starting memory monitor...")
    while monitoring:
        memory = get_memory_usage()
        memory_samples.append({
            'time': datetime.now(),
            'rss': memory['rss'],
            'vms': memory['vms'],
            'percent': memory['percent']
        })
        
        # Print every 10 seconds
        if len(memory_samples) % 2 == 0:  # Every 10 seconds (5s interval * 2)
            timestamp = datetime.now().strftime("%H:%M:%S")
            print(f"📊 {timestamp} - RAM: {memory['rss']:.1f} MB ({memory['percent']:.1f}%)")
        
        time.sleep(5)

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    global monitoring
    print('\n🛑 Stopping bot and memory monitor...')
    monitoring = False
    
    if memory_samples:
        print("\n📊 Memory Usage Summary:")
        rss_values = [s['rss'] for s in memory_samples]
        print(f"Min RAM: {min(rss_values):.1f} MB")
        print(f"Max RAM: {max(rss_values):.1f} MB")
        print(f"Avg RAM: {sum(rss_values)/len(rss_values):.1f} MB")
        print(f"Samples: {len(memory_samples)}")
        print(f"Duration: {(memory_samples[-1]['time'] - memory_samples[0]['time']).total_seconds():.0f}s")
    
    sys.exit(0)

def main():
    """Main function"""
    print("🐍 CheckScam Telegram Bot - Real Bot RAM Test")
    print("=" * 50)
    
    # Setup signal handler
    signal.signal(signal.SIGINT, signal_handler)
    
    # Initial memory
    initial_memory = get_memory_usage()
    print(f"📊 Initial RAM: {initial_memory['rss']:.1f} MB")
    
    # Start memory monitor thread
    monitor_thread = threading.Thread(target=memory_monitor, daemon=True)
    monitor_thread.start()
    
    try:
        print("🚀 Starting bot...")
        print("⚠️  Bot sẽ chạy và monitor RAM. Nhấn Ctrl+C để dừng.")
        print("📱 Test bot bằng cách gửi link Facebook vào chat với bot.")
        print("-" * 50)
        
        # Import và chạy bot
        from bot_simple import main as run_bot
        run_bot()
        
    except KeyboardInterrupt:
        signal_handler(None, None)
    except Exception as e:
        print(f"❌ Error: {e}")
        monitoring = False

if __name__ == '__main__':
    main()